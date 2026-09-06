from typing import Dict, Any, List

class ImageAnalysisService:
    """
    Provides multi-temporal satellite imagery layers and false-color indices
    for side-by-side or split-slider "Under Observation" visual analysis.
    """

    @staticmethod
    def get_image_analysis(project_id: str) -> Dict[str, Any]:
        return {
            "project_id": project_id,
            "observation_steps": [
                {
                    "step_name": "Baseline (t-0)",
                    "date": "2025-01-15",
                    "indices": {"ndvi": 0.41, "ndwi": 0.32, "ndbi": 0.15, "nbr": 0.65, "ndmi": 0.38},
                    "water_body_polygon_coords": [[12.971, 77.594], [12.973, 77.596], [12.970, 77.598]],
                    "status_label": "Pre-Intervention Baseline"
                },
                {
                    "step_name": "Month 6 (Under Observation)",
                    "date": "2025-07-20",
                    "indices": {"ndvi": 0.52, "ndwi": 0.48, "ndbi": 0.14, "nbr": 0.72, "ndmi": 0.49},
                    "water_body_polygon_coords": [[12.971, 77.594], [12.974, 77.597], [12.970, 77.599]],
                    "status_label": "Partial Recovery"
                },
                {
                    "step_name": "Month 12 (Under Observation - Current)",
                    "date": "2026-01-10",
                    "indices": {"ndvi": 0.49, "ndwi": 0.44, "ndbi": 0.18, "nbr": 0.68, "ndmi": 0.42},
                    "water_body_polygon_coords": [[12.971, 77.593], [12.973, 77.596], [12.969, 77.597]],
                    "status_label": "Stagnating / Encroachment Alert"
                }
            ],
            "change_matrix": {
                "water_area_change_percentage": "+37.5%",
                "vegetation_change_percentage": "+19.5%",
                "built_up_expansion_percentage": "+20.0%"
            }
        }

image_analysis_service = ImageAnalysisService()
