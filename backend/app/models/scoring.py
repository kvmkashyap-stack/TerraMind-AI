from typing import Dict, List
from pydantic import BaseModel, Field

class DepartmentalOversight(BaseModel):
    department_name: str  # Jal Shakti, Forest Dept, Revenue, CPCB
    approval_status: str
    compliance_rating: float

class ImpactScoreBreakdown(BaseModel):
    project_id: str
    overall_impact_score: float = Field(..., ge=0.0, le=100.0)
    trajectory_alignment_score: float
    environmental_delta_score: float
    recovery_consistency_score: float
    fund_efficiency_score: float
    departmental_oversight: List[DepartmentalOversight]
