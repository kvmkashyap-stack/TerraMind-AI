from app.api.endpoints.projects import PAN_INDIA_SITES

for p in PAN_INDIA_SITES:
    if "MNP" in p.project_id or "Loktak" in p.title:
        print("ID:", p.project_id)
        print("Title:", p.title)
        print("Allocated:", p.allocated_funds_inr)
        print("Expended:", p.expended_funds_inr)
        print("Smuggling Active:", p.smuggling_alert_active)
        print("Baseline NDVI:", p.baseline_ndvi, "Current NDVI:", p.current_ndvi)
        print("Baseline NDWI:", p.baseline_ndwi, "Current NDWI:", p.current_ndwi)
        print("---")
