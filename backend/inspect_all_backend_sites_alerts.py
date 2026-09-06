from app.api.endpoints.projects import PAN_INDIA_SITES

print(f"TOTAL SITES: {len(PAN_INDIA_SITES)}")
alerts_count = 0
for p in PAN_INDIA_SITES:
    ndvi_drop = p.baseline_ndvi - p.current_ndvi
    has_alert = p.smuggling_alert_active or (ndvi_drop > 0.05)
    if has_alert:
        alerts_count += 1
        print(f"ALERT SITE -> ID: {p.project_id} | Title: {p.title} | Smuggling: {p.smuggling_alert_active} | NDVI Drop: {ndvi_drop:.2f} (Base: {p.baseline_ndvi}, Curr: {p.current_ndvi})")

print(f"Total sites with alerts: {alerts_count} / {len(PAN_INDIA_SITES)}")
