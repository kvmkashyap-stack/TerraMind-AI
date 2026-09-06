from typing import List
from pydantic import BaseModel, Field

class AnomalyReport(BaseModel):
    project_id: str
    status_indicator: str = Field(..., description="Green (Stable/Improving), Yellow (Attention), Red (Degrading)")
    dric_index: float = Field(..., description="Degradation & Recovery Impact Coefficient (0.0 to 1.0)")
    recovery_trend: str
    detected_anomalies: List[str]
    contributing_factors: List[str]
    confidence_level: float
