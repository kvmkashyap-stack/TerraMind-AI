from typing import List, Optional
from pydantic import BaseModel

class TrajectoryDataPoint(BaseModel):
    month_label: str
    timestamp: str
    expected_recovery_value: float
    actual_observed_value: float
    deviation_delta: float

class TrajectoryResponse(BaseModel):
    project_id: str
    intervention_type: str
    metric_name: Optional[str] = "Index %"
    baseline_value: Optional[float] = 0.0
    current_value: Optional[float] = 0.0
    performance_status: Optional[str] = "On Track"
    trajectory_points: List[TrajectoryDataPoint]
    overall_variance_percentage: float
    status_summary: str
