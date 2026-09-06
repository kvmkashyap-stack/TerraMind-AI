from app.services.trajectory_engine import trajectory_engine
from app.api.endpoints.projects import PAN_INDIA_SITES

sites_to_test = [
    "IND-KAR-FOR-03", # Bandipur
    "IND-WB-01",      # Sundarbans
    "IND-KAR-03",     # KRS Dam
    "IND-RAJ-LAKE-01",# Lake Pichola
    "IND-UTT-DAM-01", # Tehri Dam
    "IND-KER-FOR-02", # Silent Valley
    "IND-MNP-01"      # Loktak Lake
]

for sid in sites_to_test:
    proj = next((p for p in PAN_INDIA_SITES if p.project_id == sid), None)
    if proj:
        res = trajectory_engine.get_trajectory(sid)
        print(f"=== SITE: {sid} ({proj.title}) ===")
        print(f"  Metric: {res.metric_name}")
        print(f"  Baseline: {res.baseline_value}% | Current: {res.current_value}%")
        print(f"  Performance: {res.performance_status}")
        print(f"  Variance: {res.overall_variance_percentage}%")
        print(f"  Summary: {res.status_summary}")
        print("  Points:")
        for pt in res.trajectory_points:
            print(f"    {pt.month_label} ({pt.timestamp}): Exp={pt.expected_recovery_value}%, Act={pt.actual_observed_value}%, Dev={pt.deviation_delta}%")
        print()
