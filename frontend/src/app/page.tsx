"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MapView from "../components/MapView";
import TrajectoryChart from "../components/TrajectoryChart";
import SatelliteRepositoryView from "../components/SatelliteRepositoryView";
import CopilotChatDrawer from "../components/CopilotChatDrawer";
import ProjectsPortfolioView from "../components/ProjectsPortfolioView";
import {
  fetchMapProjects,
  fetchBaselineComparison,
  fetchSatelliteRepository,
  fetchImpactScore,
  fetchTrajectory,
  ProjectMapHover,
  BaselineComparisonReport,
  SatelliteDataRepository,
  ImpactScoreBreakdown,
  TrajectoryResponse,
} from "../services/api";
import {
  Satellite,
  Compass,
  CircleCheck,
  Layers,
  Eye,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Landmark,
  ShieldAlert,
  Bot,
  Database,
  Award,
  ArrowRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { EXPANDED_PAN_INDIA_SITES } from "../services/expandedSites";

export default function LandingPage() {
  const [projects, setProjects] = useState<ProjectMapHover[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("IND-KAR-02");
  
  // Full-Screen Dashboard Toggle State
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  
  // Left Sidebar Feature Selector
  const [activeFeature, setActiveFeature] = useState<"map" | "projects" | "data" | "trajectory" | "copilot">("map");

  const [baselineData, setBaselineData] = useState<BaselineComparisonReport | null>(null);
  const [satelliteRepo, setSatelliteRepo] = useState<SatelliteDataRepository | null>(null);
  const [scoreData, setScoreData] = useState<ImpactScoreBreakdown | null>(null);
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryResponse | null>(null);

  useEffect(() => {
    fetchMapProjects()
      .then((res) => {
        const merged = [
          ...res,
          ...EXPANDED_PAN_INDIA_SITES.filter((es) => !res.some((p) => p.project_id === es.project_id)),
        ];
        setProjects(merged);
        if (merged.length > 0) {
          setSelectedProjectId(merged[0].project_id);
        }
      })
      .catch((err) => {
        console.error("Fetch map projects error:", err);
        setProjects(EXPANDED_PAN_INDIA_SITES);
      });
  }, []);

  const handleAddDynamicProject = (dynamicProj: ProjectMapHover) => {
    setProjects((prev) => {
      if (prev.some((p) => p.project_id === dynamicProj.project_id)) return prev;
      return [dynamicProj, ...prev];
    });
    setSelectedProjectId(dynamicProj.project_id);
  };

  useEffect(() => {
    if (!selectedProjectId) return;
    Promise.all([
      fetchBaselineComparison(selectedProjectId).catch(() => null),
      fetchSatelliteRepository(selectedProjectId).catch(() => null),
      fetchImpactScore(selectedProjectId).catch(() => null),
      fetchTrajectory(selectedProjectId).catch(() => null),
    ])
      .then(([baseline, satRepo, score, traj]) => {
        setBaselineData(baseline);
        setSatelliteRepo(satRepo);
        setScoreData(score);
        setTrajectoryData(traj);
      })
      .catch(console.error);
  }, [selectedProjectId]);

  const currentProject = projects.find((p) => p.project_id === selectedProjectId) || projects[0];

  const handlePrevProject = () => {
    if (projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.project_id === selectedProjectId);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProjectId(projects[prevIndex].project_id);
  };

  const handleNextProject = () => {
    if (projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.project_id === selectedProjectId);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProjectId(projects[nextIndex].project_id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDashboardOpen) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrevProject();
      } else if (e.key === "ArrowRight") {
        handleNextProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDashboardOpen, selectedProjectId, projects]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#14281D] selection:bg-[#B7E4C7]">
      <Header />

      {/* FULL-SCREEN LIGHT MODE DASHBOARD PLATFORM (Opened via Get Started Button) */}
      {isDashboardOpen && (
        <div className="fixed inset-0 z-50 bg-[#FBFBF8] flex flex-col transition-all duration-300 w-screen h-screen overflow-hidden">
          {/* FULL-SCREEN DASHBOARD CANVAS: Pushed All The Way To The Top Edge */}
          <div className="flex-1 w-full p-2 grid grid-cols-1 lg:grid-cols-12 gap-2.5 min-h-0 overflow-y-auto lg:overflow-hidden">
            {/* COMPACT LEFT SIDEBAR FEATURE NAVIGATION DRAWER */}
            <div className="lg:col-span-2 bg-white border border-[#D5E2D6] p-2.5 rounded-2xl shadow-2xs space-y-2.5 flex flex-col justify-between overflow-y-auto h-full">
              <div className="space-y-2.5">
                {/* Brand Logo (Click to Return Home) & Exit Button */}
                <div 
                  onClick={() => {
                    setIsDashboardOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center justify-between pb-2 border-b border-stone-200 cursor-pointer group hover:opacity-90 transition-all"
                  title="Click logo to return to Homepage"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="h-8 w-8 rounded-xl overflow-hidden border border-[#D5E2D6] shrink-0 bg-white flex items-center justify-center p-0.5 shadow-2xs group-hover:shadow-xs">
                      <img src="/logo.jpg" alt="Logo" className="h-full w-full object-contain rounded-lg" />
                    </div>
                    <span className="text-xs font-black tracking-tight text-[#14281D] group-hover:text-indigo-600 transition-colors truncate">
                      Home
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDashboardOpen(false);
                    }}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors shrink-0"
                    title="Close Dashboard"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1 text-xs font-bold">
                  <button
                    onClick={() => setActiveFeature("map")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                      activeFeature === "map"
                        ? "bg-[#0F172A] text-sky-300 shadow-sm font-extrabold border border-indigo-500/30"
                        : "bg-[#F6F8F3] text-stone-700 hover:bg-[#E8F3E9] border border-[#D5E2D6]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Impact Map</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>

                  <button
                    onClick={() => setActiveFeature("projects")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                      activeFeature === "projects"
                        ? "bg-[#0F172A] text-sky-300 shadow-sm font-extrabold border border-indigo-500/30"
                        : "bg-[#F6F8F3] text-stone-700 hover:bg-[#E8F3E9] border border-[#D5E2D6]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Projects</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>

                  <button
                    onClick={() => setActiveFeature("data")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                      activeFeature === "data"
                        ? "bg-[#0F172A] text-sky-300 shadow-sm font-extrabold border border-indigo-500/30"
                        : "bg-[#F6F8F3] text-stone-700 hover:bg-[#E8F3E9] border border-[#D5E2D6]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Database className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Satellite Data</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>



                  <button
                    onClick={() => setActiveFeature("trajectory")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                      activeFeature === "trajectory"
                        ? "bg-[#0F172A] text-sky-300 shadow-sm font-extrabold border border-indigo-500/30"
                        : "bg-[#F6F8F3] text-stone-700 hover:bg-[#E8F3E9] border border-[#D5E2D6]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Trajectory</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>

                  <button
                    onClick={() => setActiveFeature("copilot")}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
                      activeFeature === "copilot"
                        ? "bg-[#0F172A] text-sky-300 shadow-sm font-extrabold border border-indigo-500/30"
                        : "bg-[#F6F8F3] text-stone-700 hover:bg-[#E8F3E9] border border-[#D5E2D6]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Bot className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">AI Copilot</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                </nav>
              </div>

              {/* Impact Score Summary Pill */}
              {scoreData && (
                <div className="pt-2 border-t border-stone-200 bg-[#F6F8F3] p-2 rounded-xl text-xs space-y-0.5">
                  <div className="text-stone-600 flex items-center justify-between font-mono text-[10px]">
                    <span>Score:</span>
                    <Award className="w-3 h-3 text-emerald-700" />
                  </div>
                  <div className="text-base font-black text-[#14281D]">
                    {scoreData.overall_impact_score} <span className="text-[10px] text-stone-500 font-normal">/ 100</span>
                  </div>
                </div>
              )}
            </div>

            {/* EXPANDED RIGHT FEATURE DISPLAY CANVAS (Takes 10/12 columns) */}
            <div className="lg:col-span-10 flex flex-col h-full overflow-y-auto space-y-3 pb-2">
              {activeFeature === "map" && (
                <MapView
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onAddDynamicProject={handleAddDynamicProject}
                />
              )}

              {activeFeature === "projects" && (
                <ProjectsPortfolioView
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onAddDynamicProject={handleAddDynamicProject}
                />
              )}

              {activeFeature === "data" && (
                <SatelliteRepositoryView
                  data={satelliteRepo}
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onAddDynamicProject={handleAddDynamicProject}
                />
              )}

              {activeFeature === "trajectory" && (
                <TrajectoryChart
                  data={trajectoryData}
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onAddDynamicProject={handleAddDynamicProject}
                />
              )}

              {activeFeature === "copilot" && (
                <CopilotChatDrawer
                  projectId={selectedProjectId}
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onAddDynamicProject={handleAddDynamicProject}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: HOME (Hero) */}
      <section id="hero" className="relative min-h-[75vh] flex flex-col justify-center pt-16 pb-8 overflow-hidden bg-[#FBFBF8]">
        <div className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=80')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBF8]/92 via-[#F6F8F3]/85 to-[#FBFBF8] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 space-y-6 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#14281D] leading-[1.12]">
                See the impact. <br />
                Understand the change. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14281D] via-[#1E3A2B] to-[#2A6F97]">
                  Act before recovery stalls.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-700 font-normal leading-relaxed max-w-2xl">
                Satellite observations and explainable environmental intelligence to monitor conservation interventions over time, identify trajectory gaps, and verify durable ecological recovery across India.
              </p>

              {/* GET STARTED BUTTON (Opens Full Screen Dashboard) */}
              <div className="pt-2">
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#14281D] hover:bg-[#1E3A2B] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] group border border-emerald-600/30 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-stone-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <CircleCheck className="h-4 w-4 text-emerald-700" />
                  <span>Pre-Intervention Baselines</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CircleCheck className="h-4 w-4 text-emerald-700" />
                  <span>Explainable Risk Predictor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CircleCheck className="h-4 w-4 text-emerald-700" />
                  <span>Timber Smuggling Alert</span>
                </div>
              </div>
            </div>

            {/* Right Column: Compact Live Satellite Map Box (Takes up minimal space) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-[#D5E2D6] p-4 shadow-xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs text-stone-600 font-bold">
                  <div className="flex items-center gap-2 text-[#14281D]">
                    <Satellite className="h-4 w-4 text-emerald-700" />
                    <span>LIVE SATELLITE MAP</span>
                  </div>
                  <span className="text-emerald-800 bg-[#E8F3E9] px-2 py-0.5 rounded-full border border-[#C2DEC6] text-[10px]">
                    PAN-INDIA
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl">
                  <MapView
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    onSelectProject={(id) => setSelectedProjectId(id)}
                    onAddDynamicProject={(newProj) => {
                      setProjects((prev) => [newProj, ...prev.filter((p) => p.project_id !== newProj.project_id)]);
                      setSelectedProjectId(newProj.project_id);
                    }}
                    compact={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="py-20 bg-white border-t border-b border-[#D5E2D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono bg-[#E8F3E9] text-[#14281D] border border-[#C2DEC6]">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
              What We Are Providing
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              A continuous, satellite-driven decision engine designed for complete environmental monitoring, risk prediction, and closed-loop impact verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F6F8F3] border border-[#D5E2D6] space-y-3 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#14281D]">Interactive Impact Map & Cost Estimator</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zoomable land cover breakdown (vegetation %, water %, urban built-up %) with dynamic itemized corrective cost estimation in Rupees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F8F3] border border-[#D5E2D6] space-y-3 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#14281D]">Timber Smuggling & Funds Tracker</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Monitors fiscal budget efficiency and triggers automated alerts for sudden 60% → 42% vegetation drops in protected forest zones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F8F3] border border-[#D5E2D6] space-y-3 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#14281D]">Environmental Baseline Generator</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Objective pre-intervention baseline generator comparing initial condition against current satellite observations (Before vs. Now).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F8F3] border border-[#D5E2D6] space-y-3 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#14281D]">Satellite Image Data Repository ("Data")</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Continuous satellite imagery observation store with multi-spectral layers, cloud cover percentages, and calibration metadata.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F8F3] border border-[#D5E2D6] space-y-3 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#14281D]">Expected vs. Reality Trajectory</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Multi-temporal trajectory curve comparing target scientific recovery expectations against actual observed satellite reality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F8F3] border border-[#D5E2D6] space-y-3 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#14281D]">AI Copilot</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Conversational AI assistant answering queries on government funding schemes, technical fixes, and custom policy document uploads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-[#F6F8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono bg-emerald-100 text-emerald-900 border border-emerald-300">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
              Closed-Loop Environmental Intelligence Workflow
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              A 6-stage continuous measure-act-verify cycle ensuring every conservation rupee delivers measurable impact.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-white border border-[#D5E2D6] space-y-2 shadow-2xs">
              <div className="font-bold text-[#14281D] font-mono">1. BASELINE</div>
              <p className="text-[11px] text-stone-600">Day Zero satellite index reference.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#D5E2D6] space-y-2 shadow-2xs">
              <div className="font-bold text-[#14281D] font-mono">2. MONITOR</div>
              <p className="text-[11px] text-stone-600">5-day satellite overpass surveillance.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#D5E2D6] space-y-2 shadow-2xs">
              <div className="font-bold text-[#14281D] font-mono">3. DETECT</div>
              <p className="text-[11px] text-stone-600">Anomaly & timber loss detection.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#D5E2D6] space-y-2 shadow-2xs">
              <div className="font-bold text-[#14281D] font-mono">4. PREDICT</div>
              <p className="text-[11px] text-stone-600">DRIC risk model & trajectory forecast.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#D5E2D6] space-y-2 shadow-2xs">
              <div className="font-bold text-[#14281D] font-mono">5. ACT</div>
              <p className="text-[11px] text-stone-600">Corrective costs & scheme directives.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#D5E2D6] space-y-2 shadow-2xs">
              <div className="font-bold text-[#14281D] font-mono">6. VERIFY</div>
              <p className="text-[11px] text-stone-600">Closed-loop trajectory verification.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
