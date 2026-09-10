from app.agents.copilot_graph import copilot_graph_agent, is_site_specific_query
from app.models.copilot import CopilotQueryResponse, SchemeCitation
from app.services.satellite_engine import satellite_engine
from app.services.anomaly_engine import anomaly_engine
from app.api.endpoints.projects import PAN_INDIA_SITES

# ── Site name → project_id keyword mapping for query-based detection ───────────
# If user mentions any of these keywords in query, override to that site's project
SITE_NAME_KEYWORD_MAP = [
    # keyword fragments (lowercase) → project_id
    ("hebbal",          "IND-KAR-01"),
    ("varthur",         "IND-KAR-02"),
    ("chilika",         "IND-ODI-01"),
    ("loktak",          "IND-MNP-01"),
    ("vembanad",        "IND-KER-01"),
    ("bandipur",        "IND-KAR-03"),
    ("corbett",         "IND-UTT-01"),
    ("jim corbett",     "IND-UTT-01"),
    ("sundarbans",      "IND-WB-01"),
    ("sariska",         "IND-RAJ-FOR-RED-01"),
    ("panna",           "IND-MP-FOR-RED-01"),
    ("tungabhadra",     "IND-KAR-DAM-RED-01"),
    ("mettur",          "IND-TN-DAM-RED-01"),
    ("stanley",         "IND-TN-DAM-RED-01"),
    ("kaziranga",       "IND-ASS-01"),
    ("gir",             "IND-GUJ-01"),
    ("sardar sarovar",  "IND-GUJ-02"),
    ("nagarjuna sagar", "IND-TEL-01"),
    ("nagarjuna",       "IND-TEL-01"),
    ("krs",             "IND-KAR-04"),
    ("krishnarajasagara","IND-KAR-04"),
    ("bhakra",          "IND-HP-01"),
    ("nangal",          "IND-HP-01"),
    ("alwar",           "IND-RAJ-03"),
    ("latur",           "IND-MAH-01"),
    ("anantapur",       "IND-AP-01"),
    ("aravalli",        "IND-HAR-01"),
    ("wular",           "IND-JK-01"),
    ("similipal",       "IND-ODI-02"),
    ("wayanad",         "IND-KER-FOR-01"),
    ("mudumalai",       "IND-TN-FOR-01"),
    ("ranthambore",     "IND-RAJ-FOR-01"),
    ("idukki",          "IND-KER-DAM-01"),
    ("koyna",           "IND-MAH-DAM-01"),
    ("pichola",         "IND-RAJ-LAKE-01"),
    ("dal lake",        "IND-JK-LAKE-01"),
    ("dal",             "IND-JK-LAKE-01"),
    ("bhojtal",         "IND-MP-LAKE-01"),
    ("agumbe",          "IND-KAR-03"),   # agumbe is near Bandipur belt
    ("silent valley",   "IND-KER-FOR-01"),
]


def _detect_site_from_query(query_text: str, default_id: str) -> str:
    """
    If the user explicitly names a site in their query, return that site's project_id.
    Otherwise return the default (currently selected) project_id.
    """
    q_lower = query_text.lower()
    for keyword, pid in SITE_NAME_KEYWORD_MAP:
        if keyword in q_lower:
            return pid
    return default_id


class LangGraphCopilotService:
    """
    Service wrapper executing the LangGraph Agent Graph
    (Tavily Search + LLM reasoning as Dr. Arjun Mehta).
    """

    async def query_copilot(self, query_text: str, project_id: str = None) -> CopilotQueryResponse:
        # Step 1: Resolve the correct project_id
        # If user named a site in query, use that site's ID regardless of dropdown selection
        default_id = project_id or "IND-KAR-01"
        p_id = _detect_site_from_query(query_text, default_id)

        # Step 2: Find project from PAN_INDIA_SITES
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
            location_name = proj.location_name
            allocated_funds = round(proj.allocated_funds_inr / 10000000.0, 2)
            expended_funds = round(proj.expended_funds_inr / 10000000.0, 2)
            budget_sufficiency = proj.budget_sufficiency
            land_cover = proj.land_cover
            probable_cause = getattr(proj, "probable_cause", None)
            # Pull corrective action cost estimate if available
            estimated_cost = getattr(proj, "estimated_cost", None)
        else:
            p_title = f"Conservation Site ({p_id})"
            p_type = "Ecological Catchment & Watershed Protection"
            p_status = "Yellow"
            base_ndvi = 0.50
            curr_ndvi = 0.45
            base_ndwi = 0.45
            curr_ndwi = 0.40
            smuggling = False
            location_name = "India"
            allocated_funds = 5.0
            expended_funds = 3.5
            budget_sufficiency = "Adequate"
            land_cover = None
            probable_cause = None
            estimated_cost = None

        # Step 3: Pull real satellite telemetry
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

        # Step 4: Pull real Trajectory Engine data
        traj_summary = ""
        traj_variance = round(abs((c_ndvi - base_ndvi) / base_ndvi * 100), 1) if base_ndvi else 15.0
        traj_performance_status = "Unknown"
        try:
            from app.services.trajectory_engine import trajectory_engine
            traj_res = trajectory_engine.get_trajectory(p_id)
            traj_metric = traj_res.metric_name
            traj_variance = traj_res.overall_variance_percentage
            traj_performance_status = traj_res.performance_status
            points_str = ", ".join([
                f"{pt.month_label}: Actual {pt.actual_observed_value}% / Expected {pt.expected_recovery_value}%"
                for pt in traj_res.trajectory_points
            ])
            traj_summary = f"Metric: {traj_metric} | {points_str} | Performance: {traj_res.performance_status}"
        except Exception:
            traj_summary = f"Variance {traj_variance}% from baseline"

        # Step 5: Pull Satellite Repository summary
        sat_summary = ""
        try:
            sat_repo = satellite_engine.get_satellite_repository(p_id)
            img_count = sat_repo.total_images_captured
            latest_date = sat_repo.latest_observation_date
            latest_img = sat_repo.images[0] if sat_repo.images else None
            if latest_img:
                sat_summary = (
                    f"{img_count} satellite passes captured up to {latest_date}. "
                    f"Sensor: {latest_img.satellite_source}, "
                    f"Resolution: {latest_img.resolution_meters}m, "
                    f"Cloud Cover: {latest_img.cloud_cover_percentage}%"
                )
            else:
                sat_summary = f"{img_count} satellite passes captured up to {latest_date}"
        except Exception:
            sat_summary = "Sentinel-2 MSI & Sentinel-1 SAR imagery active"

        # Step 6: Format probable cause
        pc_str = ""
        if probable_cause:
            pc_str = (
                f"Primary: {probable_cause.primary_factor}. "
                + (f"Financial: {probable_cause.funds_cause}. " if probable_cause.funds_cause else "")
                + (f"Encroachment: {probable_cause.people_encroachment_cause}. " if probable_cause.people_encroachment_cause else "")
                + (f"Climate: {probable_cause.resource_availability_cause}. " if probable_cause.resource_availability_cause else "")
                + (f"Labour: {probable_cause.labour_execution_cause}. " if probable_cause.labour_execution_cause else "")
            )

        # Step 7: Format corrective action estimate
        corrective_action = ""
        corrective_cost = ""
        funding_scheme = ""
        if estimated_cost:
            corrective_action = estimated_cost.corrective_action_required or ""
            corrective_cost = f"₹{round(estimated_cost.estimated_cost_inr / 100000, 2)} Lakh"
            funding_scheme = estimated_cost.funding_scheme_recommended or ""

        # Step 8: Build enriched project_metadata dict for the LangGraph agent
        ndvi_delta_pct = round((c_ndvi - base_ndvi) / base_ndvi * 100, 1) if base_ndvi else 0
        ndwi_delta_pct = round((c_ndwi - base_ndwi) / base_ndwi * 100, 1) if base_ndwi else 0

        project_metadata = {
            "project_id": p_id,
            "title": p_title,
            "intervention_type": p_type,
            "health_status": p_status,
            "location_name": location_name,
            "dric_index": anomaly_rep.dric_index,

            # Spectral indices
            "baseline_ndvi": base_ndvi,
            "current_ndvi": c_ndvi,
            "ndvi_delta_pct": ndvi_delta_pct,
            "baseline_ndwi": base_ndwi,
            "current_ndwi": c_ndwi,
            "ndwi_delta_pct": ndwi_delta_pct,
            "current_ndbi": c_ndbi,
            "current_nbr": c_nbr,
            "current_ndmi": c_ndmi,

            # Alerts
            "smuggling_alert_active": smuggling,

            # Trajectory
            "variance": traj_variance,
            "trajectory_performance": traj_performance_status,
            "trajectory_summary": traj_summary,

            # Satellite
            "satellite_summary": sat_summary,

            # Finance
            "allocated_funds": allocated_funds,
            "expended_funds": expended_funds,
            "budget_sufficiency": budget_sufficiency,
            "fund_utilization_pct": round(expended_funds / allocated_funds * 100, 1) if allocated_funds else 0,

            # Land cover
            "veg_pct": land_cover.vegetation_coverage_pct if land_cover else 45.0,
            "water_pct": land_cover.water_coverage_pct if land_cover else 30.0,
            "urban_pct": land_cover.urban_builtup_pct if land_cover else 10.0,
            "barren_pct": land_cover.barren_land_pct if land_cover else 15.0,

            # Cause & corrective action
            "probable_cause_text": pc_str,
            "corrective_action": corrective_action,
            "corrective_cost": corrective_cost,
            "funding_scheme_recommended": funding_scheme,
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

        # Step 9: Run LangGraph State Graph
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
