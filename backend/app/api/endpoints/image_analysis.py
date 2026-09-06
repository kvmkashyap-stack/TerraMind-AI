from fastapi import APIRouter
from app.services.image_analysis_service import image_analysis_service

router = APIRouter()

@router.get("/image-analysis/{project_id}", summary="Multi-Temporal Satellite Image Analysis Under Observation")
async def get_multi_temporal_image_analysis(project_id: str):
    """Provides timeline satellite imagery indices and change matrices for Under Observation inspection."""
    return image_analysis_service.get_image_analysis(project_id)
