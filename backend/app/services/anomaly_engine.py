from app.models.anomaly import AnomalyReport

class AnomalyEngine:
    """
    Evaluates multi-spectral indices, trajectory variance, and land-use shifts to compute:
    1. Status Indicator: Green (Stable/Improving), Yellow (Attention), Red (Degrading)
    2. DRIC Index: Degradation & Recovery Impact Coefficient (0.0 to 1.0)
    """

    @staticmethod
    def evaluate_anomaly(project_id: str, actual_val: float, expected_val: float, ndbi_delta: float) -> AnomalyReport:
        variance = (expected_val - actual_val) / max(expected_val, 0.001)
        var_pct = round(abs(variance * 100.0), 1)
        dric_index = round(min(max(variance * 1.5 + max(ndbi_delta, 0.0) * 0.8, 0.05), 0.98), 2)

        if dric_index < 0.25:
            status = "Green"
            trend = "Improving / Healthy Recovery"
            anomalies = []
            factors = ["Monsoon rainfall alignment", "Buffer zone intact", "Canopy density stable"]
        elif dric_index < 0.55:
            status = "Yellow"
            trend = "Stagnating / Attention Required"
            anomalies = [
                f"Observed index reading ({actual_val:.2f}) lags baseline target ({expected_val:.2f})",
                f"Recovery trajectory {var_pct}% below expected target curve"
            ]
            factors = ["Illegal timber cutting / tree removal", "Catchment siltation", "Mild built-up encroachment"]
        else:
            status = "Red"
            trend = "Degrading / Severe Underperformance"
            anomalies = [
                f"Critical index deficit: observed {actual_val:.2f} vs expected {expected_val:.2f} ({var_pct}% loss)",
                f"Severe trajectory divergence ({var_pct}% deficit from target curve)",
                "Unauthorized built-up expansion or canopy clearing in protective buffer"
            ]
            factors = ["Illegal sand mining / logging", "Upstream water diversion", "Unenforced land boundaries"]

        return AnomalyReport(
            project_id=project_id,
            status_indicator=status,
            dric_index=dric_index,
            recovery_trend=trend,
            detected_anomalies=anomalies,
            contributing_factors=factors,
            confidence_level=0.94
        )

anomaly_engine = AnomalyEngine()
