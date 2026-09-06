import { ProjectMapHover } from "./api";

export const createDynamicLocationSite = (
  placeName: string,
  lat: number,
  lng: number,
  fullName: string
): ProjectMapHover => {
  const nameLower = (placeName + " " + fullName).toLowerCase();
  const isDam =
    nameLower.includes("dam") ||
    nameLower.includes("reservoir") ||
    nameLower.includes("sagar") ||
    nameLower.includes("barrage") ||
    nameLower.includes("hydro") ||
    nameLower.includes("almatti") ||
    nameLower.includes("tehri") ||
    nameLower.includes("hirakud");

  const isForest =
    nameLower.includes("forest") ||
    nameLower.includes("reserve") ||
    nameLower.includes("national park") ||
    nameLower.includes("tiger") ||
    nameLower.includes("valley") ||
    nameLower.includes("coorg") ||
    nameLower.includes("wayanad") ||
    nameLower.includes("corbett") ||
    nameLower.includes("gir") ||
    nameLower.includes("sanctuary");

  const isSanctuary =
    nameLower.includes("sanctuary") ||
    nameLower.includes("wildlife") ||
    nameLower.includes("biome");

  const isLake =
    nameLower.includes("lake") ||
    nameLower.includes("wetland") ||
    nameLower.includes("ramsar") ||
    nameLower.includes("lagoon") ||
    nameLower.includes("pichola") ||
    nameLower.includes("dal") ||
    nameLower.includes("wular") ||
    nameLower.includes("chilika") ||
    nameLower.includes("loktak") ||
    nameLower.includes("tal");

  const isGroundwater =
    nameLower.includes("groundwater") ||
    nameLower.includes("aquifer") ||
    nameLower.includes("recharge") ||
    nameLower.includes("well") ||
    nameLower.includes("shaft") ||
    nameLower.includes("check dam");

  const seed = Math.abs(Math.sin(lat * 100) + Math.cos(lng * 100));

  let veg = 45;
  let water = 25;
  let built = 8;
  let currNdvi = 0.55;
  let baseNdvi = 0.45;
  let currNdwi = 0.35;
  let baseNdwi = 0.22;
  let type = "Ecological Catchment & Watershed Protection";
  let action = "Inflow Channel Desilting & Boundary Afforestation";
  let scheme = "National Mission for a Green India";
  let breakdown = ["Inlet desilting (₹1,80,000)", "Afforestation maintenance (₹1,20,000)"];

  if (isDam) {
    veg = Math.round(18 + ((seed * 15) % 15));
    water = Math.round(68 + ((seed * 18) % 18));
    built = Math.round(3 + ((seed * 5) % 5));
    currNdwi = Number((0.68 + ((seed * 0.14) % 0.14)).toFixed(2));
    baseNdwi = Number((currNdwi - 0.16).toFixed(2));
    currNdvi = Number((0.38 + ((seed * 0.12) % 0.12)).toFixed(2));
    baseNdvi = Number((currNdvi - 0.08).toFixed(2));
    type = "Hydro-Reservoir & Catchment Desilting";
    action = "Spillway Sediment Desilting & Catchment Rim Afforestation";
    scheme = "Dam Rehabilitation and Improvement Project (DRIP Phase II) & PMKSY";
    breakdown = [
      "Catchment rim slope afforestation (₹3,20,000)",
      "Inflow bathymetric dredging (₹2,30,000)",
    ];
  } else if (isForest || isSanctuary) {
    veg = Math.round(78 + ((seed * 14) % 14));
    water = Math.round(8 + ((seed * 10) % 10));
    built = Math.round(1 + ((seed * 4) % 4));
    currNdvi = Number((0.76 + ((seed * 0.12) % 0.12)).toFixed(2));
    baseNdvi = Number((currNdvi - 0.12).toFixed(2));
    currNdwi = Number((0.22 + ((seed * 0.10) % 0.10)).toFixed(2));
    baseNdwi = Number((currNdwi - 0.05).toFixed(2));
    type = "Dense Forest Canopy & Wildlife Corridor Watch";
    action = "Timber Patrol Enforcement & Wildlife Corridor Protection";
    scheme = "CAMPA Anti-Logging & Forest Conservation Fund";
    breakdown = [
      "Boundary security fencing & patrol (₹2,60,000)",
      "Fire line clearance & solar watchtowers (₹1,60,000)",
    ];
  } else if (isLake) {
    veg = Math.round(35 + ((seed * 20) % 20));
    water = Math.round(52 + ((seed * 18) % 18));
    built = Math.round(6 + ((seed * 8) % 8));
    currNdwi = Number((0.58 + ((seed * 0.14) % 0.14)).toFixed(2));
    baseNdwi = Number((currNdwi - 0.14).toFixed(2));
    currNdvi = Number((0.48 + ((seed * 0.14) % 0.14)).toFixed(2));
    baseNdvi = Number((currNdvi - 0.10).toFixed(2));
    type = "Ramsar Freshwater Wetland Conservation";
    action = "Inlet Channel Desilting & Invasive Aquatic Hyacinth Removal";
    scheme = "National Plan for Conservation of Aquatic Eco-systems (NPCA)";
    breakdown = [
      "Invasive water hyacinth clearing (₹1,80,000)",
      "Inflow channel silt trapping (₹1,40,000)",
    ];
  } else if (isGroundwater) {
    veg = Math.round(28 + ((seed * 14) % 14));
    water = Math.round(16 + ((seed * 10) % 10));
    built = Math.round(12 + ((seed * 10) % 10));
    currNdwi = Number((0.18 + ((seed * 0.10) % 0.10)).toFixed(2));
    baseNdwi = Number((currNdwi - 0.05).toFixed(2));
    currNdvi = Number((0.32 + ((seed * 0.10) % 0.10)).toFixed(2));
    baseNdvi = Number((currNdvi - 0.06).toFixed(2));
    type = "Arid Underground Aquifer Recharge";
    action = "Recharge Shaft Dredging & Check Dam Catchment Bunding";
    scheme = "Atal Bhujal Yojana (ABHY) & WDC-PMKSY 2.0";
    breakdown = [
      "Recharge pit filter replacement (₹2,10,000)",
      "Upstream check dam repair (₹1,70,000)",
    ];
  }

  const barren = Math.max(0, 100 - veg - water - built);
  const status: "Green" | "Yellow" | "Red" =
    isForest || isSanctuary
      ? veg > 75
        ? "Green"
        : veg < 50
        ? "Red"
        : "Yellow"
      : isDam || isLake
      ? water > 55
        ? "Green"
        : water < 30
        ? "Red"
        : "Yellow"
      : veg > 45
      ? "Green"
      : "Yellow";

  let probableCause = undefined;

  if (status === "Red") {
    probableCause = {
      primary_factor: isDam
        ? "Heavy Reservoir Siltation & Capital Fund Disbursement Delay"
        : isForest || isSanctuary
        ? "Nocturnal Timber Smuggling & Unenforced Boundary Patrols"
        : "Catchment Inflow Obstruction & Drought Rainfall Deficit",
      funds_cause: isDam
        ? "DRIP Phase II capital fund release pending state finance department sign-off"
        : "CAMPA emergency anti-logging fund disbursement delayed by 3 months",
      people_encroachment_cause: isDam
        ? "Agricultural land encroachment along 50m reservoir buffer zone"
        : "Nocturnal illegal timber smuggling networks operating in protected sector 3",
      resource_availability_cause: isDam
        ? "34% monsoon runoff deficit leading to accelerated sediment accumulation"
        : "Severe canopy moisture drop (NDMI 0.22) increasing forest fire & dieback risk",
      labour_execution_cause: isDam
        ? "Suction dredging machinery deployment delayed due to contractor procurement backlog"
        : "Patrol squad shortage (only 4 forest guards deployed across 42 sq km area)",
    };
  } else if (status === "Yellow") {
    probableCause = {
      primary_factor: isDam
        ? "Pre-Monsoon Inflow Siltation & Evaporative Loss"
        : "Peripheral Grazing Encroachment & Seasonal Canopy Stress",
      funds_cause: "Maintenance grant utilization at 68% — delayed invoicing for Q3 desilting",
      people_encroachment_cause: "Cattle grazing & seasonal crop planting extending into peripheral catchment",
      resource_availability_cause: "Moderate pre-monsoon water table drawdown & seasonal evaporation",
      labour_execution_cause: "Temporary manual labour availability deficit during agricultural harvest period",
    };
  }

  const cleanId = `IND-LOC-${(Math.abs(Math.round(lat * 100 + lng * 100)) % 900) + 100}`;
  const baseCost = Math.round((280000 + ((seed * 270000) % 350000)) / 10000) * 10000;

  return {
    project_id: cleanId,
    title: `${placeName} Catchment & Protection`,
    intervention_type: type,
    location_name: fullName || `${placeName}, India`,
    coordinates: { lat, lng },
    health_status: status,
    allocated_funds_inr: baseCost * 80,
    expended_funds_inr: baseCost * 65,
    budget_sufficiency: "Sufficient",
    smuggling_alert_active: status === "Red",
    land_cover: {
      vegetation_coverage_pct: veg,
      water_coverage_pct: water,
      urban_builtup_pct: built,
      barren_land_pct: barren,
    },
    baseline_ndwi: baseNdwi,
    current_ndwi: currNdwi,
    baseline_ndvi: baseNdvi,
    current_ndvi: currNdvi,
    estimated_cost: {
      corrective_action_required: action,
      estimated_cost_inr: baseCost,
      cost_breakdown: breakdown,
      funding_scheme_recommended: scheme,
    },
    probable_cause: probableCause,
  };
};
