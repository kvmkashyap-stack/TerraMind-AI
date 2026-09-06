from fastapi import APIRouter
from app.models.satellite_data import SatelliteDataRepository
from app.services.satellite_engine import satellite_engine

router = APIRouter()

@router.get("/satellite-data/{project_id}", response_model=SatelliteDataRepository, summary="Satellite Image Data Repository for Dashboard Data Section")
async def get_satellite_data_repository(project_id: str):
    """Retrieves processed satellite rasters, multi-spectral layers (RGB, NDVI, NDWI, NDBI), cloud cover, and timestamps."""
    return satellite_engine.get_satellite_image_repository(project_id)
