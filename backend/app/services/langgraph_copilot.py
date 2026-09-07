from app.agents.copilot_graph import copilot_graph_agent
from app.models.copilot import CopilotQueryResponse, SchemeCitation
from app.services.satellite_engine import satellite_engine
from app.services.anomaly_engine import anomaly_engine
from app.api.endpoints.projects import PAN_INDIA_SITES

class LangGraphCopilotService:
    """
    Service wrapper executing the LangGraph Agent Graph
    (Vector RAG + Tavily Search + LLM reasoning as Dr. Arjun Mehta).
    """

    async def query_copilot(self, query_text: str, project_id: str = None) -> CopilotQueryResponse:
        p_id = project_id or "IND-KAR-01"

        # Find project from PAN_INDIA_SITES
        proj = next((p for p in PAN_INDIA_SITES if p.project_id == p_id), None)

        if proj:
            p_title = proj.title
            p_type = proj.intervention_type
            p_status = proj.health_status
            base_ndvi = proj.baseline_ndvi
            curr_ndvi = proj.current_ndvi
            base_ndwi = proj.baseline_ndwi
            curr_ndwi = proj.current_ndwi
            smuggling = proj.smuggling_alert_active
        else:
            p_title = f"Conservation Site ({p_id})"
            p_type = "Ecological Catchment & Watershed Protection"
            p_status = "Yellow"
            base_ndvi = 0.50
            curr_ndvi = 0.45
            base_ndwi = 0.45
            curr_ndwi = 0.40
            smuggling = False

        # Pull real telemetry for context
        temporal_data = satellite_engine.get_multi_temporal_series(p_id)
        latest_indices = temporal_data[-1].indices if temporal_data else None
        
        c_ndvi = latest_indices.ndvi if latest_indices else curr_ndvi
        c_ndwi = latest_indices.ndwi if latest_indices else curr_ndwi
        c_ndbi = latest_indices.ndbi if latest_indices else 0.15
        c_nbr = latest_indices.nbr if latest_indices else 0.60
        c_ndmi = latest_indices.ndmi if latest_indices else 0.40

        anomaly_rep = anomaly_engine.evaluate_anomaly(
            p_id, actual_val=c_ndwi, expected_val=base_ndwi, ndbi_delta=c_ndbi - 0.15
        )

        project_metadata = {
            "project_id": p_id,
            "title": p_title,
            "intervention_type": p_type,
            "health_status": p_status,
            "dric_index": anomaly_rep.dric_index,
            "baseline_ndvi": base_ndvi,
            "current_ndvi": c_ndvi,
            "baseline_ndwi": base_ndwi,
            "current_ndwi": c_ndwi,
            "current_ndbi": c_ndbi,
            "current_nbr": c_nbr,
            "current_ndmi": c_ndmi,
            "smuggling_alert_active": smuggling,
            "variance": round(abs((c_ndvi - base_ndvi) / base_ndvi * 100), 1) if base_ndvi else 15.0
        }

        initial_state = {
            "query": query_text,
            "project_id": p_id,
            "project_metadata": project_metadata,
            "retrieved_schemes": [],
            "tavily_search_results": [],
            "scraped_web_content": [],
            "final_answer": "",
            "recommended_schemes": [],
            "suggested_technical_solution": "",
            "iteration_count": 0
        }

        # Run LangGraph State Graph
        result_state = await copilot_graph_agent.ainvoke(initial_state)

        schemes = [
            SchemeCitation(
                scheme_name=s["scheme_name"],
                authority=s["authority"],
                relevant_clause=s["clause"],
                url=s.get("url")
            )
            for s in result_state.get("recommended_schemes", [])
        ]

        return CopilotQueryResponse(
            answer=result_state.get("final_answer", "Analysis complete."),
            recommended_schemes=schemes,
            suggested_technical_solution=result_state.get("suggested_technical_solution", ""),
            tavily_web_citations=result_state.get("tavily_search_results", [])
        )

copilot_service = LangGraphCopilotService()
