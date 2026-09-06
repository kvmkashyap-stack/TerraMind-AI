from typing import List, Optional
from pydantic import BaseModel, Field

class LatLng(BaseModel):
    lat: float
    lng: float

class LandCoverBreakdown(BaseModel):
    vegetation_coverage_pct: float = Field(..., description="Vegetation cover percentage (e.g. 60%)")
    water_coverage_pct: float = Field(..., description="Water body surface coverage percentage")
    urban_builtup_pct: float = Field(..., description="Urban / built-up expansion percentage")
    barren_land_pct: float = Field(..., description="Barren / uncultivated land percentage")

class ProbableCostEstimate(BaseModel):
    corrective_action_required: str
    estimated_cost_inr: float = Field(..., description="Estimated cost in INR (Rupees)")
    cost_breakdown: List[str]
    funding_scheme_recommended: str

class ProbableCauseBreakdown(BaseModel):
    primary_factor: str
    funds_cause: Optional[str] = None
    people_encroachment_cause: Optional[str] = None
    resource_availability_cause: Optional[str] = None
    labour_execution_cause: Optional[str] = None

class ProjectMapHover(BaseModel):
    project_id: str
    title: str
    intervention_type: str
    location_name: str
    coordinates: LatLng
    health_status: str     # Green, Yellow, Red
    allocated_funds_inr: float
    expended_funds_inr: float
    budget_sufficiency: str # Sufficient, Budget Deficit, Funds Underutilized/Wasted
    smuggling_alert_active: bool
    land_cover: LandCoverBreakdown
    baseline_ndwi: float
    current_ndwi: float
    baseline_ndvi: float
    current_ndvi: float
    estimated_cost: ProbableCostEstimate
    probable_cause: Optional[ProbableCauseBreakdown] = None

class ProjectSummary(BaseModel):
    id: str
    name: str
    intervention_type: str
    state: str
    district: str
    status: str
    impact_score: float
    dric_index: float
    budget_status: str
    smuggling_risk: str
    last_updated: str
