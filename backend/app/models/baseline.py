from pydantic import BaseModel, Field

class BeforeVsNowMetric(BaseModel):
    indicator_name: str
    before_value: float = Field(..., description="Baseline value before intervention (e.g., 60% vegetation)")
    current_value: float = Field(..., description="Current observed satellite value (e.g., 42% vegetation)")
    net_change: float = Field(..., description="Delta change (e.g., -18% loss)")
    change_status: str  # Improved, Stagnant, Deteriorated

class BaselineComparisonReport(BaseModel):
    project_id: str
    baseline_period: str
    current_observation_date: str
    vegetation_comparison: BeforeVsNowMetric
    water_body_comparison: BeforeVsNowMetric
    builtup_expansion_comparison: BeforeVsNowMetric
    moisture_index_comparison: BeforeVsNowMetric
    overall_health_diagnosis: str
