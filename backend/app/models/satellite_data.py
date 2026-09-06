from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ProcessedSatelliteImage(BaseModel):
    image_id: str
    project_id: str
    acquisition_date: str
    satellite_source: str  # Sentinel-2A / Sentinel-2B / Copernicus
    cloud_cover_percentage: float
    resolution_meters: float
    raw_rgb_url: str
    ndvi_composite_url: str
    ndwi_composite_url: str
    ndbi_composite_url: str
    processed_status: str  # Processed & Calibrated
    vegetation_coverage_pct: float
    water_body_coverage_pct: float
    builtup_coverage_pct: float

class SatelliteDataRepository(BaseModel):
    project_id: str
    project_title: str
    coordinates: Optional[Dict[str, float]] = None
    total_images_captured: int
    latest_observation_date: str
    images: List[ProcessedSatelliteImage]

