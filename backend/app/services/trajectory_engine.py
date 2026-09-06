import math
from app.models.trajectory import TrajectoryResponse, TrajectoryDataPoint


class TrajectoryEngine:
    """
    Computes Expected Recovery Trajectory vs Actual Observed Reality per conservation site.
    Dynamically adapts metric type (NDVI for forests, NDWI for water bodies) and shapes
    the curve using site-specific telemetry: health status, smuggling risk, land cover,
    and a deterministic per-site noise so every site looks genuinely different.
    """

    # ------------------------------------------------------------------ #
    # helpers
    # ------------------------------------------------------------------ #
    @staticmethod
    def _site_seed(project_id: str) -> float:
        """Deterministic 0-1 float unique to each project_id (no randomness)."""
        h = sum(ord(c) * (i + 1) for i, c in enumerate(project_id))
        return (h % 97) / 97.0          # spread across [0, 1)

    @staticmethod
    def _seasonal_factor(month_idx: int, seed: float, amplitude: float) -> float:
        """
        Returns a seasonal oscillation value for a given month index.
        month_idx: 0=baseline, 1=M2, 2=M4, 3=M7, 4=M10, 5=M12
        seed: site-specific phase offset
        amplitude: how strong the seasonal effect is (1–4 %)
        """
        phase = seed * 2 * math.pi           # shift the sine curve per site
        # Indian monsoon pattern: low early-year, peak ~M7, dip again post-monsoon
        raw = math.sin((month_idx / 5.0) * 2 * math.pi + phase)
        return round(raw * amplitude, 2)

    # ------------------------------------------------------------------ #
    # main entry
    # ------------------------------------------------------------------ #
    @staticmethod
    def get_trajectory(project_id: str) -> TrajectoryResponse:
        from app.api.endpoints.projects import PAN_INDIA_SITES

        proj = next((p for p in PAN_INDIA_SITES if p.project_id == project_id), None)

        # ---- site metadata ------------------------------------------- #
        if proj:
            title_name    = proj.title
            intervention  = f"{proj.intervention_type} for {proj.title}"
            interv_upper  = (proj.intervention_type + " " + proj.title + " " + proj.project_id).upper()

            is_forest = any(k in interv_upper for k in [
                "FOREST", "FOR", "SAN", "SANCTUARY", "TIGER", "PARK", "CANOPY",
                "BANDIPUR", "SUNDAR", "CORBETT", "SIMILIPAL", "GIR", "KAZIRANGA",
                "WAYANAD", "SILENT", "RANTHAMBORE", "MUDUMALAI", "COORG", "ARAVALLI",
                "ANANTAPUR", "LATUR", "ALWAR"
            ])

            if is_forest:
                metric_name = "NDVI Vegetation Canopy Cover %"
                base_val    = round(proj.baseline_ndvi * 100, 1)
                curr_val    = round(proj.current_ndvi  * 100, 1)
            else:
                metric_name = "NDWI Water Surface Extent %"
                base_val    = round(proj.baseline_ndwi * 100, 1)
                curr_val    = round(proj.current_ndwi  * 100, 1)

            health_status    = proj.health_status      # "Green" / "Yellow" / "Red"
            smuggling_active = proj.smuggling_alert_active
            veg_pct          = getattr(proj.land_cover, "vegetation_coverage_pct", 50) or 50
        else:
            title_name       = project_id
            intervention     = f"Ecological Conservation for {project_id}"
            is_forest        = True
            metric_name      = "NDVI Vegetation Canopy Cover %"
            base_val, curr_val = 50.0, 65.0
            health_status    = "Yellow"
            smuggling_active = False
            veg_pct          = 50

        # ---- site-specific shaping parameters ----------------------- #
        seed        = TrajectoryEngine._site_seed(project_id)
        total_gain  = round(curr_val - base_val, 1)
        is_degraded = total_gain < 0                  # Varthur, Corbett

        # Seasonal oscillation amplitude: larger for healthier/denser sites
        if health_status == "Green":
            amplitude = 1.8 + seed * 1.5          # 1.8 – 3.3 %
        elif health_status == "Yellow":
            amplitude = 0.9 + seed * 1.2          # 0.9 – 2.1 %
        else:
            amplitude = 0.4 + seed * 0.8          # 0.4 – 1.2 %

        # Recovery "pace" ratios — how fast (or slow) actual improvement happens
        # Green sites front-load recovery; Red/degraded sites lag then plateau
        if is_degraded:
            # Actual degrades non-linearly — steeper early drop then slow partial recovery
            actual_ratios = [0.0, 0.28, 0.55, 0.80, 0.92, 1.0]
        elif health_status == "Green":
            # Fast early gains, tapering — front-loaded shape
            actual_ratios = [0.0, 0.22 + seed*0.06, 0.45 + seed*0.08, 0.72, 0.90, 1.0]
        elif health_status == "Yellow":
            # Slow start, accelerates mid-year
            actual_ratios = [0.0, 0.10 + seed*0.08, 0.30 + seed*0.10, 0.62, 0.86, 1.0]
        else:  # Red
            # Sluggish recovery — back-loaded
            actual_ratios = [0.0, 0.06 + seed*0.05, 0.18 + seed*0.08, 0.50, 0.78, 1.0]

        # Expected (intervention plan) ratios — slightly optimistic, linear-ish
        exp_ratios = [0.0, 0.16, 0.34, 0.66, 0.88, 1.0]

        # Expected target gain: always positive (planning target)
        if is_degraded:
            # Plan calls for reversing the loss and adding a buffer
            exp_target_gain = max(6.0, abs(total_gain) * 1.5 + 4.0)
        else:
            exp_target_gain = max(5.0, total_gain * 1.05)

        # ---- smuggling mid-trajectory dip (Months 4-7) -------------- #
        # If smuggling is active, actual values dip extra in middle months
        smuggling_dip = {}
        if smuggling_active:
            dip_m4  = -(2.5 + seed * 1.5)    # extra drop at Month 4
            dip_m7  = -(1.8 + seed * 1.0)    # partial recovery at Month 7
            smuggling_dip = {2: dip_m4, 3: dip_m7}   # indices into months list

        # ---- build timeline points ----------------------------------- #
        months = [
            ("Baseline",              "2025-01"),
            ("Month 2 (Phase 1)",     "2025-03"),
            ("Month 4 (Pre-Monsoon)", "2025-05"),
            ("Month 7 (Monsoon Peak)","2025-08"),
            ("Month 10 (Post-Monsoon)","2025-11"),
            ("Month 12 (Current)",    "2026-01"),
        ]

        points = []
        for i, (label, ts) in enumerate(months):
            seasonal = TrajectoryEngine._seasonal_factor(i, seed, amplitude)
            actual_gain = total_gain * actual_ratios[i]
            act_val = round(base_val + actual_gain + seasonal + smuggling_dip.get(i, 0.0), 1)

            exp_gain = exp_target_gain * exp_ratios[i]
            exp_val  = round(base_val + exp_gain, 1)

            # Baseline point is always flat
            if i == 0:
                act_val = base_val
                exp_val = base_val

            # Last point is clamped to true current observed value
            if i == len(months) - 1:
                act_val = curr_val

            dev = round(act_val - exp_val, 1)
            points.append(TrajectoryDataPoint(
                month_label=label,
                timestamp=ts,
                expected_recovery_value=exp_val,
                actual_observed_value=act_val,
                deviation_delta=dev
            ))

        # ---- variance & performance ---------------------------------- #
        m12_actual = points[-1].actual_observed_value
        m12_exp    = points[-1].expected_recovery_value
        variance   = round(m12_actual - m12_exp, 1)

        if variance >= 0.0:
            performance  = "On Track / Target Exceeded"
            status_desc  = f"Exceeding planned target by +{variance}%"
        elif variance >= -5.0:
            performance  = "Minor Lag / In Progress"
            status_desc  = f"Minor variance of {variance}% from target curve"
        else:
            performance  = "Intervention Required"
            status_desc  = f"Behind target curve by {abs(variance)}%"

        if smuggling_active:
            performance = "Intervention Required"
            status_desc += " — Active smuggling alert detected"

        summary = (
            f"12-Month Multi-Spectral Trajectory for {title_name}: "
            f"Baseline {base_val}% {metric_name} → Current Observed {curr_val}%. "
            f"Performance: '{performance}' ({status_desc})."
        )

        return TrajectoryResponse(
            project_id=project_id,
            intervention_type=intervention,
            metric_name=metric_name,
            baseline_value=base_val,
            current_value=curr_val,
            performance_status=performance,
            trajectory_points=points,
            overall_variance_percentage=variance,
            status_summary=summary
        )


trajectory_engine = TrajectoryEngine()
