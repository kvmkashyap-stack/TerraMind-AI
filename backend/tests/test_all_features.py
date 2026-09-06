import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_routes():
    res1 = client.get("/api/v1/health")
    assert res1.status_code == 200
    assert res1.json()["status"] == "online"

    res2 = client.get("/api/v1/health/diagnostics")
    assert res2.status_code == 200
    assert res2.json()["status"] == "healthy"

def test_map_hover_and_cost_estimates():
    res = client.get("/api/v1/map/hover-info")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    
    first = data[0]
    assert "land_cover" in first
    assert first["land_cover"]["vegetation_coverage_pct"] > 0
    assert "estimated_cost" in first
    assert first["estimated_cost"]["estimated_cost_inr"] > 0

def test_environmental_baseline_and_comparison():
    res1 = client.get("/api/v1/baseline/IND-KAR-02")
    assert res1.status_code == 200
    assert "baseline_metrics" in res1.json()

    res2 = client.get("/api/v1/baseline/IND-KAR-02/comparison")
    assert res2.status_code == 200
    data = res2.json()
    assert "vegetation_comparison" in data
    veg = data["vegetation_comparison"]
    assert veg["before_value"] == 60.0
    assert veg["current_value"] == 42.0
    assert veg["net_change"] == -18.0

def test_anomaly_detection_and_dric_index():
    res = client.get("/api/v1/anomaly/IND-KAR-02")
    assert res.status_code == 200
    data = res.json()
    assert data["status_indicator"] in ["Green", "Yellow", "Red"]
    assert 0.0 <= data["dric_index"] <= 1.0
    assert len(data["detected_anomalies"]) > 0

def test_satellite_data_repository():
    res = client.get("/api/v1/satellite-data/IND-KAR-02")
    assert res.status_code == 200
    data = res.json()
    assert data["total_images_captured"] >= 3
    first_img = data["images"][0]
    assert "ndvi_composite_url" in first_img
    assert first_img["vegetation_coverage_pct"] > 0

def test_image_analysis_under_observation():
    res = client.get("/api/v1/image-analysis/IND-KAR-02")
    assert res.status_code == 200
    data = res.json()
    assert len(data["observation_steps"]) >= 3
    assert "change_matrix" in data

def test_impact_score_and_departmental_oversight():
    res = client.get("/api/v1/scoring/IND-KAR-02")
    assert res.status_code == 200
    data = res.json()
    assert 0.0 <= data["overall_impact_score"] <= 100.0
    assert len(data["departmental_oversight"]) >= 4

def test_expected_vs_reality_trajectory():
    res = client.get("/api/v1/trajectory/IND-KAR-02")
    assert res.status_code == 200
    data = res.json()
    assert len(data["trajectory_points"]) >= 5
    assert "overall_variance_percentage" in data

def test_geospatial_and_ml_forecast():
    res = client.get("/api/v1/geospatial/analyze/IND-KAR-02")
    assert res.status_code == 200
    data = res.json()
    assert "geopandas_watershed_delineation" in data
    assert "rasterio_pixel_analysis" in data
    assert "scikit_learn_ml_forecast" in data
    ml = data["scikit_learn_ml_forecast"]
    assert "predicted_recovery_6_months" in ml

def test_langgraph_copilot_chat():
    res = client.post("/api/v1/copilot/chat", json={
        "query": "Which schemes provide funds for catchment desilting?",
        "project_id": "IND-KAR-02"
    })
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert len(data["recommended_schemes"]) > 0
