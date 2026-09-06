"use client";

import React from "react";
import { TrajectoryResponse, ProjectMapHover } from "../services/api";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, Layers, Activity } from "lucide-react";
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

  const chartData = data?.trajectory_points.map((p) => ({
    name: p.month_label,
    Expected: p.expected_recovery_value,
    Actual: p.actual_observed_value,
    Deviation: p.deviation_delta,
  })) || [];

  // Compute dynamic Y-axis min/max so curve shape changes are clearly visible
  const allValues = chartData.flatMap((d) => [d.Expected, d.Actual]).filter((v) => typeof v === "number" && !isNaN(v));
  const minY = allValues.length > 0 ? Math.max(0, Math.floor(Math.min(...allValues) - 5)) : 0;
  const maxY = allValues.length > 0 ? Math.min(100, Math.ceil(Math.max(...allValues) + 5)) : 100;
  const yDomain: [number, number] = [minY, maxY];

  const variance = data?.overall_variance_percentage ?? 0.0;
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

      {!data ? (
        <div className="w-full h-72 bg-[#F6F8F3] animate-pulse rounded-2xl flex items-center justify-center text-stone-500 border border-[#D5E2D6]">
          Loading Expected vs Reality Trajectory Engine...
        </div>
      ) : (
        <div className="w-full bg-white border border-[#D5E2D6] rounded-2xl p-6 shadow-sm space-y-6">
          {/* Header & Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E2D6] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0" />
                <h3 className="text-xl font-extrabold text-[#14281D]">
                  {selectedProj?.title || data.project_id} • Expected Target vs Observed Reality Trajectory
                </h3>
              </div>
              <p className="text-xs text-stone-600 mt-1 font-medium flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Primary Indicator: <strong>{data.metric_name || "Multi-Spectral Index"}</strong></span>
                <span>•</span>
                <span>Baseline {data.baseline_value}% → Current {data.current_value}%</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span
                className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-1.5 font-bold shadow-2xs ${
                  isTargetExceeded
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : isMinorLag
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-rose-100 text-rose-900 border-rose-300"
                }`}
              >
                {isTargetExceeded ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                )}
                <span>
                  {data.performance_status || (isTargetExceeded ? "On Track" : "Lag")} (
                  {variance >= 0 ? `+${variance}%` : `${variance}%`})
                </span>
              </span>
            </div>
          </div>

          {/* Telemetry Summary Description Banner */}
          <div className="bg-[#F6F8F3] border border-[#D5E2D6] p-3.5 rounded-xl text-xs text-stone-700 font-medium flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{data.status_summary}</p>
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
