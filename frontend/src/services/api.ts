const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface ProbableCauseBreakdown {
  primary_factor: string;
  funds_cause?: string;
  people_encroachment_cause?: string;
  resource_availability_cause?: string;
  labour_execution_cause?: string;
}

export interface ProjectMapHover {
  project_id: string;
  title: string;
  intervention_type: string;
  location_name: string;
  coordinates: { lat: number; lng: number };
  health_status: string;
  allocated_funds_inr: number;
  expended_funds_inr: number;
  budget_sufficiency: string;
  smuggling_alert_active: boolean;
  land_cover: {
    vegetation_coverage_pct: number;
    water_coverage_pct: number;
    urban_builtup_pct: number;
    barren_land_pct: number;
  };
  baseline_ndwi: number;
  current_ndwi: number;
  baseline_ndvi: number;
  current_ndvi: number;
  estimated_cost: {
    corrective_action_required: string;
    estimated_cost_inr: number;
    cost_breakdown: string[];
    funding_scheme_recommended: string;
  };
  probable_cause?: ProbableCauseBreakdown;
}



export interface BaselineComparisonReport {
  project_id: string;
  baseline_period: string;
  current_observation_date: string;
  vegetation_comparison: {
    indicator_name: string;
    before_value: number;
    current_value: number;
    net_change: number;
    change_status: string;
  };
  water_body_comparison: {
    indicator_name: string;
    before_value: number;
    current_value: number;
    net_change: number;
    change_status: string;
  };
  builtup_expansion_comparison: {
    indicator_name: string;
    before_value: number;
    current_value: number;
    net_change: number;
    change_status: string;
  };
  overall_health_diagnosis: string;
}

export interface SatelliteDataRepository {
  project_id: string;
  project_title: string;
  coordinates?: { latitude: number; longitude: number };
  total_images_captured: number;
  latest_observation_date: string;
  images: Array<{
    image_id: string;
    project_id: string;
    acquisition_date: string;
    satellite_source: string;
    cloud_cover_percentage: number;
    resolution_meters: number;
    raw_rgb_url: string;
    ndvi_composite_url: string;
    ndwi_composite_url: string;
    ndbi_composite_url: string;
    processed_status: string;
    vegetation_coverage_pct: number;
    water_body_coverage_pct: number;
    builtup_coverage_pct: number;
  }>;
}

export interface ImpactScoreBreakdown {
  project_id: string;
  overall_impact_score: number;
  trajectory_alignment_score: number;
  environmental_delta_score: number;
  recovery_consistency_score: number;
  fund_efficiency_score: number;
  departmental_oversight: Array<{
    department_name: string;
    approval_status: string;
    compliance_rating: number;
  }>;
}

export interface TrajectoryResponse {
  project_id: string;
  intervention_type: string;
  metric_name?: string;
  baseline_value?: number;
  current_value?: number;
  performance_status?: string;
  trajectory_points: Array<{
    month_label: string;
    timestamp: string;
    expected_recovery_value: number;
    actual_observed_value: number;
    deviation_delta: number;
  }>;
  overall_variance_percentage: number;
  status_summary: string;
}

export interface CopilotChatResponse {
  answer: string;
  recommended_schemes: Array<{
    scheme_name: string;
    authority: string;
    relevant_clause: string;
    url?: string;
  }>;
  suggested_technical_solution: string;
  tavily_web_citations: string[];
}

export async function fetchMapProjects(): Promise<ProjectMapHover[]> {
  const res = await fetch(`${API_BASE_URL}/map/hover-info`);
  if (!res.ok) throw new Error("Failed to fetch map projects");
  return res.json();
}



export async function fetchBaselineComparison(projectId: string): Promise<BaselineComparisonReport> {
  const res = await fetch(`${API_BASE_URL}/baseline/${projectId}/comparison`);
  if (!res.ok) throw new Error("Failed to fetch baseline comparison");
  return res.json();
}

export async function fetchSatelliteRepository(projectId: string): Promise<SatelliteDataRepository> {
  const res = await fetch(`${API_BASE_URL}/satellite-data/${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch satellite repository");
  return res.json();
}

export async function fetchImpactScore(projectId: string): Promise<ImpactScoreBreakdown> {
  const res = await fetch(`${API_BASE_URL}/scoring/${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch impact score");
  return res.json();
}

export async function fetchTrajectory(projectId: string): Promise<TrajectoryResponse> {
  const res = await fetch(`${API_BASE_URL}/trajectory/${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch trajectory");
  return res.json();
}

export async function sendCopilotChat(query: string, projectId: string): Promise<CopilotChatResponse> {
  const res = await fetch(`${API_BASE_URL}/copilot/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, project_id: projectId }),
  });
  if (!res.ok) throw new Error("Copilot chat failed");
  return res.json();
}

export async function uploadDocumentToRAG(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/copilot/upload-document`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Document upload failed");
  return res.json();
}
