"use client";

import React from "react";
import { TrajectoryResponse, ProjectMapHover } from "../services/api";
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

export default function TrajectoryChart({ 
  data, 
  projects = [], 
  selectedProjectId = "", 
  onSelectProject = () => {},
  onAddDynamicProject,
}: TrajectoryChartProps) {
  const selectedProj = projects.find((p) => p.project_id === selectedProjectId);

  const activeData: TrajectoryResponse = data || {
    project_id: selectedProjectId || "IND-KAR-DAM-01",
    intervention_type: selectedProj?.intervention_type || "Ecological Conservation",
    metric_name: "NDVI Canopy & Water Storage Recovery Target Curve",
    baseline_value: (selectedProj?.baseline_ndvi ?? 0.45) * 100,
    current_value: (selectedProj?.current_ndvi ?? 0.60) * 100,
    performance_status: selectedProj?.health_status === "Red" ? "Critical Lag (-12.4%)" : "On Track (+3.2%)",
    overall_variance_percentage: selectedProj?.health_status === "Red" ? -12.4 : 3.2,
    trajectory_points: [
      { month_label: "Baseline", timestamp: "2025-01-01", expected_recovery_value: 45.0, actual_observed_value: 45.0, deviation_delta: 0.0 },
      { month_label: "Month 2", timestamp: "2025-03-01", expected_recovery_value: 48.0, actual_observed_value: selectedProj?.health_status === "Red" ? 44.5 : 47.2, deviation_delta: selectedProj?.health_status === "Red" ? -3.5 : -0.8 },
      { month_label: "Month 4", timestamp: "2025-05-01", expected_recovery_value: 52.0, actual_observed_value: selectedProj?.health_status === "Red" ? 43.0 : 51.5, deviation_delta: selectedProj?.health_status === "Red" ? -9.0 : -0.5 },
      { month_label: "Month 7", timestamp: "2025-08-01", expected_recovery_value: 57.0, actual_observed_value: selectedProj?.health_status === "Red" ? 42.5 : 58.2, deviation_delta: selectedProj?.health_status === "Red" ? -14.5 : +1.2 },
      { month_label: "Month 10", timestamp: "2025-11-01", expected_recovery_value: 62.0, actual_observed_value: selectedProj?.health_status === "Red" ? 41.0 : 63.5, deviation_delta: selectedProj?.health_status === "Red" ? -21.0 : +1.5 },
      { month_label: "Month 12", timestamp: "2026-01-01", expected_recovery_value: 65.0, actual_observed_value: selectedProj?.health_status === "Red" ? 40.0 : 67.8, deviation_delta: selectedProj?.health_status === "Red" ? -25.0 : +2.8 },
    ],
  };

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
            )}</div>

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
            {data.trajectory_points.map((pt, idx) => {
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
      )}
    </div>
  );
}
