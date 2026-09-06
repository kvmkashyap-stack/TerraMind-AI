from fastapi import APIRouter
from app.api.endpoints import (
    health, projects, baseline, anomaly, 
    image_analysis, scoring, trajectory, copilot, satellite_data, geospatial
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health & Diagnostics"])
api_router.include_router(projects.router, tags=["Interactive Map & Cost Estimates"])
api_router.include_router(geospatial.router, tags=["GeoPandas, Rasterio & Scikit-Learn Engine"])
api_router.include_router(satellite_data.router, tags=["Satellite Image Data Repository"])
api_router.include_router(baseline.router, tags=["Environmental Baseline Generator"])
api_router.include_router(anomaly.router, tags=["Anomaly Detection & DRIC Index"])
api_router.include_router(image_analysis.router, tags=["Image Analysis Under Observation"])
api_router.include_router(scoring.router, tags=["Impact Score & Dept Monitoring"])
api_router.include_router(trajectory.router, tags=["Expected vs Reality Trajectory"])
api_router.include_router(copilot.router, tags=["LangGraph RAG Schemes Copilot"])
