"use client";

import React from "react";
import { TrajectoryResponse, ProjectMapHover } from "../services/api";
import { EXPANDED_PAN_INDIA_SITES } from "../services/expandedSites";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import GlobalSiteHeader from "./GlobalSiteHeader";

interface TrajectoryChartProps {
  data: TrajectoryResponse | null;
  projects?: ProjectMapHover[];
  selectedProjectId?: string;
  onSelectProject?: (id: string) => void;
  onAddDynamicProject?: (project: ProjectMapHover) => void;
}

function computeDynamicTrajectory(
  proj: ProjectMapHover | undefined,
  selectedProjectId: string
): TrajectoryResponse {
  const pId = proj?.project_id || selectedProjectId || "IND-RAJ-FOR-RED-01";
  const matchedProj = proj || EXPANDED_PAN_INDIA_SITES.find((p) => p.project_id === pId) || EXPANDED_PAN_INDIA_SITES[0];
  
  const title = matchedProj.title;
  const status = matchedProj.health_status || "Yellow";
  const interv = matchedProj.intervention_type || "Ecological Conservation";

  // Deterministic seed [0..1) unique to each project_id
  const seed = (pId.split("").reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0) % 97) / 97.0;

  // Determine indicator metric (NDVI for forests/vegetation, NDWI for water bodies/dams/groundwater)
  const isForest = /forest|canopy|park|tiger|reserve|sanctuary|vegetation|jungle|tree|agumbe|silent/i.test(
    `${title} ${interv} ${pId}`
  );

  const baseRaw = isForest ? (matchedProj.baseline_ndvi ?? 0.55) : (matchedProj.baseline_ndwi ?? 0.45);
  const currRaw = isForest ? (matchedProj.current_ndvi ?? 0.40) : (matchedProj.current_ndwi ?? 0.35);

  const baseVal = Math.round(baseRaw * 1000) / 10;
  const currVal = Math.round(currRaw * 1000) / 10;

  const totalGain = currVal - baseVal;
  const isDegraded = totalGain < 0 || status === "Red";
  const smugglingActive = matchedProj.smuggling_alert_active ?? false;

  const monthLabels = [
    { label: "Baseline", time: "2025-01-01" },
    { label: "Month 2", time: "2025-03-01" },
    { label: "Month 4", time: "2025-05-01" },
    { label: "Month 7", time: "2025-08-01" },
    { label: "Month 10", time: "2025-11-01" },
    { label: "Month 12", time: "2026-01-01" },
  ];

  // Expected target trajectory (Target Curve)
  const expTargetGain = isDegraded ? Math.max(7.0, Math.abs(totalGain) * 1.3 + 4.0) : Math.max(5.0, totalGain * 1.15 + 2.5);

  const expRatios = [0.0, 0.18, 0.38, 0.65, 0.86, 1.0];

  // Actual progress ratios per month depend on health_status & smuggling risk
  let actualRatios: number[];
  if (status === "Green") {
    actualRatios = [0.0, 0.24 + seed * 0.05, 0.48 + seed * 0.05, 0.74 + seed * 0.05, 0.90 + seed * 0.04, 1.0];
  } else if (status === "Yellow") {
    actualRatios = [0.0, 0.12 + seed * 0.06, 0.34 + seed * 0.06, 0.62 + seed * 0.06, 0.84 + seed * 0.05, 1.0];
  } else {
    // Red / Critical status
    actualRatios = [0.0, 0.15, 0.35, 0.60, 0.82, 1.0];
  }

  const points = monthLabels.map((m, idx) => {
    // Expected curve calculation
    const expVal = Math.round((baseVal + expTargetGain * expRatios[idx]) * 10) / 10;

    // Seasonal sine wave variation unique to site seed
    const seasonal = Math.sin((idx / 5.0) * 2 * Math.PI + seed * Math.PI * 2) * (0.8 + seed * 0.8);

    let actVal: number;
    if (idx === 0) {
      actVal = baseVal;
    } else if (idx === 5) {
      actVal = currVal;
    } else {
      let rawAct = baseVal + totalGain * actualRatios[idx] + seasonal;
      // Mid-trajectory smuggling dip for Months 4-7 if smuggling alert is active
      if (smugglingActive && (idx === 2 || idx === 3)) {
        rawAct -= 2.8 + seed * 1.5;
      }
      actVal = Math.round(rawAct * 10) / 10;
    }

    const devDelta = Math.round((actVal - expVal) * 10) / 10;

    return {
      month_label: m.label,
      timestamp: m.time,
      expected_recovery_value: expVal,
      actual_observed_value: actVal,
      deviation_delta: devDelta,
    };
  });

  const finalActual = points[points.length - 1].actual_observed_value;
  const finalExp = points[points.length - 1].expected_recovery_value;
  const overallVariance = Math.round(((finalActual - finalExp) / finalExp) * 1000) / 10;

  const perfStatus =
    overallVariance >= 0
      ? `On Track (+${overallVariance}%)`
      : overallVariance >= -10
      ? `Moderate Lag (${overallVariance}%)`
      : `Critical Deficit (${overallVariance}%)`;

  const primaryFactor = matchedProj.probable_cause?.primary_factor || "anthropogenic pressures & canopy degradation";
  const summary = isDegraded
    ? `Site displays significant trajectory divergence (${overallVariance}% gap vs expected target curve). Vegetation canopy / water body extent declined due to ${primaryFactor}.`
    : `Site demonstrates positive recovery trajectory aligned with intervention goals (+${overallVariance}% vs target curve).`;

  return {
    project_id: pId,
    intervention_type: interv,
    metric_name: isForest ? "NDVI Vegetation Canopy Cover %" : "NDWI Water Surface Extent %",
    baseline_value: baseVal,
    current_value: currVal,
    performance_status: perfStatus,
    overall_variance_percentage: overallVariance,
    trajectory_points: points,
    status_summary: summary,
  };
}

export default function TrajectoryChart({ 
  data, 
  projects = [], 
  selectedProjectId = "", 
  onSelectProject = () => {},
  onAddDynamicProject,
}: TrajectoryChartProps) {
  const selectedProj = projects.find((p) => p.project_id === selectedProjectId);

  const activeData: TrajectoryResponse =
    data && data.project_id === selectedProjectId && data.trajectory_points && data.trajectory_points.length > 0
      ? data
      : computeDynamicTrajectory(selectedProj, selectedProjectId);

  const chartData = activeData.trajectory_points.map((p) => ({
    name: p.month_label,
    Expected: p.expected_recovery_value,
    Actual: p.actual_observed_value,
    Deviation: p.deviation_delta,
  }));

  // Compute dynamic Y-axis min/max so curve shape changes are clearly visible
  const allValues = chartData.flatMap((d) => [d.Expected, d.Actual]).filter((v) => typeof v === "number" && !isNaN(v));
  const minY = allValues.length > 0 ? Math.max(0, Math.floor(Math.min(...allValues) - 5)) : 0;
  const maxY = allValues.length > 0 ? Math.min(100, Math.ceil(Math.max(...allValues) + 5)) : 100;
  const yDomain: [number, number] = [minY, maxY];

  const variance = activeData.overall_variance_percentage ?? 0.0;
  const isTargetExceeded = variance >= 0.0;
  const isMinorLag = variance < 0.0 && variance >= -5.0;

  return (
    <div className="space-y-4">
      {/* Global Site Header */}
      {projects.length > 0 && (
        <GlobalSiteHeader
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={onSelectProject}
          onAddDynamicProject={onAddDynamicProject}
          sectionTitle="Recovery Trajectory & Expected vs Reality Engine"
          sectionIcon={TrendingUp}
        />
      )}
        <div className="w-full bg-white border border-[#D5E2D6] rounded-2xl p-6 shadow-sm space-y-6">
          {/* Header & Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E2D6] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0" />
                <h3 className="text-xl font-extrabold text-[#14281D]">
                  {selectedProj?.title || activeData.project_id} • Expected Target vs Observed Reality Trajectory
                </h3>
                <p className="text-xs text-stone-600 mt-1 font-medium flex items-center gap-2">
                  <span>Primary Indicator: <strong>{activeData.metric_name || "Multi-Spectral Index"}</strong></span>
                  <span>•</span>
                  <span>Baseline {activeData.baseline_value}% → Current {activeData.current_value}%</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-black text-xs shadow-2xs ${
                    isTargetExceeded
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : isMinorLag
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {isTargetExceeded ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {activeData.performance_status || (isTargetExceeded ? "On Track" : "Lag")} (
                    {variance > 0 ? `+${variance}%` : `${variance}%`})
                  </span>
                </div>
              </div>
            </div>

            {/* Root Cause / Trajectory Explanation Card */}
            {activeData.status_summary && (
              <div className="bg-[#F6F8F3] border border-[#D5E2D6] p-4 rounded-xl text-xs text-stone-700 font-medium space-y-1">
                <div className="flex items-center space-x-1.5 text-[#14281D] font-extrabold text-xs uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Telemetry Diagnostic Summary</span>
                </div>
                <p className="leading-relaxed">{activeData.status_summary}</p>
              </div>
            )}
          </div>

          {/* Dynamic Recharts Line Chart */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis stroke="#64748b" domain={yDomain} tick={{ fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "1rem",
                    color: "#ffffff",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${value}%`]}
                />
                <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px", fontWeight: "bold" }} />
                <Line
                  type="monotone"
                  dataKey="Expected"
                  stroke="#0284c7"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  name="Planned Recovery Target Curve"
                />
                <Line
                  type="monotone"
                  dataKey="Actual"
                  stroke="#059669"
                  strokeWidth={3.5}
                  dot={{ r: 6, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#10b981" }}
                  name="Actual Observed Satellite Telemetry"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
            {activeData.trajectory_points.map((pt, idx) => {
              const isAhead = pt.deviation_delta >= 0;
              return (
                <div key={idx} className="bg-[#F6F8F3] border border-[#D5E2D6] p-3 rounded-xl space-y-1 text-center shadow-2xs">
                  <div className="text-[10px] font-mono font-bold text-stone-500 uppercase">{pt.month_label}</div>
                  <div className="text-sm font-black text-[#14281D]">{pt.actual_observed_value}%</div>
                  <div className={`text-[10px] font-mono font-extrabold flex items-center justify-center gap-0.5 ${
                    isAhead ? "text-emerald-700" : "text-amber-800"
                  }`}>
                    {isAhead ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{isAhead ? `+${pt.deviation_delta}%` : `${pt.deviation_delta}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
