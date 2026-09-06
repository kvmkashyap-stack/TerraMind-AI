from fastapi import APIRouter
from app.services.scoring_engine import scoring_engine
from app.models.scoring import ImpactScoreBreakdown

router = APIRouter()

@router.get("/scoring/{project_id}", response_model=ImpactScoreBreakdown, summary="Conservation Impact Score & Inter-Departmental Monitoring")
async def get_conservation_impact_score(project_id: str):
    """Calculates 0-100 Impact Score and inter-departmental compliance ratings."""
    return scoring_engine.compute_score(project_id)
