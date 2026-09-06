from app.models.scoring import ImpactScoreBreakdown, DepartmentalOversight

class ScoringEngine:
    """
    Computes evidence-based Conservation Impact Score (0-100) incorporating:
    - Trajectory Alignment (35%)
    - Environmental Delta (30%)
    - Recovery Consistency (20%)
    - Execution & Efficiency Score (15%)
    """

    @staticmethod
    def compute_score(project_id: str) -> ImpactScoreBreakdown:
        from app.api.endpoints.projects import PAN_INDIA_SITES
        
        proj = next((p for p in PAN_INDIA_SITES if p.project_id == project_id), None)
        
        if proj and proj.allocated_funds_inr > 0:
            util_pct = min(100.0, (proj.expended_funds_inr / proj.allocated_funds_inr) * 100.0)
            fund_eff = min(98.0, max(45.0, round(util_pct * 0.96, 1)))
        else:
            fund_eff = 82.5

        if proj:
            # Trajectory Alignment based on historical index gain
            ndvi_gain = proj.current_ndvi - proj.baseline_ndvi
            ndwi_gain = proj.current_ndwi - proj.baseline_ndwi
            index_delta = max(-0.3, min(0.4, ndvi_gain + ndwi_gain))
            traj_score = round(min(98.0, max(45.0, 72.0 + (index_delta * 65.0))), 1)

            # Environmental Delta based on ecosystem canopy & water coverage
            env_delta = round(min(96.0, max(50.0, (proj.land_cover.vegetation_coverage_pct * 0.5) + (proj.land_cover.water_coverage_pct * 0.5))), 1)

            # Recovery Consistency based on health status & smuggling alerts
            if proj.health_status == "Green":
                consistency = 92.0 if not proj.smuggling_alert_active else 78.0
            elif proj.health_status == "Yellow":
                consistency = 72.0
            else:
                consistency = 52.0
        else:
            traj_score = 72.0
            env_delta = 70.0
            consistency = 75.0

        # Calculate overall impact score dynamically
        overall = round((traj_score * 0.35) + (env_delta * 0.30) + (consistency * 0.20) + (fund_eff * 0.15), 1)

        smug_status = "Active Patrol Scan" if not (proj and proj.smuggling_alert_active) else "Logging Alert Active"

        departments = [
            DepartmentalOversight(department_name="Ministry of Jal Shakti & Environment", approval_status="Approved", compliance_rating=round(overall, 1)),
            DepartmentalOversight(department_name="State Department of Forests & Wildlife", approval_status=smug_status, compliance_rating=round(consistency, 1)),
            DepartmentalOversight(department_name="Central Pollution Control Board (CPCB)", approval_status="Compliant", compliance_rating=round(env_delta, 1)),
            DepartmentalOversight(department_name="District Revenue & Land Records", approval_status="Verified", compliance_rating=round(traj_score, 1)),
        ]

        return ImpactScoreBreakdown(
            project_id=project_id,
            overall_impact_score=overall,
            trajectory_alignment_score=traj_score,
            environmental_delta_score=env_delta,
            recovery_consistency_score=consistency,
            fund_efficiency_score=fund_eff,
            departmental_oversight=departments
        )

scoring_engine = ScoringEngine()
