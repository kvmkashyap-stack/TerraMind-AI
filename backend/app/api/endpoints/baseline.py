from fastapi import APIRouter
from app.services.baseline_engine import baseline_engine

router = APIRouter()

@router.get("/baseline/{project_id}", summary="Get Pre-Intervention Environmental Baseline")
async def get_environmental_baseline(project_id: str):
    """Retrieves baseline NDWI, NDVI, NDBI, NBR, and NDMI metrics prior to conservation intervention."""
    return baseline_engine.generate_baseline(project_id)

@router.get("/baseline/{project_id}/comparison", summary="Get Before vs. Now Baseline Comparison Report")
async def get_baseline_comparison(project_id: str):
    """Retrieves Before vs. Now metric comparisons (e.g. Vegetation 60% -> 42%)."""
    return baseline_engine.compare_baseline_vs_current(project_id)
