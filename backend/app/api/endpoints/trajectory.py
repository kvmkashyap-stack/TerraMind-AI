from fastapi import APIRouter
from app.services.trajectory_engine import trajectory_engine
from app.models.trajectory import TrajectoryResponse

router = APIRouter()

@router.get("/trajectory/{project_id}", response_model=TrajectoryResponse, summary="Expected Target vs. Reality Recovery Trajectory")
async def get_recovery_trajectory(project_id: str):
    """Returns timeline points comparing expected recovery target curve against observed satellite reality."""
    return trajectory_engine.get_trajectory(project_id)
