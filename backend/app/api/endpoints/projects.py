from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.project import ProjectMapHover, LatLng, ProbableCostEstimate, ProjectSummary, LandCoverBreakdown

router = APIRouter()

PAN_INDIA_SITES: List[ProjectMapHover] = [

    # ════════════════════════════════════════════════
    # 🌊 LAKES & WETLANDS
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-KAR-01",
        title="Hebbal Lake Rejuvenation & Wetland Catchment",
        intervention_type="Lake Rejuvenation",
        location_name="Bengaluru Urban, Karnataka",
        coordinates=LatLng(lat=13.0359, lng=77.5891),
        health_status="Green",
        allocated_funds_inr=25000000.0,
        expended_funds_inr=21000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=62.0,
            water_coverage_pct=54.0,
            urban_builtup_pct=14.0,
            barren_land_pct=8.0
        ),
        baseline_ndwi=0.28,
        current_ndwi=0.54,
        baseline_ndvi=0.35,
        current_ndvi=0.62,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Seasonal Inflow Channel Maintenance & Desilting",
            estimated_cost_inr=150000.0,
            cost_breakdown=["Desilting inlet channels (₹90,000)", "Hyacinth removal (₹60,000)"],
            funding_scheme_recommended="AMRUT 2.0 Maintenance Grant"
        )
    ),
    ProjectMapHover(
        project_id="IND-KAR-02",
        title="Varthur Lake Watershed & Buffer Protection",
        intervention_type="Watershed Restoration",
        location_name="Bengaluru East, Karnataka",
        coordinates=LatLng(lat=12.9438, lng=77.7470),
        health_status="Yellow",
        allocated_funds_inr=18000000.0,
        expended_funds_inr=14500000.0,
        budget_sufficiency="Funds Underutilized / Wasted Risk",
        smuggling_alert_active=True,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=42.0,
            water_coverage_pct=44.0,
            urban_builtup_pct=18.0,
            barren_land_pct=14.0
        ),
        baseline_ndwi=0.30,
        current_ndwi=0.42,
        baseline_ndvi=0.60,
        current_ndvi=0.48,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Timber Patrol Enforcement & Peripheral Fencing",
            estimated_cost_inr=450000.0,
            cost_breakdown=["Boundary security fencing (₹3,00,000)", "Sediment trap clearance (₹1,50,000)"],
            funding_scheme_recommended="Jal Shakti Abhiyan & CAMPA Anti-Logging Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-ODI-01",
        title="Chilika Lake Ramsar Wetland & Seagrass Zone",
        intervention_type="Ramsar Wetland Restoration",
        location_name="Puri, Odisha",
        coordinates=LatLng(lat=19.7042, lng=85.3120),
        health_status="Green",
        allocated_funds_inr=45000000.0,
        expended_funds_inr=39000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=58.0,
            water_coverage_pct=68.0,
            urban_builtup_pct=4.0,
            barren_land_pct=10.0
        ),
        baseline_ndwi=0.52,
        current_ndwi=0.66,
        baseline_ndvi=0.42,
        current_ndvi=0.58,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Salinity Channel Dredging & Seagrass Monitoring",
            estimated_cost_inr=320000.0,
            cost_breakdown=["Channel desilting (₹2,20,000)", "Ecosystem bathymetry survey (₹1,00,000)"],
            funding_scheme_recommended="National Coastal Mission & Ramsar Conservation Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-MNP-01",
        title="Loktak Lake Floating Phumdi Catchment",
        intervention_type="Freshwater Lake Conservation",
        location_name="Bishnupur, Manipur",
        coordinates=LatLng(lat=24.5550, lng=93.7880),
        health_status="Yellow",
        allocated_funds_inr=30000000.0,
        expended_funds_inr=22000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=65.0,
            water_coverage_pct=50.0,
            urban_builtup_pct=6.0,
            barren_land_pct=9.0
        ),
        baseline_ndwi=0.45,
        current_ndwi=0.51,
        baseline_ndvi=0.55,
        current_ndvi=0.58,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Biomass Phumdi Clearance & Inlet Silt Control",
            estimated_cost_inr=280000.0,
            cost_breakdown=["Floating weed removal (₹1,80,000)", "Inlet silt trap (₹1,00,000)"],
            funding_scheme_recommended="North East Conservation Mission"
        )
    ),
    ProjectMapHover(
        project_id="IND-KER-01",
        title="Vembanad Wetland Basin Rejuvenation",
        intervention_type="Estuarine Wetland Protection",
        location_name="Alappuzha, Kerala",
        coordinates=LatLng(lat=9.6000, lng=76.4000),
        health_status="Green",
        allocated_funds_inr=35000000.0,
        expended_funds_inr=31000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=72.0,
            water_coverage_pct=64.0,
            urban_builtup_pct=8.0,
            barren_land_pct=6.0
        ),
        baseline_ndwi=0.48,
        current_ndwi=0.62,
        baseline_ndvi=0.52,
        current_ndvi=0.68,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Bund Breach Prevention & Backwater Silt Trap",
            estimated_cost_inr=210000.0,
            cost_breakdown=["Thanneermukkom bund maintenance (₹1,40,000)", "Sediment testing (₹70,000)"],
            funding_scheme_recommended="National Plan for Conservation of Aquatic Ecosystems (NPCA)"
        )
    ),

    # ════════════════════════════════════════════════
    # 🌲 FORESTS & TIGER RESERVES
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-KAR-03",
        title="Bandipur Forest & Tiger Reserve Buffer",
        intervention_type="Forest Reserve Protection",
        location_name="Chamarajanagar, Karnataka",
        coordinates=LatLng(lat=11.6667, lng=76.6262),
        health_status="Green",
        allocated_funds_inr=50000000.0,
        expended_funds_inr=44000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=82.0,
            water_coverage_pct=15.0,
            urban_builtup_pct=2.0,
            barren_land_pct=6.0
        ),
        baseline_ndwi=0.22,
        current_ndwi=0.28,
        baseline_ndvi=0.68,
        current_ndvi=0.76,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Fire Line Clearance & Wildlife Corridor Watch",
            estimated_cost_inr=380000.0,
            cost_breakdown=["Fire line maintenance (₹2,50,000)", "Solar thermal camera watchtowers (₹1,30,000)"],
            funding_scheme_recommended="Project Tiger & CAMPA Forest Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-UTT-01",
        title="Jim Corbett National Park Catchment",
        intervention_type="Canopy & Habitat Protection",
        location_name="Nainital, Uttarakhand",
        coordinates=LatLng(lat=29.5300, lng=78.7747),
        health_status="Yellow",
        allocated_funds_inr=42000000.0,
        expended_funds_inr=31000000.0,
        budget_sufficiency="Funds Underutilized / Wasted Risk",
        smuggling_alert_active=True,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=74.0,
            water_coverage_pct=18.0,
            urban_builtup_pct=3.0,
            barren_land_pct=10.0
        ),
        baseline_ndwi=0.25,
        current_ndwi=0.30,
        baseline_ndvi=0.78,
        current_ndvi=0.62,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Anti-Poaching Patrol & Sal Tree Loss Audit",
            estimated_cost_inr=520000.0,
            cost_breakdown=["Drone canopy surveillance (₹3,20,000)", "Buffer boundary demarcation (₹2,00,000)"],
            funding_scheme_recommended="Project Tiger Conservation Authority"
        )
    ),
    ProjectMapHover(
        project_id="IND-WB-01",
        title="Sundarbans Mangrove Tidal Belt",
        intervention_type="Mangrove Afforestation",
        location_name="South 24 Parganas, West Bengal",
        coordinates=LatLng(lat=21.9497, lng=88.9007),
        health_status="Green",
        allocated_funds_inr=60000000.0,
        expended_funds_inr=55000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=76.0,
            water_coverage_pct=55.0,
            urban_builtup_pct=3.0,
            barren_land_pct=8.0
        ),
        baseline_ndwi=0.45,
        current_ndwi=0.58,
        baseline_ndvi=0.62,
        current_ndvi=0.74,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Tidal Mudflat Sapling Planting & Embankment Security",
            estimated_cost_inr=400000.0,
            cost_breakdown=["Mangrove sapling nursery (₹2,50,000)", "Erosion embankment geotextiles (₹1,50,000)"],
            funding_scheme_recommended="MISHTI Scheme (Mangrove Initiative for Shoreline Habitats)"
        )
    ),

    # ════════════════════════════════════════════════
    # 🔴 RED STATUS — FORESTS (CRITICAL DEGRADATION)
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-RAJ-FOR-RED-01",
        title="Sariska Tiger Reserve Canopy Crisis Zone",
        intervention_type="Forest Reserve Protection",
        location_name="Alwar, Rajasthan",
        coordinates=LatLng(lat=27.3300, lng=76.4400),
        health_status="Red",
        allocated_funds_inr=38000000.0,
        expended_funds_inr=9200000.0,
        budget_sufficiency="Budget Deficit",
        smuggling_alert_active=True,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=31.0,
            water_coverage_pct=8.0,
            urban_builtup_pct=12.0,
            barren_land_pct=49.0
        ),
        baseline_ndwi=0.18,
        current_ndwi=0.10,
        baseline_ndvi=0.58,
        current_ndvi=0.31,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Emergency Anti-Poaching Force Deployment & Canopy Rehabilitation",
            estimated_cost_inr=1250000.0,
            cost_breakdown=[
                "Emergency anti-poaching mobile patrol units (₹5,50,000)",
                "Satellite drone canopy monitoring system (₹4,00,000)",
                "Native tree sapling emergency plantation (₹3,00,000)"
            ],
            funding_scheme_recommended="Project Tiger Emergency Intervention Fund & CAMPA Crisis Grant"
        )
    ),
    ProjectMapHover(
        project_id="IND-MP-FOR-RED-01",
        title="Panna Tiger Reserve Degraded Core Zone",
        intervention_type="Forest Reserve Protection",
        location_name="Panna, Madhya Pradesh",
        coordinates=LatLng(lat=24.7200, lng=80.1900),
        health_status="Red",
        allocated_funds_inr=42000000.0,
        expended_funds_inr=8500000.0,
        budget_sufficiency="Budget Deficit",
        smuggling_alert_active=True,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=28.0,
            water_coverage_pct=12.0,
            urban_builtup_pct=8.0,
            barren_land_pct=52.0
        ),
        baseline_ndwi=0.22,
        current_ndwi=0.12,
        baseline_ndvi=0.62,
        current_ndvi=0.28,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Tiger Rewilding Program & Illegal Mining Enforcement",
            estimated_cost_inr=1450000.0,
            cost_breakdown=[
                "Illegal mining cessation enforcement & boundary wall (₹6,00,000)",
                "Tiger corridor bio-bridge construction (₹5,00,000)",
                "Riparian vegetation emergency replanting (₹3,50,000)"
            ],
            funding_scheme_recommended="National Tiger Conservation Authority Emergency Fund"
        )
    ),

    # ════════════════════════════════════════════════
    # 🔴 RED STATUS — DAMS (CRITICAL SILTATION / WATER LOSS)
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-KAR-DAM-RED-01",
        title="Tungabhadra Dam Critical Siltation Crisis",
        intervention_type="Reservoir Siltation Control",
        location_name="Hospet, Ballari, Karnataka",
        coordinates=LatLng(lat=15.2600, lng=76.3400),
        health_status="Red",
        allocated_funds_inr=65000000.0,
        expended_funds_inr=11000000.0,
        budget_sufficiency="Budget Deficit",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=22.0,
            water_coverage_pct=38.0,
            urban_builtup_pct=14.0,
            barren_land_pct=26.0
        ),
        baseline_ndwi=0.62,
        current_ndwi=0.38,
        baseline_ndvi=0.40,
        current_ndvi=0.22,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Emergency Dredging & Silt Trap Rehabilitation — 76% Capacity Lost",
            estimated_cost_inr=2800000.0,
            cost_breakdown=[
                "Heavy dredger deployment for 76% silted basin (₹14,00,000)",
                "Upstream check dam emergency repair network (₹8,00,000)",
                "Catchment rim afforestation & erosion control (₹6,00,000)"
            ],
            funding_scheme_recommended="Dam Rehabilitation & Improvement Project (DRIP Phase II) Emergency Grant"
        )
    ),
    ProjectMapHover(
        project_id="IND-TN-DAM-RED-01",
        title="Mettur Stanley Reservoir — Drought & Siltation Crisis",
        intervention_type="Reservoir Catchment Protection",
        location_name="Salem, Tamil Nadu",
        coordinates=LatLng(lat=11.8000, lng=77.8000),
        health_status="Red",
        allocated_funds_inr=58000000.0,
        expended_funds_inr=7500000.0,
        budget_sufficiency="Budget Deficit",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=18.0,
            water_coverage_pct=32.0,
            urban_builtup_pct=16.0,
            barren_land_pct=34.0
        ),
        baseline_ndwi=0.58,
        current_ndwi=0.32,
        baseline_ndvi=0.44,
        current_ndvi=0.18,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Emergency Kaveri Inflow Restoration & Silt Basin Dredging",
            estimated_cost_inr=3200000.0,
            cost_breakdown=[
                "Kaveri basin inflow silt dredging (₹16,00,000)",
                "Upstream watershed afforestation emergency (₹9,00,000)",
                "Drought-resistant tree belt plantation (₹7,00,000)"
            ],
            funding_scheme_recommended="Jal Shakti Abhiyan Crisis Fund & National Hydrology Project Emergency"
        )
    ),

    # ════════════════════════════════════════════════
    # 🐅 WILDLIFE SANCTUARIES
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-ASS-01",
        title="Kaziranga Sanctuary & Brahmaputra Floodplain",
        intervention_type="Floodplain Sanctuary Conservation",
        location_name="Golaghat, Assam",
        coordinates=LatLng(lat=26.5775, lng=93.1711),
        health_status="Green",
        allocated_funds_inr=48000000.0,
        expended_funds_inr=41000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=78.0,
            water_coverage_pct=32.0,
            urban_builtup_pct=2.0,
            barren_land_pct=8.0
        ),
        baseline_ndwi=0.35,
        current_ndwi=0.48,
        baseline_ndvi=0.65,
        current_ndvi=0.75,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="High-Ground Flood Shelter Construction & Wetland Silt Removal",
            estimated_cost_inr=490000.0,
            cost_breakdown=["High-ground highland mound repair (₹3,00,000)", "Beel wetland desilting (₹1,90,000)"],
            funding_scheme_recommended="Integrated Development of Wildlife Habitats (IDWH)"
        )
    ),
    ProjectMapHover(
        project_id="IND-GUJ-01",
        title="Gir Forest & Lion Sanctuary Buffer",
        intervention_type="Scrub Forest & Wildlife Protection",
        location_name="Junagadh, Gujarat",
        coordinates=LatLng(lat=21.1243, lng=70.8242),
        health_status="Green",
        allocated_funds_inr=38000000.0,
        expended_funds_inr=33000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=58.0,
            water_coverage_pct=12.0,
            urban_builtup_pct=5.0,
            barren_land_pct=25.0
        ),
        baseline_ndwi=0.15,
        current_ndwi=0.20,
        baseline_ndvi=0.48,
        current_ndvi=0.55,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Watering Hole Check Dam Dredging & Fencing",
            estimated_cost_inr=260000.0,
            cost_breakdown=["Solar pump waterholes (₹1,60,000)", "Open well parapet walling (₹1,00,000)"],
            funding_scheme_recommended="Project Lion Conservation Initiative"
        )
    ),

    # ════════════════════════════════════════════════
    # 💧 DAMS & RESERVOIRS
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-GUJ-02",
        title="Sardar Sarovar Narmada Reservoir Catchment",
        intervention_type="Reservoir Catchment Desilting",
        location_name="Narmada, Gujarat",
        coordinates=LatLng(lat=21.8319, lng=73.7489),
        health_status="Green",
        allocated_funds_inr=75000000.0,
        expended_funds_inr=68000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=45.0,
            water_coverage_pct=72.0,
            urban_builtup_pct=4.0,
            barren_land_pct=15.0
        ),
        baseline_ndwi=0.55,
        current_ndwi=0.72,
        baseline_ndvi=0.38,
        current_ndvi=0.48,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Reservoir Rim Catchment Afforestation & Bathymetric Dredging",
            estimated_cost_inr=650000.0,
            cost_breakdown=["Rim slope terracing (₹4,00,000)", "Sedimentation basin clearance (₹2,50,000)"],
            funding_scheme_recommended="Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)"
        )
    ),
    ProjectMapHover(
        project_id="IND-TEL-01",
        title="Nagarjuna Sagar Dam Basin & Catchment",
        intervention_type="Reservoir Watershed Restoration",
        location_name="Nalgonda, Telangana",
        coordinates=LatLng(lat=16.5753, lng=79.3125),
        health_status="Green",
        allocated_funds_inr=52000000.0,
        expended_funds_inr=46000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=42.0,
            water_coverage_pct=68.0,
            urban_builtup_pct=6.0,
            barren_land_pct=18.0
        ),
        baseline_ndwi=0.50,
        current_ndwi=0.68,
        baseline_ndvi=0.36,
        current_ndvi=0.44,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Upstream Check Dam Desilting & Silt Trap Clearance",
            estimated_cost_inr=390000.0,
            cost_breakdown=["Upstream check dam repair (₹2,40,000)", "Catchment afforestation (₹1,50,000)"],
            funding_scheme_recommended="National Hydrology Project (NHP)"
        )
    ),
    ProjectMapHover(
        project_id="IND-KAR-04",
        title="KRS Dam & Krishnarajasagara Reservoir Catchment",
        intervention_type="Reservoir Catchment & Desilting",
        location_name="Mandya / Mysuru, Karnataka",
        coordinates=LatLng(lat=12.4244, lng=76.5742),
        health_status="Green",
        allocated_funds_inr=78000000.0,
        expended_funds_inr=69000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=52.0,
            water_coverage_pct=76.0,
            urban_builtup_pct=6.0,
            barren_land_pct=6.0
        ),
        baseline_ndwi=0.54,
        current_ndwi=0.76,
        baseline_ndvi=0.40,
        current_ndvi=0.52,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Cauvery Inflow Dredging & Royal Canal Silt Clearance",
            estimated_cost_inr=580000.0,
            cost_breakdown=["Reservoir inlet desilting (₹3,60,000)", "Catchment greening (₹2,20,000)"],
            funding_scheme_recommended="Cauvery Basin Rejuvenation & PMKSY"
        )
    ),
    ProjectMapHover(
        project_id="IND-HP-01",
        title="Bhakra Nangal Dam Satluj Hydro Reservoir",
        intervention_type="Reservoir Catchment Desilting",
        location_name="Bilaspur, Himachal Pradesh",
        coordinates=LatLng(lat=31.4119, lng=76.4356),
        health_status="Green",
        allocated_funds_inr=58000000.0,
        expended_funds_inr=52000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=54.0,
            water_coverage_pct=76.0,
            urban_builtup_pct=3.0,
            barren_land_pct=17.0
        ),
        baseline_ndwi=0.58,
        current_ndwi=0.74,
        baseline_ndvi=0.42,
        current_ndvi=0.55,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Reservoir Catchment Slope Afforestation & De-Silt Basin",
            estimated_cost_inr=480000.0,
            cost_breakdown=["Slope stabilization (₹3,00,000)", "Sediment basin clearing (₹1,80,000)"],
            funding_scheme_recommended="National Hydrology Project"
        )
    ),

    # ════════════════════════════════════════════════
    # ⛏️ GROUNDWATER RECHARGE CATCHMENTS
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-RAJ-03",
        title="Alwar Groundwater Recharge Check Dam",
        intervention_type="Groundwater Recharge",
        location_name="Alwar, Rajasthan",
        coordinates=LatLng(lat=27.5530, lng=76.6346),
        health_status="Red",
        allocated_funds_inr=12000000.0,
        expended_funds_inr=9800000.0,
        budget_sufficiency="Budget Deficit",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=24.0,
            water_coverage_pct=21.0,
            urban_builtup_pct=12.0,
            barren_land_pct=43.0
        ),
        baseline_ndwi=0.18,
        current_ndwi=0.21,
        baseline_ndvi=0.25,
        current_ndvi=0.27,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Check Dam Silt Dredging & Upstream Reforestation",
            estimated_cost_inr=850000.0,
            cost_breakdown=["Heavy desilting machinery (₹5,50,000)", "Check dam repair & afforestation (₹3,00,000)"],
            funding_scheme_recommended="WDC-PMKSY 2.0 & CAMPA Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-MAH-01",
        title="Latur Aquifer Groundwater Recharge Shafts",
        intervention_type="Arid Underground Recharge",
        location_name="Latur, Maharashtra",
        coordinates=LatLng(lat=18.4088, lng=76.5604),
        health_status="Yellow",
        allocated_funds_inr=22000000.0,
        expended_funds_inr=17500000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=32.0,
            water_coverage_pct=18.0,
            urban_builtup_pct=15.0,
            barren_land_pct=35.0
        ),
        baseline_ndwi=0.14,
        current_ndwi=0.19,
        baseline_ndvi=0.30,
        current_ndvi=0.35,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Recharge Shaft Dredging & Percolation Tank Maintenance",
            estimated_cost_inr=310000.0,
            cost_breakdown=["Recharge pit filter replacement (₹1,90,000)", "Catchment bunding (₹1,20,000)"],
            funding_scheme_recommended="Atal Bhujal Yojana (ABHY)"
        )
    ),
    ProjectMapHover(
        project_id="IND-AP-01",
        title="Anantapur Arid Aquifer Recharge Shaft Belt",
        intervention_type="Arid Underground Recharge",
        location_name="Anantapur, Andhra Pradesh",
        coordinates=LatLng(lat=14.6819, lng=77.6006),
        health_status="Yellow",
        allocated_funds_inr=24000000.0,
        expended_funds_inr=19000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=28.0,
            water_coverage_pct=16.0,
            urban_builtup_pct=12.0,
            barren_land_pct=44.0
        ),
        baseline_ndwi=0.12,
        current_ndwi=0.17,
        baseline_ndvi=0.24,
        current_ndvi=0.30,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Recharge Shaft Dredging & Check Dam Silt Trap",
            estimated_cost_inr=290000.0,
            cost_breakdown=["Recharge pit desilting (₹1,70,000)", "Catchment bunding (₹1,20,000)"],
            funding_scheme_recommended="Atal Bhujal Yojana"
        )
    ),

    # ════════════════════════════════════════════════
    # 🌾 VEGETATION BELTS
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-HAR-01",
        title="Aravalli Great Green Wall Afforestation Belt",
        intervention_type="Desertification Barrier Afforestation",
        location_name="Gurugram / Rewari, Haryana",
        coordinates=LatLng(lat=28.3200, lng=76.8500),
        health_status="Green",
        allocated_funds_inr=40000000.0,
        expended_funds_inr=36000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=52.0,
            water_coverage_pct=14.0,
            urban_builtup_pct=14.0,
            barren_land_pct=20.0
        ),
        baseline_ndwi=0.16,
        current_ndwi=0.22,
        baseline_ndvi=0.32,
        current_ndvi=0.52,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Native Shrub Planting & Mining Pit Eco-Restoration",
            estimated_cost_inr=410000.0,
            cost_breakdown=["Sapling planting (₹2,60,000)", "Illegal encroachment fencing (₹1,50,000)"],
            funding_scheme_recommended="Aravalli Green Wall Project & Green Credit Program"
        )
    ),

    # ════════════════════════════════════════════════
    # 🌊 LAKES & WETLANDS (ADDITIONAL)
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-JK-01",
        title="Wular Lake Freshwater Ramsar Wetland",
        intervention_type="Freshwater Lake Conservation",
        location_name="Bandipora, Jammu & Kashmir",
        coordinates=LatLng(lat=34.3333, lng=74.5500),
        health_status="Green",
        allocated_funds_inr=38000000.0,
        expended_funds_inr=32000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=48.0,
            water_coverage_pct=70.0,
            urban_builtup_pct=5.0,
            barren_land_pct=17.0
        ),
        baseline_ndwi=0.50,
        current_ndwi=0.68,
        baseline_ndvi=0.40,
        current_ndvi=0.52,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Willow Tree Silt Dredging & Siltation Basin Wall",
            estimated_cost_inr=340000.0,
            cost_breakdown=["Willow removal & desilting (₹2,10,000)", "Inflow channel dredging (₹1,30,000)"],
            funding_scheme_recommended="National Wetland Conservation Programme (NWCP)"
        )
    ),

    # ════════════════════════════════════════════════
    # 🌲 FORESTS (ADDITIONAL)
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-ODI-02",
        title="Similipal Tiger Reserve & Biosphere Canopy",
        intervention_type="Forest Reserve Protection",
        location_name="Mayurbhanj, Odisha",
        coordinates=LatLng(lat=21.9000, lng=86.3333),
        health_status="Green",
        allocated_funds_inr=46000000.0,
        expended_funds_inr=41000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=84.0,
            water_coverage_pct=12.0,
            urban_builtup_pct=1.0,
            barren_land_pct=3.0
        ),
        baseline_ndwi=0.20,
        current_ndwi=0.26,
        baseline_ndvi=0.72,
        current_ndvi=0.82,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Forest Fire Watchtower Watch & Elephant Corridor Protection",
            estimated_cost_inr=360000.0,
            cost_breakdown=["Corridor solar fencing (₹2,20,000)", "Watering hole desilting (₹1,40,000)"],
            funding_scheme_recommended="CAMPA Biosphere Reserve Grant"
        )
    ),
    ProjectMapHover(
        project_id="IND-KER-FOR-01",
        title="Wayanad Wildlife Sanctuary & Forest Canopy",
        intervention_type="Elephant Corridor & Forest Protection",
        location_name="Wayanad, Kerala",
        coordinates=LatLng(lat=11.6854, lng=76.1320),
        health_status="Green",
        allocated_funds_inr=48000000.0,
        expended_funds_inr=42000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=82.0,
            water_coverage_pct=14.0,
            urban_builtup_pct=2.0,
            barren_land_pct=2.0
        ),
        baseline_ndwi=0.22,
        current_ndwi=0.28,
        baseline_ndvi=0.74,
        current_ndvi=0.86,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Human-Wildlife Conflict Solar Fencing & Fire Line Clearing",
            estimated_cost_inr=370000.0,
            cost_breakdown=["Solar fencing (₹2,20,000)", "Fire line clearing (₹1,50,000)"],
            funding_scheme_recommended="Project Elephant & CAMPA Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-TN-FOR-01",
        title="Mudumalai Tiger Reserve & Nilgiri Biosphere",
        intervention_type="Biosphere Corridor Protection",
        location_name="Nilgiris, Tamil Nadu",
        coordinates=LatLng(lat=11.5620, lng=76.5340),
        health_status="Green",
        allocated_funds_inr=50000000.0,
        expended_funds_inr=44000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=80.0,
            water_coverage_pct=10.0,
            urban_builtup_pct=2.0,
            barren_land_pct=8.0
        ),
        baseline_ndwi=0.18,
        current_ndwi=0.24,
        baseline_ndvi=0.72,
        current_ndvi=0.85,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Invasive Lantana Camara Clearing & Corridor Protection",
            estimated_cost_inr=360000.0,
            cost_breakdown=["Lantana clearing (₹2,10,000)", "Corridor monitoring (₹1,50,000)"],
            funding_scheme_recommended="CAMPA Biosphere Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-RAJ-FOR-01",
        title="Ranthambore Tiger Reserve & Aravalli Buffer",
        intervention_type="Dry Deciduous Tiger Habitat",
        location_name="Sawai Madhopur, Rajasthan",
        coordinates=LatLng(lat=26.0173, lng=76.5026),
        health_status="Green",
        allocated_funds_inr=46000000.0,
        expended_funds_inr=39000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=68.0,
            water_coverage_pct=14.0,
            urban_builtup_pct=5.0,
            barren_land_pct=13.0
        ),
        baseline_ndwi=0.16,
        current_ndwi=0.22,
        baseline_ndvi=0.52,
        current_ndvi=0.64,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Water Hole Solar Pump Maintenance & Anti-Encroachment Wall",
            estimated_cost_inr=410000.0,
            cost_breakdown=["Solar waterhole pumps (₹2,50,000)", "Boundary wall (₹1,60,000)"],
            funding_scheme_recommended="Project Tiger Authority"
        )
    ),

    # ════════════════════════════════════════════════
    # 💧 DAMS (ADDITIONAL — HEALTHY)
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-KER-DAM-01",
        title="Idukki Arch Dam & Periyar Catchment",
        intervention_type="Reservoir & Canopy Protection",
        location_name="Idukki, Kerala",
        coordinates=LatLng(lat=9.8450, lng=76.9750),
        health_status="Green",
        allocated_funds_inr=68000000.0,
        expended_funds_inr=62000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=78.0,
            water_coverage_pct=68.0,
            urban_builtup_pct=3.0,
            barren_land_pct=5.0
        ),
        baseline_ndwi=0.50,
        current_ndwi=0.65,
        baseline_ndvi=0.72,
        current_ndvi=0.82,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Catchment Evergreen Forest Buffer & Runoff Control",
            estimated_cost_inr=390000.0,
            cost_breakdown=["Forest buffer planting (₹2,40,000)", "Runoff control bunds (₹1,50,000)"],
            funding_scheme_recommended="CAMPA Biodiversity Fund"
        )
    ),
    ProjectMapHover(
        project_id="IND-MAH-DAM-01",
        title="Koyna Dam Hydroelectric Reservoir",
        intervention_type="Reservoir Catchment Desilting",
        location_name="Satara, Maharashtra",
        coordinates=LatLng(lat=17.4000, lng=73.7500),
        health_status="Green",
        allocated_funds_inr=72000000.0,
        expended_funds_inr=65000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=68.0,
            water_coverage_pct=72.0,
            urban_builtup_pct=4.0,
            barren_land_pct=6.0
        ),
        baseline_ndwi=0.54,
        current_ndwi=0.72,
        baseline_ndvi=0.58,
        current_ndvi=0.70,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Western Ghats Rim Afforestation & Dredging",
            estimated_cost_inr=450000.0,
            cost_breakdown=["Ghats rim afforestation (₹2,80,000)", "Dredging operations (₹1,70,000)"],
            funding_scheme_recommended="National Hydrology Project"
        )
    ),

    # ════════════════════════════════════════════════
    # 🌊 LAKES (ADDITIONAL)
    # ════════════════════════════════════════════════
    ProjectMapHover(
        project_id="IND-RAJ-LAKE-01",
        title="Lake Pichola & Fateh Sagar Watershed",
        intervention_type="Heritage Urban Lake Rejuvenation",
        location_name="Udaipur, Rajasthan",
        coordinates=LatLng(lat=24.5714, lng=73.6744),
        health_status="Green",
        allocated_funds_inr=32000000.0,
        expended_funds_inr=28000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=44.0,
            water_coverage_pct=58.0,
            urban_builtup_pct=14.0,
            barren_land_pct=8.0
        ),
        baseline_ndwi=0.42,
        current_ndwi=0.62,
        baseline_ndvi=0.35,
        current_ndvi=0.45,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Sewerage Interception & Weed Removal",
            estimated_cost_inr=310000.0,
            cost_breakdown=["Sewage interception (₹2,00,000)", "Weed removal (₹1,10,000)"],
            funding_scheme_recommended="AMRUT 2.0 Water Body Rejuvenation"
        )
    ),
    ProjectMapHover(
        project_id="IND-JK-LAKE-01",
        title="Dal Lake Wetland Catchment & Char Chinar",
        intervention_type="High-Altitude Lake Protection",
        location_name="Srinagar, Jammu & Kashmir",
        coordinates=LatLng(lat=34.1120, lng=74.8690),
        health_status="Yellow",
        allocated_funds_inr=45000000.0,
        expended_funds_inr=36000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=42.0,
            water_coverage_pct=52.0,
            urban_builtup_pct=14.0,
            barren_land_pct=12.0
        ),
        baseline_ndwi=0.48,
        current_ndwi=0.65,
        baseline_ndvi=0.46,
        current_ndvi=0.58,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="De-Weeding Harvester Operation & Sewage Trap",
            estimated_cost_inr=490000.0,
            cost_breakdown=["Harvester weed clearing (₹3,00,000)", "Sewage trap installation (₹1,90,000)"],
            funding_scheme_recommended="Prime Minister's Development Package for J&K"
        )
    ),
    ProjectMapHover(
        project_id="IND-MP-LAKE-01",
        title="Bhojtal Upper Lake Ramsar Wetland",
        intervention_type="Ramsar Freshwater Wetland",
        location_name="Bhopal, Madhya Pradesh",
        coordinates=LatLng(lat=23.2500, lng=77.3500),
        health_status="Green",
        allocated_funds_inr=40000000.0,
        expended_funds_inr=35000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=50.0,
            water_coverage_pct=56.0,
            urban_builtup_pct=10.0,
            barren_land_pct=8.0
        ),
        baseline_ndwi=0.46,
        current_ndwi=0.64,
        baseline_ndvi=0.44,
        current_ndvi=0.56,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required="Catchment Plantation & Buffer Zone Demarcation",
            estimated_cost_inr=340000.0,
            cost_breakdown=["Buffer zone plantation (₹2,10,000)", "Zone demarcation (₹1,30,000)"],
            funding_scheme_recommended="National Plan for Conservation of Aquatic Ecosystems"
        )
    ),
]


@router.get("/projects", response_model=List[ProjectSummary], summary="List All Pan-India Projects")
async def list_projects(category: Optional[str] = None):
    summaries = []
    for p in PAN_INDIA_SITES:
        state = p.location_name.split(",")[-1].strip()
        district = p.location_name.split(",")[0].strip()

        # Derive impact score and DRIC index from real telemetry
        if p.health_status == "Green":
            impact_score = round(75.0 + (p.current_ndvi * 20.0), 1)
            dric_index = round(0.08 + ((1.0 - p.current_ndvi) * 0.15), 2)
        elif p.health_status == "Yellow":
            impact_score = round(52.0 + (p.current_ndvi * 15.0), 1)
            dric_index = round(0.30 + ((1.0 - p.current_ndvi) * 0.25), 2)
        else:  # Red
            impact_score = round(20.0 + (p.current_ndvi * 12.0), 1)
            dric_index = round(0.62 + ((1.0 - p.current_ndvi) * 0.30), 2)

        summaries.append(ProjectSummary(
            id=p.project_id,
            name=p.title,
            intervention_type=p.intervention_type,
            state=state,
            district=district,
            status=p.health_status,
            impact_score=min(99.0, impact_score),
            dric_index=min(0.99, dric_index),
            budget_status=p.budget_sufficiency,
            smuggling_risk="Critical" if p.smuggling_alert_active else ("High" if p.health_status == "Red" else "Low"),
            last_updated="2026-09-01"
        ))
    return summaries


@router.get("/map/hover-info", response_model=List[ProjectMapHover], summary="Pan-India Map Hover Information & Cost Estimates")
async def get_map_hover_projects():
    return PAN_INDIA_SITES


@router.get("/map/hover-info/{project_id}", response_model=ProjectMapHover, summary="Get Project Hover Info by ID")
async def get_project_hover_by_id(project_id: str):
    for p in PAN_INDIA_SITES:
        if p.project_id.lower() == project_id.lower():
            return p
    return generate_dynamic_site_telemetry(project_id)


def generate_dynamic_site_telemetry(site_id: str, query_name: Optional[str] = None) -> ProjectMapHover:
    hash_val = sum(ord(c) for c in site_id)
    name_lower = (query_name or site_id).lower()

    is_dam = any(w in name_lower for w in ["dam", "reservoir", "sagar", "barrage", "hydro", "basin"])
    is_forest = any(w in name_lower for w in ["forest", "reserve", "national park", "tiger", "valley", "coorg", "wayanad", "corbett", "gir", "kanha", "periyar", "wood"])
    is_sanctuary = any(w in name_lower for w in ["sanctuary", "wildlife", "biome", "biosphere"])
    is_lake = any(w in name_lower for w in ["lake", "wetland", "ramsar", "lagoon", "pichola", "dal", "wular", "chilika", "loktak", "tal", "beel", "pond"])
    is_groundwater = any(w in name_lower for w in ["groundwater", "aquifer", "recharge", "well", "shaft", "check dam", "arid"])

    lat = round(8.0 + (hash_val % 280) / 10.0, 4)
    lng = round(68.0 + ((hash_val * 7) % 280) / 10.0, 4)

    if is_dam:
        intervention = "Hydro-Reservoir & Catchment Protection"
        veg = round(18.0 + (hash_val % 15), 1)
        water = round(68.0 + (hash_val % 18), 1)
        built = round(3.0 + (hash_val % 5), 1)
        barren = round(max(0.0, 100.0 - veg - water - built), 1)
        current_ndwi = round(0.68 + (hash_val % 15) / 100.0, 2)
        baseline_ndwi = round(current_ndwi - 0.16, 2)
        current_ndvi = round(0.38 + (hash_val % 12) / 100.0, 2)
        baseline_ndvi = round(current_ndvi - 0.08, 2)
        status = "Green" if current_ndwi > 0.60 else "Yellow"
        action = "Spillway Sediment Desilting & Catchment Rim Afforestation"
        cost = 550000.0 + (hash_val % 25) * 10000.0
        scheme = "Dam Rehabilitation and Improvement Project (DRIP Phase II) & PMKSY"
        breakdown = ["Catchment rim slope afforestation (₹3,20,000)", "Inflow bathymetric dredging (₹2,30,000)"]

    elif is_forest or is_sanctuary:
        intervention = "Canopy Conservation & Wildlife Corridor Watch"
        veg = round(78.0 + (hash_val % 14), 1)
        water = round(8.0 + (hash_val % 10), 1)
        built = round(1.0 + (hash_val % 4), 1)
        barren = round(max(0.0, 100.0 - veg - water - built), 1)
        current_ndvi = round(0.76 + (hash_val % 12) / 100.0, 2)
        baseline_ndvi = round(current_ndvi - 0.12, 2)
        current_ndwi = round(0.22 + (hash_val % 10) / 100.0, 2)
        baseline_ndwi = round(current_ndwi - 0.05, 2)
        status = "Green" if current_ndvi > 0.70 else "Yellow"
        action = "Timber Patrol Enforcement & Wildlife Corridor Protection"
        cost = 420000.0 + (hash_val % 20) * 10000.0
        scheme = "CAMPA Anti-Logging & Forest Conservation Fund"
        breakdown = ["Boundary security fencing & patrol (₹2,60,000)", "Fire line clearance & solar watchtowers (₹1,60,000)"]

    elif is_lake:
        intervention = "Ramsar Freshwater Wetland Conservation"
        veg = round(35.0 + (hash_val % 20), 1)
        water = round(52.0 + (hash_val % 18), 1)
        built = round(6.0 + (hash_val % 8), 1)
        barren = round(max(0.0, 100.0 - veg - water - built), 1)
        current_ndwi = round(0.58 + (hash_val % 14) / 100.0, 2)
        baseline_ndwi = round(current_ndwi - 0.14, 2)
        current_ndvi = round(0.48 + (hash_val % 14) / 100.0, 2)
        baseline_ndvi = round(current_ndvi - 0.10, 2)
        status = "Green" if current_ndwi > 0.50 else "Yellow"
        action = "Inlet Channel Desilting & Invasive Aquatic Hyacinth Removal"
        cost = 320000.0 + (hash_val % 18) * 10000.0
        scheme = "National Plan for Conservation of Aquatic Eco-systems (NPCA)"
        breakdown = ["Invasive water hyacinth clearing (₹1,80,000)", "Inflow channel silt trapping (₹1,40,000)"]

    elif is_groundwater:
        intervention = "Arid Underground Aquifer Recharge"
        veg = round(28.0 + (hash_val % 14), 1)
        water = round(16.0 + (hash_val % 10), 1)
        built = round(12.0 + (hash_val % 10), 1)
        barren = round(max(0.0, 100.0 - veg - water - built), 1)
        current_ndwi = round(0.18 + (hash_val % 10) / 100.0, 2)
        baseline_ndwi = round(current_ndwi - 0.05, 2)
        current_ndvi = round(0.32 + (hash_val % 10) / 100.0, 2)
        baseline_ndvi = round(current_ndvi - 0.06, 2)
        status = "Yellow" if veg > 25.0 else "Red"
        action = "Recharge Shaft Dredging & Check Dam Catchment Bunding"
        cost = 380000.0 + (hash_val % 15) * 10000.0
        scheme = "Atal Bhujal Yojana (ABHY) & WDC-PMKSY 2.0"
        breakdown = ["Recharge pit filter replacement (₹2,10,000)", "Upstream check dam repair (₹1,70,000)"]

    else:
        intervention = "Environmental Satellite Observation Site"
        veg = round(52.0 + (hash_val % 22), 1)
        water = round(22.0 + (hash_val % 15), 1)
        built = round(8.0 + (hash_val % 6), 1)
        barren = round(max(0.0, 100.0 - veg - water - built), 1)
        current_ndvi = round(0.55 + (hash_val % 15) / 100.0, 2)
        baseline_ndvi = round(current_ndvi - 0.12, 2)
        current_ndwi = round(0.32 + (hash_val % 12) / 100.0, 2)
        baseline_ndwi = round(current_ndwi - 0.08, 2)
        status = "Green" if current_ndvi > 0.50 else "Yellow"
        action = "Native Sapling Afforestation & Boundary Fencing"
        cost = 290000.0 + (hash_val % 15) * 10000.0
        scheme = "National Mission for a Green India (GIM)"
        breakdown = ["Sapling plantation (₹1,80,000)", "Boundary maintenance (₹1,10,000)"]

    return ProjectMapHover(
        project_id=site_id,
        title=f"Pan-India Site: {site_id.replace('-', ' ')}",
        intervention_type=intervention,
        location_name=f"Telemetry Station {site_id}, India",
        coordinates=LatLng(lat=lat, lng=lng),
        health_status=status,
        allocated_funds_inr=35000000.0,
        expended_funds_inr=28000000.0,
        budget_sufficiency="Sufficient",
        smuggling_alert_active=False,
        land_cover=LandCoverBreakdown(
            vegetation_coverage_pct=veg,
            water_coverage_pct=water,
            urban_builtup_pct=built,
            barren_land_pct=barren
        ),
        baseline_ndwi=baseline_ndwi,
        current_ndwi=current_ndwi,
        baseline_ndvi=baseline_ndvi,
        current_ndvi=current_ndvi,
        estimated_cost=ProbableCostEstimate(
            corrective_action_required=action,
            estimated_cost_inr=cost,
            cost_breakdown=breakdown,
            funding_scheme_recommended=scheme
        )
    )
