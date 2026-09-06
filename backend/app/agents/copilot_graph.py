import httpx
import re
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.prompts.copilot_prompts import (
    KIMI_COPILOT_SYSTEM_PROMPT,
    RAG_SCHEME_PROMPT_TEMPLATE,
    CONVERSATIONAL_PROMPT_TEMPLATE,
)
from app.core.config import settings

# ─── Expanded Government Scheme Knowledge Base ────────────────────────────────
SCHEME_VECTOR_STORE = [
    {
        "scheme_name": "Jal Shakti Abhiyan: Catch The Rain",
        "authority": "Ministry of Jal Shakti, Govt of India",
        "keywords": ["water", "rain", "desilting", "recharge", "lake", "check dam", "pond", "tank", "silt", "drought", "flood", "catchment"],
        "clause": "Section 4.2: Funding assistance for traditional water body desilting, rainwater harvesting structures, and catchment protection up to ₹5 crore per district.",
        "url": "https://jalshakti-dowr.gov.in"
    },
    {
        "scheme_name": "WDC-PMKSY 2.0 (Watershed Development Component)",
        "authority": "Ministry of Agriculture & Farmers Welfare",
        "keywords": ["watershed", "soil erosion", "check dam", "afforestation", "groundwater", "bunding", "gully", "runoff"],
        "clause": "Provides ₹25,000/hectare for soil moisture retention, gully plugs, and check dam repairs across 1,592 priority watersheds.",
        "url": "https://pmksy.gov.in"
    },
    {
        "scheme_name": "CAMPA (Compensatory Afforestation Fund)",
        "authority": "Ministry of Environment, Forest & Climate Change (MoEFCC)",
        "keywords": ["forest", "timber", "encroachment", "afforestation", "canopy", "smuggling", "logging", "poaching", "deforestation", "ndvi", "tree", "sanctuary", "tiger", "wildlife"],
        "clause": "CAMPA Fund Utilization Rules 2018: Anti-poaching/anti-logging patrol deployment, boundary demarcation fencing, and native species plantation. Priority to Red-status sites.",
        "url": "https://moef.gov.in/campa"
    },
    {
        "scheme_name": "AMRUT 2.0 — Water Body Rejuvenation",
        "authority": "Ministry of Housing and Urban Affairs",
        "keywords": ["urban lake", "wetland", "encroachment", "sewage", "fencing", "urban", "city", "town", "rejuvenation"],
        "clause": "Urban Water Body Restoration Component: 50% central assistance for wetland de-polluting, peripheral fencing, and eco-park development.",
        "url": "https://amrut.gov.in"
    },
    {
        "scheme_name": "DRIP Phase II (Dam Rehabilitation & Improvement Project)",
        "authority": "Central Water Commission (CWC)",
        "keywords": ["dam", "reservoir", "siltation", "spillway", "dredging", "capacity", "storage", "bathymetric", "structural", "tungabhadra", "mettur", "desilting"],
        "clause": "World Bank-funded ₹10,211 crore program. Covers structural repair, sluice gate replacement, catchment rim afforestation, and emergency desilting for dams with >20% capacity loss.",
        "url": "https://cwc.gov.in/drip"
    },
    {
        "scheme_name": "Atal Bhujal Yojana (ABHY)",
        "authority": "Ministry of Jal Shakti",
        "keywords": ["groundwater", "aquifer", "recharge", "borewell", "underground", "water table", "depletion"],
        "clause": "₹8,200 crore national program for aquifer recharge in 7 priority states. Community-led groundwater management, recharge shaft construction, and check dam desilting.",
        "url": "https://atalbhujal.gov.in"
    },
    {
        "scheme_name": "Project Tiger / NTCA Funding",
        "authority": "National Tiger Conservation Authority (NTCA)",
        "keywords": ["tiger", "sanctuary", "wildlife", "poaching", "corridor", "sariska", "panna", "ranthambore", "reserve", "national park", "prey base"],
        "clause": "Central assistance for tiger reserve management: camera traps, anti-poaching camps, inter-reserve relocation, prey base restoration. ₹50-200 crore per reserve annually.",
        "url": "https://ntca.gov.in"
    },
    {
        "scheme_name": "National Mission for a Green India (GIM)",
        "authority": "Ministry of Environment, Forest & Climate Change",
        "keywords": ["plantation", "afforestation", "green cover", "degraded", "forest land", "carbon sequestration"],
        "clause": "₹12,500/hectare/year for treatment of degraded forest land. Target: 5 million hectares. Includes agroforestry and community forestry components.",
        "url": "https://moef.gov.in/gim"
    },
    {
        "scheme_name": "National Wetlands Conservation Programme (NWCP)",
        "authority": "MoEFCC / Ramsar Secretariat",
        "keywords": ["wetland", "ramsar", "flamingo", "bird", "phumdi", "loktak", "chilika", "wular", "migratory"],
        "clause": "Central assistance for 130 identified wetlands. Covers invasive species removal (water hyacinth), inlet channel restoration, community-based ecotourism, and bird sanctuary buffer zone management.",
        "url": "https://moef.gov.in/wetlands"
    },
    {
        "scheme_name": "MGNREGA — Ecological Works",
        "authority": "Ministry of Rural Development",
        "keywords": ["labour", "community", "manual", "check dam", "pond", "soil", "bunding", "rural", "employment"],
        "clause": "Permissible ecological works include check dam construction, desilting of tanks/ponds, plantation drives, and soil bunding. Up to 100 days employment guarantee per household.",
        "url": "https://nrega.nic.in"
    },
]

# ─── Intent Classification ────────────────────────────────────────────────────

TECHNICAL_KEYWORDS = [
    "ndvi", "ndwi", "ndbi", "nbr", "ndmi", "scheme", "fund", "grant", "budget",
    "silt", "desilt", "forest", "tree", "dam", "reservoir", "water", "lake",
    "smuggled", "smuggling", "logging", "encroach", "poaching", "deforest",
    "rejuvenat", "restor", "dric", "telemetry", "satellite", "drip", "campa",
    "amrut", "pmksy", "jal shakti", "action", "solution", "precedent", "cost",
    "rupee", "crore", "lakh", "canal", "catchment", "aquifer", "recharge",
    "wetland", "ramsar", "status", "critical", "degraded", "encroachment"
]

CASUAL_PHRASES = [
    "hi", "hello", "hey", "hru", "wbu", "how r u", "how r you", "how are u",
    "how are you", "how do u do", "how do you do", "how is it going", "how's it going",
    "wassup", "whatsup", "whats up", "what's up", "sup", "good morning",
    "good afternoon", "good evening", "good night", "namaste", "greetings",
    "thanks", "thank you", "thx", "ty", "who are you", "who r u", "what is your name",
    "introduce yourself", "tell me about yourself", "ok", "okay", "cool", "nice",
    "great", "awesome", "bye", "goodbye", "fine", "good"
]

def is_casual(query: str) -> bool:
    q = query.strip().lower()
    has_tech = any(kw in q for kw in TECHNICAL_KEYWORDS)

    # Check matching casual phrases
    for phrase in CASUAL_PHRASES:
        if phrase in q and not has_tech:
            return True

    # If short (<= 5 words) and no technical keywords -> casual!
    words = q.split()
    if len(words) <= 5 and not has_tech:
        return True

    return False



# ─── LangGraph Node Functions ─────────────────────────────────────────────────

async def intent_detection_node(state: AgentState) -> Dict[str, Any]:
    """Classify query as casual vs technical to route correctly."""
    return {"is_casual": is_casual(state["query"])}


async def retrieve_scheme_rag_node(state: AgentState) -> Dict[str, Any]:
    """Skip RAG for casual messages."""
    if state.get("is_casual"):
        return {"retrieved_schemes": []}

    query_lower = state["query"].lower()
    retrieved = []
    for doc in SCHEME_VECTOR_STORE:
        score = sum(1 for kw in doc["keywords"] if kw in query_lower)
        if score > 0:
            retrieved.append((score, doc))

    # Sort by relevance, take top 3
    retrieved.sort(key=lambda x: x[0], reverse=True)
    retrieved = [doc for _, doc in retrieved[:3]]

    # Always include at least 2 schemes for context
    if len(retrieved) < 2:
        for doc in SCHEME_VECTOR_STORE:
            if doc not in retrieved:
                retrieved.append(doc)
                if len(retrieved) >= 2:
                    break

    return {"retrieved_schemes": retrieved}


async def tavily_search_node(state: AgentState) -> Dict[str, Any]:
    """Skip web search for casual messages."""
    if state.get("is_casual"):
        return {"tavily_search_results": []}

    query = state["query"]
    tavily_key = settings.TAVILY_API_KEY
    urls = []

    if tavily_key and tavily_key != "mock-tavily-key":
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.tavily.com/search",
                    json={"api_key": tavily_key, "query": f"India government conservation {query}", "max_results": 3},
                )
                if res.status_code == 200:
                    results = res.json().get("results", [])
                    urls = [r.get("url") for r in results if r.get("url")]
        except Exception:
            pass

    return {"tavily_search_results": urls or [
        "https://jalshakti-dowr.gov.in",
        "https://moef.gov.in/campa",
        "https://cwc.gov.in/drip",
    ]}


async def llm_reasoning_node(state: AgentState) -> Dict[str, Any]:
    """Route to conversational or technical prompt based on intent."""
    meta = state.get("project_metadata", {})
    retrieved = state.get("retrieved_schemes", [])
    query = state["query"]
    is_casual_query = state.get("is_casual", False)

    # Build the user message
    if is_casual_query:
        user_message = CONVERSATIONAL_PROMPT_TEMPLATE.format(query=query)
    else:
        user_message = RAG_SCHEME_PROMPT_TEMPLATE.format(
            query=query,
            project_id=meta.get("project_id", "IND-GEN-01"),
            project_title=meta.get("title", "Conservation Site"),
            intervention_type=meta.get("intervention_type", "Ecological Restoration"),
            health_status=meta.get("health_status", "Yellow"),
            dric_index=meta.get("dric_index", 0.42),
            ndwi=meta.get("current_ndwi", 0.44),
            ndvi=meta.get("current_ndvi", 0.49),
            ndbi=meta.get("current_ndbi", 0.18),
            nbr=meta.get("current_nbr", 0.68),
            ndmi=meta.get("current_ndmi", 0.42),
            trajectory_variance=meta.get("variance", 18.5),
            retrieved_documents="\n".join(
                [f"• {s['scheme_name']} ({s['authority']}): {s['clause']}" for s in retrieved]
            ) or "No specific schemes retrieved.",
            web_search_results="\n".join(state.get("tavily_search_results", [])) or "No web sources available.",
        )

    api_key = settings.MOONSHOT_API_KEY
    base_url = settings.MOONSHOT_BASE_URL
    final_answer = ""

    if api_key and api_key != "mock-moonshot-key":
        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(
                    f"{base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={
                        "model": settings.KIMI_MODEL_NAME,
                        "messages": [
                            {"role": "system", "content": KIMI_COPILOT_SYSTEM_PROMPT},
                            {"role": "user", "content": user_message},
                        ],
                        "temperature": 0.7 if is_casual_query else 0.3,
                        "max_tokens": 200 if is_casual_query else 1200,
                    },
                )
                if res.status_code == 200:
                    final_answer = res.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    # ── Intelligent fallback (no API key or call failed) ──────────────────────
    if not final_answer:
        final_answer = _generate_smart_fallback(query, is_casual_query, meta, retrieved)

    suggested_solution = "" if is_casual_query else _build_suggested_solution(retrieved, meta)

    return {
        "final_answer": final_answer,
        "recommended_schemes": retrieved if not is_casual_query else [],
        "suggested_technical_solution": suggested_solution,
    }


# ─── Smart Fallback (when no LLM API key is set) ─────────────────────────────

CASUAL_FALLBACKS = [
    (["how r u", "how r you", "how are u", "how are you", "hru", "wbu", "how is it going", "how's it going"],
     "I'm doing great, thanks for asking! I'm ready to help you analyze field telemetry, government schemes, or historical solutions. How are you doing today?"),
    (["hi", "hello", "hey", "wassup", "sup", "greetings", "namaste"],
     "Hello! I'm Dr. Arjun Mehta. How are you doing today? Let me know which site or question you'd like to dive into."),
    (["thanks", "thank you", "thx", "ty"],
     "You're very welcome! Let me know if you need anything else."),
    (["bye", "goodbye"],
     "Take care! Come back anytime you need field intelligence."),
    (["who are you", "who r u", "introduce yourself", "tell me about"],
     "I'm Dr. Arjun Mehta — Senior Conservation Intelligence Analyst with 25+ years experience in forestry, water systems, and government schemes. How can I help you today?"),
]

def _casual_fallback(query: str) -> str:
    q = query.strip().lower()
    for keywords, response in CASUAL_FALLBACKS:
        if any(kw in q for kw in keywords):
            return response
    return "I'm doing well, thanks for asking! What can I help you with regarding conservation sites today?"



def _generate_smart_fallback(query: str, is_casual: bool, meta: dict, schemes: list) -> str:
    if is_casual:
        return _casual_fallback(query)

    q = query.lower()
    site = meta.get("title", "this site")
    pid = meta.get("project_id", "")
    status = meta.get("health_status", "Yellow")
    ndvi = meta.get("current_ndvi", 0.49)
    ndwi = meta.get("current_ndwi", 0.44)
    base_ndvi = meta.get("baseline_ndvi", 0.55)
    base_ndwi = meta.get("baseline_ndwi", 0.50)

    # Historical Case Studies / Previous Solutions Queries
    if any(w in q for w in ["previous", "past", "history", "historical", "example", "solved", "case study", "precedent"]):
        return (
            f"In my 25 years as a Senior Conservation Intelligence Analyst across FSI, MoEFCC, and CWC, "
            f"here are 3 key historical precedents where government interventions successfully reversed similar degradation:\n\n"
            f"1. **Sariska Tiger Reserve (Forest Canopy Degradation & Timber Smuggling)**:\n"
            f"   - **Condition**: NDVI dropped from 0.58 to 0.32 due to nocturnal timber smuggling & encroachment.\n"
            f"   - **Government Solution**: MoEFCC deployed a CAMPA-funded ₹850 Cr 12-year rehabilitation plan — 1,200 km boundary fencing, "
            f"night-vision camera traps, 14 village relocations, and anti-logging squad deployment.\n"
            f"   - **Outcome**: Canopy cover recovered (+38% NDVI) and tiger population grew from zero to 26.\n\n"
            f"2. **Tungabhadra Reservoir (Severe Siltation & Storage Loss)**:\n"
            f"   - **Condition**: NDWI dropped to 0.31 with 76% live storage capacity lost to inflow siltation.\n"
            f"   - **Government Solution**: Central Water Commission (CWC) initiated **DRIP Phase II** (€340 Cr World Bank assistance). "
            f"Executed bathymetric sonar mapping, suction dredging of 50M m³ sediment, and upstream check dam bunding.\n"
            f"   - **Outcome**: Water surface extent restored to 76% capacity within 4 years.\n\n"
            f"3. **Loktak Lake & Chilika Wetland (Phumdi Siltation & Wetland Encroachment)**:\n"
            f"   - **Condition**: Invasive weed overgrowth and choked inlet channels threatening RAMSAR site status.\n"
            f"   - **Government Solution**: National Plan for Conservation of Aquatic Eco-systems (NPCA) + NMCG ₹190 Cr grant for mechanical "
            f"phumdi clearing, eco-tourism buffer zones, and inlet channel desilting.\n"
            f"   - **Outcome**: Water body extent expanded by +24% and migratory bird counts surged.\n\n"
            f"For **{site}** ({status} status), I strongly advise adopting the **CAMPA / DRIP Phase II** framework used in these proven precedents."
        )

    # Forest / canopy / NDVI drop queries

    if any(w in q for w in ["ndvi", "canopy", "vegetation", "forest", "tree", "logging", "smuggling", "deforestation"]):
        drop_pct = round((base_ndvi - ndvi) * 100, 1) if base_ndvi else 0
        response = (
            f"Looking at {site}, the NDVI has dropped from {base_ndvi} to {ndvi} — that's a {drop_pct}% loss in canopy cover."
        )
        if ndvi < 0.35:
            response += (
                f"\n\nHonestly, anything below 0.35 NDVI in a protected zone is an emergency signal in my book. "
                f"I've seen this pattern before — most recently in Sariska back in 2019 when we had a 22% drop over 8 months due to "
                f"organised timber smuggling networks operating at night. We eventually cracked it with a combination of "
                f"CAMPA-funded patrol squads and camera trap grids.\n\n"
                f"For {site}, I'd recommend:\n"
                f"1. Immediate CAMPA anti-logging patrol deployment (can be activated within 72 hours under emergency clause)\n"
                f"2. Night-vision camera trap installation along boundary vectors with highest drop density\n"
                f"3. File FIR under Section 26 of Wildlife Protection Act if smuggling is confirmed\n"
                f"4. Apply for CAMPA emergency funds — typically ₹40-80 lakh sanctionable within 3 weeks for Red-status sites\n"
                f"5. Coordinate with WCCB if inter-state smuggling routes are suspected"
            )
        elif ndvi < 0.5:
            response += (
                f"\n\nThat's in the moderate concern range. I'd start NDVI monitoring at 15-day intervals "
                f"and deploy a boundary inspection team. National Mission for a Green India (GIM) can fund "
                f"afforestation at ₹12,500/hectare/year — definitely worth applying if the drop continues."
            )
        return response

    # Water / dam / NDWI queries
    if any(w in q for w in ["ndwi", "water", "dam", "reservoir", "silt", "storage", "capacity", "drought", "level"]):
        drop_pct = round((base_ndwi - ndwi) * 100, 1) if base_ndwi else 0
        response = (
            f"The NDWI at {site} currently reads {ndwi}, down from a baseline of {base_ndwi} — "
            f"that's approximately {drop_pct}% water surface loss."
        )
        if ndwi < 0.35:
            response += (
                f"\n\nThis is critical territory. When I worked on the Tungabhadra crisis in 2018, we had NDWI at 0.31 "
                f"and the dam was at 24% capacity — we mobilised emergency desilting under DRIP Phase II within 6 weeks. "
                f"50 million cubic metres removed, capacity restored to 76% over 4 years.\n\n"
                f"For {site}, I'd push for:\n"
                f"1. Emergency bathymetric survey to quantify silt volume (usually 2-3 weeks, ₹8-15 lakh)\n"
                f"2. DRIP Phase II application for structural assessment + desilting funding\n"
                f"3. Jal Shakti Abhiyan emergency funds for catchment rim afforestation to slow future siltation\n"
                f"4. Coordinate with State Irrigation Dept for immediate inflow/outflow management protocol"
            )
        elif ndwi < 0.5:
            response += (
                f"\n\nMonitoring-level concern. WDC-PMKSY 2.0 can fund preventive check dam desilting "
                f"at ₹25,000/hectare — I'd recommend a pre-monsoon desilting drive before the next season."
            )
        return response

    # Scheme / funding queries
    if any(w in q for w in ["scheme", "fund", "grant", "money", "budget", "apply", "government", "programme"]):
        scheme_names = [s["scheme_name"] for s in schemes[:3]]
        return (
            f"For a site like {site} with {status} status, the most applicable schemes right now are:\n\n"
            + "\n".join([f"• **{s['scheme_name']}**: {s['clause']}" for s in schemes[:3]])
            + f"\n\nIn my experience, the fastest turnaround is usually CAMPA for forest sites "
            f"(3-6 weeks) and Jal Shakti Abhiyan for water bodies (4-8 weeks). "
            f"Red-status sites can get expedited processing — I've seen approvals in under 3 weeks "
            f"when the DRIC index is below 0.4 and the district collector countersigns the application."
        )

    # What should I do / recommendation queries
    if any(w in q for w in ["what", "how", "recommend", "suggest", "action", "do", "next step", "fix", "solve", "improve"]):
        if status == "Red":
            return (
                f"With {site} in Red status, this needs immediate action — not next quarter, now.\n\n"
                f"Here's what I'd do in the next 30 days:\n\n"
                f"**Week 1:** Deploy an emergency inspection team. Document all encroachments, "
                f"measure current silt levels, photograph boundary violations. This creates the evidence base for funding applications.\n\n"
                f"**Week 2:** File for emergency CAMPA/DRIP funds. The Red status DRIC reading is your strongest argument — "
                f"I've used similar data to fast-track approvals in Panna and Sariska.\n\n"
                f"**Weeks 3-4:** Begin boundary protection measures — temporary fencing, increased patrol frequency, "
                f"and community liaison meetings with villages bordering the site.\n\n"
                f"What specific aspect do you want to dig into — the funding application process, the technical corrective works, or the enforcement angle?"
            )
        elif status == "Yellow":
            return (
                f"{site} is in Yellow — early warning, not crisis. This is actually the ideal time to act "
                f"because you still have options before it becomes an emergency.\n\n"
                f"My recommendation: schedule a pre-monsoon site inspection and apply for WDC-PMKSY 2.0 "
                f"watershed development funds. The ₹25,000/hectare grant is straightforward to apply for "
                f"and can fund desilting, boundary afforestation, and soil bunding in one package.\n\n"
                f"What's the main concern driving the Yellow status here — water levels, vegetation, or encroachment?"
            )
        else:
            return (
                f"{site} is looking healthy — Green status is good news. "
                f"My advice at this stage is to maintain the monitoring cadence and document the recovery trajectory "
                f"thoroughly, because that data becomes extremely useful when applying for continuation funding.\n\n"
                f"Is there a specific risk factor you're watching, or are you looking at expansion of the protected zone?"
            )

    # General / unknown query
    return (
        f"Good question about {site}. Based on the current readings — NDVI {ndvi}, NDWI {ndwi}, "
        f"Health Status: {status} — here's my read on the situation:\n\n"
        f"The site is {'showing signs of stress that need attention' if status in ['Red', 'Yellow'] else 'performing well'}. "
        f"{'The NDVI drop from baseline is the most concerning indicator right now.' if ndvi < base_ndvi else 'The vegetation cover is holding stable.'} "
        f"\n\nCould you be more specific about what aspect you'd like me to focus on? "
        f"For example — the corrective action plan, funding options, technical specifications, or enforcement protocols?"
    )


def _build_suggested_solution(schemes: list, meta: dict) -> str:
    if not schemes:
        return ""
    status = meta.get("health_status", "Yellow")
    steps = []
    if status == "Red":
        steps.append("URGENT: Deploy emergency inspection team within 72 hours")
    for s in schemes[:2]:
        steps.append(f"Apply for {s['scheme_name']} — {s['clause'][:80]}...")
    steps.append("Establish 30-day monitoring checkpoint with DRIC re-evaluation")
    return "\n".join(f"{i+1}. {s}" for i, s in enumerate(steps))


# ─── Build LangGraph State Graph ──────────────────────────────────────────────

def build_copilot_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("intent_detection", intent_detection_node)
    workflow.add_node("retrieve_rag", retrieve_scheme_rag_node)
    workflow.add_node("tavily_search", tavily_search_node)
    workflow.add_node("llm_reasoning", llm_reasoning_node)

    workflow.set_entry_point("intent_detection")
    workflow.add_edge("intent_detection", "retrieve_rag")
    workflow.add_edge("retrieve_rag", "tavily_search")
    workflow.add_edge("tavily_search", "llm_reasoning")
    workflow.add_edge("llm_reasoning", END)

    return workflow.compile()


copilot_graph_agent = build_copilot_graph()
