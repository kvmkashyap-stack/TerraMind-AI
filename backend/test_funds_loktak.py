from app.services.funds_engine import funds_engine

res = funds_engine.get_fund_ledger("IND-MNP-01")
print("Scheme Name:", res.scheme_name)
print("Department:", res.managing_department)
print("Allocated INR:", res.budget_analysis.allocated_amount_inr)
print("Disbursed INR:", res.budget_analysis.disbursed_amount_inr)
print("Utilized INR:", res.budget_analysis.utilized_amount_inr)
print("Utilized Pct:", res.budget_analysis.utilization_percentage)
print("Alerts Count:", len(res.active_illegal_alerts))
if len(res.active_illegal_alerts) > 0:
    for a in res.active_illegal_alerts:
        print("  Alert:", a.alert_id, a.risk_level, a.description)
