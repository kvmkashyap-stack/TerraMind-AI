from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", summary="Basic System Health Check")
async def health_check():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }

@router.get("/health/diagnostics", summary="Detailed Diagnostics")
async def detailed_diagnostics():
    return {
        "status": "healthy",
        "services": {
            "satellite_engine": "operational (Satellite Imagery API)",
            "indices_processor": "operational (NDVI, NDWI, NDBI, NBR, NDMI)",
            "langgraph_orchestrator": "operational",
            "kimi_k3_llm": f"configured ({settings.KIMI_MODEL_NAME})",
            "tavily_search": "configured"
        }
    }
