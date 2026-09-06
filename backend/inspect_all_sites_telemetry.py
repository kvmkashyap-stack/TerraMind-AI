from app.api.endpoints.projects import PAN_INDIA_SITES

print(f"Total backend sites: {len(PAN_INDIA_SITES)}")
for p in PAN_INDIA_SITES:
    print(f"ID: {p.project_id} | Title: {p.title[:35]}")
    print(f"   Base NDVI: {p.baseline_ndvi:.2f}, Curr NDVI: {p.current_ndvi:.2f} | Base NDWI: {p.baseline_ndwi:.2f}, Curr NDWI: {p.current_ndwi:.2f}")
