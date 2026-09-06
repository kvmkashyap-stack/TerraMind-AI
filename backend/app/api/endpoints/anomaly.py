from fastapi import APIRouter
from app.services.anomaly_engine import anomaly_engine
from app.models.anomaly import AnomalyReport

router = APIRouter()

@router.get("/anomaly/{project_id}", response_model=AnomalyReport, summary="Get Anomaly Status & DRIC Index")
async def get_anomaly_report(project_id: str):
    """Calculates Green/Yellow/Red status indicator and DRIC Index."""
    # Benchmark call to anomaly engine
    return anomaly_engine.evaluate_anomaly(
        project_id=project_id,
        actual_val=0.44,
        expected_val=0.58,
        ndbi_delta=0.08
    )
