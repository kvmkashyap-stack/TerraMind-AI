import { ProjectMapHover } from "./api";

export const EXPANDED_PAN_INDIA_SITES: ProjectMapHover[] = [
  // 💧 DAMS & RESERVOIRS (NEW & EXPANDED)
  {
    project_id: "IND-KAR-DAM-01",
    title: "Almatti Dam & Lal Bahadur Shastri Reservoir",
    intervention_type: "Reservoir Catchment & Desilting",
    location_name: "Almatti, Vijayapura, Karnataka",
    coordinates: { lat: 16.3314, lng: 75.8872 },
    health_status: "Green",
    allocated_funds_inr: 85000000.0,
    expended_funds_inr: 72000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 48.0,
      water_coverage_pct: 74.0,
      urban_builtup_pct: 5.0,
      barren_land_pct: 12.0
    },
    baseline_ndwi: 0.52,
    current_ndwi: 0.74,
    baseline_ndvi: 0.38,
    current_ndvi: 0.52,
    estimated_cost: {
      corrective_action_required: "Krishna Basin Inflow Channel Desilting & Silt Trap Maintenance",
      estimated_cost_inr: 540000.0,
      cost_breakdown: [
        "Inlet silt trap dredging (₹3,20,000)",
        "Reservoir rim afforestation (₹2,20,000)"
      ],
      funding_scheme_recommended: "Pradhan Mantri Krishi Sinchayee Yojana (WDC-PMKSY 2.0)"
    }
  },
  {
    project_id: "IND-ODI-DAM-01",
    title: "Hirakud Dam & Mahanadi Reservoir Catchment",
    intervention_type: "Reservoir Catchment Protection",
    location_name: "Sambalpur, Odisha",
    coordinates: { lat: 21.5700, lng: 83.8700 },
    health_status: "Green",
    allocated_funds_inr: 92000000.0,
    expended_funds_inr: 84000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 54.0,
      water_coverage_pct: 78.0,
      urban_builtup_pct: 4.0,
      barren_land_pct: 10.0
    },
    baseline_ndwi: 0.58,
    current_ndwi: 0.78,
    baseline_ndvi: 0.42,
    current_ndvi: 0.56,
    estimated_cost: {
      corrective_action_required: "Mahanadi Silt Trap Clearance & Shoreline Afforestation",
      estimated_cost_inr: 620000.0,
      cost_breakdown: [
        "Sediment basin clearance (₹3,80,000)",
        "Catchment tree plantation (₹2,40,000)"
      ],
      funding_scheme_recommended: "National Hydrology Project (NHP)"
    }
  },
  {
    project_id: "IND-UTT-DAM-01",
    title: "Tehri Dam & Bhagirathi Hydro Catchment",
    intervention_type: "High-Altitude Reservoir Protection",
    location_name: "Tehri Garhwal, Uttarakhand",
    coordinates: { lat: 30.3786, lng: 78.4803 },
    health_status: "Yellow",
    allocated_funds_inr: 78000000.0,
    expended_funds_inr: 61000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 62.0,
      water_coverage_pct: 68.0,
      urban_builtup_pct: 3.0,
      barren_land_pct: 15.0
    },
    baseline_ndwi: 0.52,
    current_ndwi: 0.68,
    baseline_ndvi: 0.50,
    current_ndvi: 0.62,
    estimated_cost: {
      corrective_action_required: "Slope Stabilization & Landslide Runoff Silt Trap",
      estimated_cost_inr: 580000.0,
      cost_breakdown: [
        "Slope terracing & geotextiles (₹3,50,000)",
        "De-silt basin dredging (₹2,30,000)"
      ],
      funding_scheme_recommended: "National Mission for Sustaining the Himalayan Ecosystem"
    }
  },
  {
    project_id: "IND-KER-DAM-01",
    title: "Idukki Arch Dam & Periyar Catchment",
    intervention_type: "Reservoir & Canopy Protection",
    location_name: "Idukki, Kerala",
    coordinates: { lat: 9.8450, lng: 76.9750 },
    health_status: "Green",
    allocated_funds_inr: 68000000.0,
    expended_funds_inr: 62000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 82.0,
      water_coverage_pct: 65.0,
      urban_builtup_pct: 2.0,
      barren_land_pct: 5.0
    },
    baseline_ndwi: 0.50,
    current_ndwi: 0.65,
    baseline_ndvi: 0.72,
    current_ndvi: 0.82,
    estimated_cost: {
      corrective_action_required: "Catchment Evergreen Forest Buffer & Runoff Control",
      estimated_cost_inr: 390000.0,
      cost_breakdown: [
        "Forest buffer fencing (₹2,20,000)",
        "Inflow silt trap clearance (₹1,70,000)"
      ],
      funding_scheme_recommended: "CAMPA Biodiversity Fund"
    }
  },
  {
    project_id: "IND-MAH-DAM-01",
    title: "Koyna Dam Hydroelectric Reservoir",
    intervention_type: "Reservoir Catchment Desilting",
    location_name: "Satara, Maharashtra",
    coordinates: { lat: 17.4000, lng: 73.7500 },
    health_status: "Green",
    allocated_funds_inr: 72000000.0,
    expended_funds_inr: 65000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 70.0,
      water_coverage_pct: 72.0,
      urban_builtup_pct: 3.0,
      barren_land_pct: 8.0
    },
    baseline_ndwi: 0.54,
    current_ndwi: 0.72,
    baseline_ndvi: 0.58,
    current_ndvi: 0.70,
    estimated_cost: {
      corrective_action_required: "Western Ghats Rim Afforestation & Dredging",
      estimated_cost_inr: 450000.0,
      cost_breakdown: [
        "Inlet desilting (₹2,70,000)",
        "Afforestation belt maintenance (₹1,80,000)"
      ],
      funding_scheme_recommended: "National Hydrology Project"
    }
  },
  {
    project_id: "IND-KAR-DAM-02",
    title: "Tungabhadra Dam & Basin Catchment",
    intervention_type: "Reservoir Siltation Control",
    location_name: "Hospet, Ballari, Karnataka",
    coordinates: { lat: 15.2600, lng: 76.3400 },
    health_status: "Yellow",
    allocated_funds_inr: 65000000.0,
    expended_funds_inr: 52000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 40.0,
      water_coverage_pct: 62.0,
      urban_builtup_pct: 8.0,
      barren_land_pct: 22.0
    },
    baseline_ndwi: 0.45,
    current_ndwi: 0.62,
    baseline_ndvi: 0.32,
    current_ndvi: 0.40,
    estimated_cost: {
      corrective_action_required: "Major Siltation Dredging & Upstream Check Dam Repairs",
      estimated_cost_inr: 680000.0,
      cost_breakdown: [
        "Heavy silt dredging (₹4,20,000)",
        "Upstream check dam repair (₹2,60,000)"
      ],
      funding_scheme_recommended: "WDC-PMKSY 2.0 & AMRUT Grant"
    }
  },
  {
    project_id: "IND-TN-DAM-01",
    title: "Mettur Dam Stanley Reservoir",
    intervention_type: "Reservoir Catchment Protection",
    location_name: "Salem, Tamil Nadu",
    coordinates: { lat: 11.8000, lng: 77.8000 },
    health_status: "Green",
    allocated_funds_inr: 58000000.0,
    expended_funds_inr: 51000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 46.0,
      water_coverage_pct: 66.0,
      urban_builtup_pct: 6.0,
      barren_land_pct: 18.0
    },
    baseline_ndwi: 0.48,
    current_ndwi: 0.66,
    baseline_ndvi: 0.38,
    current_ndvi: 0.46,
    estimated_cost: {
      corrective_action_required: "Kaveri Basin Inlet Silt Clearing & Tree Belts",
      estimated_cost_inr: 420000.0,
      cost_breakdown: [
        "Inlet desilting (₹2,50,000)",
        "Riparian afforestation (₹1,70,000)"
      ],
      funding_scheme_recommended: "Jal Shakti Abhiyan"
    }
  },

  // 🌊 LAKES & WETLANDS (EXPANDED)
  {
    project_id: "IND-RAJ-LAKE-01",
    title: "Lake Pichola & Fateh Sagar Watershed",
    intervention_type: "Heritage Urban Lake Rejuvenation",
    location_name: "Udaipur, Rajasthan",
    coordinates: { lat: 24.5714, lng: 73.6744 },
    health_status: "Green",
    allocated_funds_inr: 32000000.0,
    expended_funds_inr: 28000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 45.0,
      water_coverage_pct: 62.0,
      urban_builtup_pct: 18.0,
      barren_land_pct: 10.0
    },
    baseline_ndwi: 0.42,
    current_ndwi: 0.62,
    baseline_ndvi: 0.35,
    current_ndvi: 0.45,
    estimated_cost: {
      corrective_action_required: "Sewerage Interception & Weed Removal",
      estimated_cost_inr: 310000.0,
      cost_breakdown: [
        "Floating weed clearing (₹1,80,000)",
        "Inflow filter traps (₹1,30,000)"
      ],
      funding_scheme_recommended: "AMRUT 2.0 Water Body Rejuvenation"
    }
  },
  {
    project_id: "IND-JK-LAKE-01",
    title: "Dal Lake Wetland Catchment & Char Chinar",
    intervention_type: "High-Altitude Lake Protection",
    location_name: "Srinagar, Jammu & Kashmir",
    coordinates: { lat: 34.1120, lng: 74.8690 },
    health_status: "Yellow",
    allocated_funds_inr: 45000000.0,
    expended_funds_inr: 36000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 58.0,
      water_coverage_pct: 65.0,
      urban_builtup_pct: 12.0,
      barren_land_pct: 10.0
    },
    baseline_ndwi: 0.48,
    current_ndwi: 0.65,
    baseline_ndvi: 0.46,
    current_ndvi: 0.58,
    estimated_cost: {
      corrective_action_required: "De-Weeding Harvester Operation & Sewage Trap",
      estimated_cost_inr: 490000.0,
      cost_breakdown: [
        "Mechanical weed harvesting (₹3,00,000)",
        "Peripheral silt trapping (₹1,90,000)"
      ],
      funding_scheme_recommended: "Prime Minister's Development Package for J&K"
    }
  },
  {
    project_id: "IND-MP-LAKE-01",
    title: "Bhojtal Upper Lake Ramsar Wetland",
    intervention_type: "Ramsar Freshwater Wetland",
    location_name: "Bhopal, Madhya Pradesh",
    coordinates: { lat: 23.2500, lng: 77.3500 },
    health_status: "Green",
    allocated_funds_inr: 40000000.0,
    expended_funds_inr: 35000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 56.0,
      water_coverage_pct: 64.0,
      urban_builtup_pct: 12.0,
      barren_land_pct: 8.0
    },
    baseline_ndwi: 0.46,
    current_ndwi: 0.64,
    baseline_ndvi: 0.44,
    current_ndvi: 0.56,
    estimated_cost: {
      corrective_action_required: "Catchment Plantation & Buffer Zone Demarcation",
      estimated_cost_inr: 340000.0,
      cost_breakdown: [
        "Catchment afforestation (₹2,00,000)",
        "Silt basin maintenance (₹1,40,000)"
      ],
      funding_scheme_recommended: "National Plan for Conservation of Aquatic Ecosystems"
    }
  },
  {
    project_id: "IND-TEL-LAKE-01",
    title: "Hussain Sagar Wetland & Catchment",
    intervention_type: "Urban Wetland Protection",
    location_name: "Hyderabad, Telangana",
    coordinates: { lat: 17.4239, lng: 78.4738 },
    health_status: "Yellow",
    allocated_funds_inr: 35000000.0,
    expended_funds_inr: 28000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 35.0,
      water_coverage_pct: 58.0,
      urban_builtup_pct: 22.0,
      barren_land_pct: 5.0
    },
    baseline_ndwi: 0.40,
    current_ndwi: 0.58,
    baseline_ndvi: 0.28,
    current_ndvi: 0.35,
    estimated_cost: {
      corrective_action_required: "Nala Diversion & Aeration Dredging",
      estimated_cost_inr: 420000.0,
      cost_breakdown: [
        "Floating aerator installation (₹2,50,000)",
        "Inflow diversion maintenance (₹1,70,000)"
      ],
      funding_scheme_recommended: "AMRUT 2.0 Urban Wetland Mission"
    }
  },

  // 🌲 FORESTS & WILDLIFE SANCTUARIES (EXPANDED)
  {
    project_id: "IND-KER-FOR-01",
    title: "Wayanad Wildlife Sanctuary & Forest Canopy",
    intervention_type: "Elephant Corridor & Forest Protection",
    location_name: "Wayanad, Kerala",
    coordinates: { lat: 11.6854, lng: 76.1320 },
    health_status: "Green",
    allocated_funds_inr: 48000000.0,
    expended_funds_inr: 42000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 86.0,
      water_coverage_pct: 10.0,
      urban_builtup_pct: 2.0,
      barren_land_pct: 2.0
    },
    baseline_ndwi: 0.22,
    current_ndwi: 0.28,
    baseline_ndvi: 0.74,
    current_ndvi: 0.86,
    estimated_cost: {
      corrective_action_required: "Human-Wildlife Conflict Solar Fencing & Fire Line Clearing",
      estimated_cost_inr: 370000.0,
      cost_breakdown: [
        "Solar perimeter fencing (₹2,30,000)",
        "Fire line maintenance (₹1,40,000)"
      ],
      funding_scheme_recommended: "Project Elephant & CAMPA Fund"
    }
  },
  {
    project_id: "IND-KER-FOR-02",
    title: "Silent Valley National Park Evergreen Canopy",
    intervention_type: "Primary Rainforest Protection",
    location_name: "Palakkad, Kerala",
    coordinates: { lat: 11.0800, lng: 76.4500 },
    health_status: "Green",
    allocated_funds_inr: 52000000.0,
    expended_funds_inr: 47000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 92.0,
      water_coverage_pct: 6.0,
      urban_builtup_pct: 1.0,
      barren_land_pct: 1.0
    },
    baseline_ndwi: 0.20,
    current_ndwi: 0.24,
    baseline_ndvi: 0.80,
    current_ndvi: 0.92,
    estimated_cost: {
      corrective_action_required: "Strict Core Zone Watchtower Patrol & Biodiversity Monitoring",
      estimated_cost_inr: 320000.0,
      cost_breakdown: [
        "Anti-poaching patrol equipment (₹2,00,000)",
        "Canopy thermal sensor network (₹1,20,000)"
      ],
      funding_scheme_recommended: "National Afforestation Programme"
    }
  },
  {
    project_id: "IND-RAJ-FOR-01",
    title: "Ranthambore Tiger Reserve & Aravalli Buffer",
    intervention_type: "Dry Deciduous Tiger Habitat",
    location_name: "Sawai Madhopur, Rajasthan",
    coordinates: { lat: 26.0173, lng: 76.5026 },
    health_status: "Green",
    allocated_funds_inr: 46000000.0,
    expended_funds_inr: 39000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 64.0,
      water_coverage_pct: 12.0,
      urban_builtup_pct: 3.0,
      barren_land_pct: 21.0
    },
    baseline_ndwi: 0.16,
    current_ndwi: 0.22,
    baseline_ndvi: 0.52,
    current_ndvi: 0.64,
    estimated_cost: {
      corrective_action_required: "Water Hole Solar Pump Maintenance & Anti-Encroachment Wall",
      estimated_cost_inr: 410000.0,
      cost_breakdown: [
        "Solar pump waterhole desilting (₹2,50,000)",
        "Boundary parapet walling (₹1,60,000)"
      ],
      funding_scheme_recommended: "Project Tiger Authority"
    }
  },
  {
    project_id: "IND-TN-FOR-01",
    title: "Mudumalai Tiger Reserve & Nilgiri Biosphere",
    intervention_type: "Biosphere Corridor Protection",
    location_name: "Nilgiris, Tamil Nadu",
    coordinates: { lat: 11.5620, lng: 76.5340 },
    health_status: "Green",
    allocated_funds_inr: 50000000.0,
    expended_funds_inr: 44000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 85.0,
      water_coverage_pct: 8.0,
      urban_builtup_pct: 2.0,
      barren_land_pct: 5.0
    },
    baseline_ndwi: 0.18,
    current_ndwi: 0.24,
    baseline_ndvi: 0.72,
    current_ndvi: 0.85,
    estimated_cost: {
      corrective_action_required: "Invasive Lantana Camara Clearing & Corridor Protection",
      estimated_cost_inr: 360000.0,
      cost_breakdown: [
        "Weed clearing (₹2,20,000)",
        "Corridor solar fencing (₹1,40,000)"
      ],
      funding_scheme_recommended: "CAMPA Biosphere Fund"
    }
  },
  {
    project_id: "IND-KAR-FOR-04",
    title: "Coorg / Kodagu Western Ghats Watershed Canopy",
    intervention_type: "Rainforest Watershed Protection",
    location_name: "Madikeri, Kodagu, Karnataka",
    coordinates: { lat: 12.4244, lng: 75.7382 },
    health_status: "Green",
    allocated_funds_inr: 44000000.0,
    expended_funds_inr: 38000000.0,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: false,
    land_cover: {
      vegetation_coverage_pct: 88.0,
      water_coverage_pct: 7.0,
      urban_builtup_pct: 3.0,
      barren_land_pct: 2.0
    },
    baseline_ndwi: 0.20,
    current_ndwi: 0.26,
    baseline_ndvi: 0.75,
    current_ndvi: 0.88,
    estimated_cost: {
      corrective_action_required: "Shade Tree Plantation & Stream Bank Bio-Engineering",
      estimated_cost_inr: 330000.0,
      cost_breakdown: [
        "Native tree nursery (₹2,00,000)",
        "Stream bank revetment (₹1,30,000)"
      ],
      funding_scheme_recommended: "Green India Mission"
    }
  }
];
