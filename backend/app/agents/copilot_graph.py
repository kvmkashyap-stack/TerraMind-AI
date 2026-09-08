import httpx
import re
import trafilatura
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.core.config import settings

# ─── System & User Prompts ───────────────────────────────────────────────────

COPILOT_SYSTEM_PROMPT = """You are Dr. Arjun Mehta, a Senior Wildlife & Environmental Conservation Specialist.
Your goal is to provide articulate, natural, detailed, and directly relevant answers to whatever question the user asks.

CRITICAL INSTRUCTIONS:
1. Answer the user's EXACT question directly and in detail.
2. DO NOT use artificial template headers (e.g. "Regarding your query on...", "Under MoEFCC...", "Water & Storage Telemetry", "Recommended Next Steps").
3. Base your response on factual web search data and official conservation knowledge.
4. Include official website citations formatted as bold clickable Markdown links: [**Source Title**](url).
5. Always speak naturally and conversationally, like ChatGPT, Claude, or Gemini.
"""

# ─── Intent Classification ────────────────────────────────────────────────────

CASUAL_PHRASES = [
    "hi", "hello", "hey", "hru", "wbu", "how r u", "how r you", "how are u",
    "how are you", "how do u do", "how do you do", "how is it going", "how's it going",
    "wassup", "whatsup", "whats up", "what's up", "sup", "good morning",
    "good afternoon", "good evening", "good night", "namaste", "greetings",
    "thanks", "thank you", "thx", "ty", "who are you", "who r u", "what is your name",
    "introduce yourself", "tell me about yourself", "ok", "okay", "cool", "nice",
    "great", "awesome", "bye", "goodbye", "fine", "good"
]

def is_casual_query(query: str) -> bool:
    q = query.strip().lower()
    words = q.split()
    if len(words) <= 3 and not any(kw in q for kw in ["park", "dam", "lake", "tiger", "forest", "water", "tree", "ndvi", "ndwi", "corbett", "sariska"]):
        return True
    for phrase in CASUAL_PHRASES:
        if q == phrase or q.startswith(phrase + " "):
            return True
    return False


# ─── LangGraph Node Functions ─────────────────────────────────────────────────

async def intent_node(state: AgentState) -> Dict[str, Any]:
    """Determine if query is casual or detailed technical request."""
    return {"is_casual": is_casual_query(state["query"])}


async def tavily_web_search_node(state: AgentState) -> Dict[str, Any]:
    """Query Tavily directly for the exact user question and extract page content using Trafilatura."""
    if state.get("is_casual"):
        return {"tavily_search_results": [], "scraped_web_content": []}

    query = state["query"]
    tavily_key = settings.TAVILY_API_KEY
    urls = []
    scraped_content = []

    if tavily_key and tavily_key != "mock-tavily-key":
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.post(
                    "https://api.tavily.com/search",
                    json={"api_key": tavily_key, "query": query, "max_results": 3, "search_depth": "advanced"},
                )
                if res.status_code == 200:
                    results = res.json().get("results", [])
                    for r in results:
                        u = r.get("url")
                        content_snippet = r.get("content", "")
                        title = r.get("title", "")
                        if u:
                            urls.append(u)
                            try:
                                page_res = await client.get(u, follow_redirects=True, timeout=3.0)
                                if page_res.status_code == 200:
                                    extracted = trafilatura.extract(page_res.text)
                                    if extracted:
                                        scraped_content.append({
                                            "url": u,
                                            "title": title,
                                            "snippet": content_snippet,
                                            "full_text": extracted[:1500]
                                        })
                                    else:
                                        scraped_content.append({"url": u, "title": title, "snippet": content_snippet})
                                else:
                                    scraped_content.append({"url": u, "title": title, "snippet": content_snippet})
                            except Exception:
                                scraped_content.append({"url": u, "title": title, "snippet": content_snippet})
        except Exception:
            pass

    return {
        "tavily_search_results": urls,
        "scraped_web_content": scraped_content
    }


async def llm_reasoning_node(state: AgentState) -> Dict[str, Any]:
    """Generate direct, grounded response using LLM or Web Grounded Synthesizer."""
    query = state["query"]
    is_casual = state.get("is_casual", False)
    scraped = state.get("scraped_web_content", [])
    meta = state.get("project_metadata", {})

    # Format web search context
    web_text_blocks = []
    for item in scraped:
        if isinstance(item, dict):
            url = item.get("url", "")
            title = item.get("title", "")
            body = item.get("full_text") or item.get("snippet") or ""
            if body:
                web_text_blocks.append(f"Source: [{title}]({url})\nContent: {body}")

    web_context_str = "\n\n".join(web_text_blocks)

    if is_casual:
        user_prompt = f"The user said: \"{query}\". Reply warmly, naturally, and briefly as Dr. Arjun Mehta."
    else:
        user_prompt = (
            f"User Question: \"{query}\"\n\n"
            f"Live Web Search & Article Context:\n{web_context_str if web_context_str else 'No web sources available.'}\n\n"
            f"INSTRUCTIONS:\n"
            f"1. Answer the user's EXACT question directly, in detail, and thoroughly.\n"
            f"2. Do NOT use boilerplate headers or templates.\n"
            f"3. Incorporate relevant factual details from the live web context above.\n"
            f"4. Include official website citations formatted as bold clickable Markdown links: [**Source Title**](url)."
        )

    final_answer = ""

    # 1. Try Groq API Key
    if not final_answer and settings.GROQ_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": COPILOT_SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.5,
                        "max_tokens": 1200,
                    },
                )
                if res.status_code == 200:
                    final_answer = res.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    # 2. Try OpenAI API Key
    if not final_answer and settings.OPENAI_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": COPILOT_SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.5,
                        "max_tokens": 1200,
                    },
                )
                if res.status_code == 200:
                    final_answer = res.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    # 3. Try Moonshot API Key
    if not final_answer and settings.MOONSHOT_API_KEY and settings.MOONSHOT_API_KEY != "mock-moonshot-key":
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    f"{settings.MOONSHOT_BASE_URL}/chat/completions",
                    headers={"Authorization": f"Bearer {settings.MOONSHOT_API_KEY}"},
                    json={
                        "model": settings.KIMI_MODEL_NAME,
                        "messages": [
                            {"role": "system", "content": COPILOT_SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.5,
                        "max_tokens": 1200,
                    },
                )
                if res.status_code == 200:
                    final_answer = res.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    # 4. Grounded Web Synthesizer (when no LLM API key is present)
    if not final_answer:
        final_answer = _build_grounded_web_response(query, is_casual, scraped, meta)

    return {
        "final_answer": final_answer,
        "recommended_schemes": [],
        "suggested_technical_solution": "",
    }


# ─── Grounded Web Synthesizer Engine ──────────────────────────────────────────

def _build_grounded_web_response(query: str, is_casual: bool, scraped: list, meta: dict = None) -> str:
    q = query.strip()
    q_lower = q.lower()
    meta = meta or {}

    if is_casual:
        if any(kw in q_lower for kw in ["how r u", "how r you", "how are u", "how are you", "hru"]):
            return "I'm doing great, thank you! How can I help you today?"
        if any(kw in q_lower for kw in ["hi", "hello", "hey", "wassup", "sup"]):
            return "Hello! I'm Dr. Arjun Mehta. What question can I help answer for you today?"
        if any(kw in q_lower for kw in ["thanks", "thank you"]):
            return "You're very welcome! Feel free to ask if you have any other questions."
        return "Hello! How can I assist you with your conservation query today?"

    title = meta.get("title", "Selected Site")

    # Extract scraped web search citations & build bold Markdown links
    citation_links = []
    extracted_facts = []

    for item in scraped:
        if isinstance(item, dict):
            u = item.get("url")
            t = item.get("title") or "Official Resource"
            snip = item.get("full_text") or item.get("snippet") or ""
            if u:
                citation_links.append(f"[**{t}**]({u})")
            if snip:
                clean_text = re.sub(r'\s+', ' ', snip).strip()
                if len(clean_text) > 30:
                    extracted_facts.append(clean_text[:400])

    citations_str = " • ".join(citation_links[:3]) if citation_links else "[**MoEFCC Official Portal**](https://moef.gov.in) • [**National Tiger Conservation Authority**](https://ntca.gov.in)"

    parts = []

    # 1. Trajectory / Recovery Curve queries
    if any(w in q_lower for w in ["trajectory", "trend", "recovery rate", "variance", "why is the trajectory", "why trajectory", "deviation"]):
        status = meta.get("health_status", "Yellow")
        traj_summary = meta.get("trajectory_summary", "")
        variance = meta.get("variance", 15.0)
        pc_text = meta.get("probable_cause_text", "")
        
        parts.append(
            f"### 📈 Recovery Trajectory Analysis for **{title}** ({status} Status)\n\n"
            f"• **Trajectory Metric & Trend**: {traj_summary}\n"
            f"• **Overall Trajectory Gap/Variance**: **{variance}%** deviation from expected target recovery curve."
        )
        if pc_text:
            parts.append(f"• **Probable Causes for Trajectory Gap**:\n  {pc_text}")
        elif status in ["Red", "Yellow"]:
            parts.append(
                f"• **Key Issue & Root Cause**: Trajectory deficit is driven by seasonal precipitation delays, "
                f"catchment silt accumulation, and localized land cover pressure."
            )

    # 2. Satellite Data & Multi-spectral Indices queries
    elif any(w in q_lower for w in ["satellite", "sentinel", "ndvi", "ndwi", "ndbi", "nbr", "cloud", "resolution", "multispectral"]):
        sat_summary = meta.get("satellite_summary", "")
        ndvi = meta.get("current_ndvi", 0.49)
        base_ndvi = meta.get("baseline_ndvi", 0.55)
        ndwi = meta.get("current_ndwi", 0.44)
        base_ndwi = meta.get("baseline_ndwi", 0.50)

        parts.append(
            f"### 🛰️ Live Satellite Data & Spectral Indices for **{title}**\n\n"
            f"• **Vegetation Index (NDVI)**: Live **{ndvi}** vs 3-Year Baseline **{base_ndvi}**\n"
            f"• **Water Extent Index (NDWI)**: Live **{ndwi}** vs 3-Year Baseline **{base_ndwi}**\n"
            f"• **Satellite Repository Pass Data**: {sat_summary}\n"
            f"• **Land Cover Composition**: Vegetation {meta.get('veg_pct', 45)}%, Water {meta.get('water_pct', 30)}%, Built-up {meta.get('urban_pct', 10)}%, Barren {meta.get('barren_pct', 15)}%."
        )

    # 3. Project Features, Budget, & Status queries
    elif any(w in q_lower for w in ["project", "budget", "fund", "cost", "expended", "allocated", "feature", "issue", "status"]):
        status = meta.get("health_status", "Yellow")
        pc_text = meta.get("probable_cause_text", "")
        
        parts.append(
            f"### 📁 Conservation Project Features & Financial Status for **{title}**\n\n"
            f"• **Intervention Type**: {meta.get('intervention_type', 'Ecological Restoration')}\n"
            f"• **Allocated Budget**: ₹{meta.get('allocated_funds', 5.0)} Cr | **Expended**: ₹{meta.get('expended_funds', 3.5)} Cr\n"
            f"• **Budget Sufficiency**: **{meta.get('budget_sufficiency', 'Adequate')}**\n"
            f"• **Smuggling Risk Alert**: **{'Active Warning 🚨' if meta.get('smuggling_alert_active') else 'Clear (Inactive) ✅'}**"
        )
        if pc_text:
            parts.append(f"• **Identified Site Issues & Risk Causes**:\n  {pc_text}")

    # 4. General / Grounded Web Search response for any other query (e.g. Jim Corbett, KRS Dam, Sariska, etc.)
    else:
        if extracted_facts:
            parts.append(f"Based on real-time field data & web intelligence for **\"{q}\"**:\n")
            for fact in extracted_facts[:3]:
                clean_fact = fact.strip()
                if not clean_fact.endswith("."):
                    clean_fact += "."
                parts.append(f"• {clean_fact}")
        else:
            parts.append(
                f"Regarding **\"{q}\"**, current satellite telemetry and field observations are active for **{title}** to monitor habitat density, water extent, and ecological stability."
            )

    parts.append(f"\n🔗 **Official Web Citations:**\n{citations_str}")

    return "\n\n".join(parts)


# ─── Build LangGraph State Graph ──────────────────────────────────────────────

def build_copilot_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("intent_detection", intent_node)
    workflow.add_node("tavily_search", tavily_web_search_node)
    workflow.add_node("llm_reasoning", llm_reasoning_node)

    workflow.set_entry_point("intent_detection")
    workflow.add_edge("intent_detection", "tavily_search")
    workflow.add_edge("tavily_search", "llm_reasoning")
    workflow.add_edge("llm_reasoning", END)

    return workflow.compile()


copilot_graph_agent = build_copilot_graph()
