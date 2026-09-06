# 🌍 TerraMind AI

> **Planetary Earth Observation Satellite Intelligence, AI-Driven Conservation Tracking, and Explainable Risk Predictors.**

**TerraMind AI** is an advanced Earth Observation (EO) satellite intelligence platform designed to monitor conservation interventions over time, identify trajectory gaps, analyze real-time satellite imagery, and provide explainable environmental risk predictions across critical ecological sites in India.

Instead of relying on static reports or delayed manual audits, TerraMind AI combines **multispectral Sentinel-2 imagery**, **GeoPandas spatial indexing**, **NDVI/NDWI trajectory analytics**, and **explainable root-cause diagnostic engines** with a **policy-aware RAG Copilot Agent**.

---

# 🧠 The Core Engine & Workflow

TerraMind AI operates on a continuous, closed-loop telemetry and diagnostic workflow:

```text
    ┌─────────────────────────────────────────────────────────┐
    │     Earth Observation Satellites (Sentinel-2 / SAR)     │
    └────────────────────────────┬────────────────────────────┘
                                 │
                   Multispectral Band Ingestion
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────┐
    │  Geospatial Processing Engine (GeoPandas & Rasterio)   │
    └────────────────────────────┬────────────────────────────┘
                                 │
                  NDVI / NDWI / EVI Computation
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────┐
    │    Anomaly Engine & Baseline Comparison (3-Year Avg)   │
    └────────────────────────────┬────────────────────────────┘
                                 │
                    Variance Evaluation & Status
                                 │
            ┌────────────────────┴────────────────────┐
            │                                         │
     [Green State]                           [Red / Yellow State]
   Optimal Recovery                    ┌──────────────────────────────┐
  (No Action Needed)                   │  Probable Cause Breakdown    │
                                       │  - Financial / Funds         │
                                       │  - Encroachment / Logging    │
                                       │  - Resource / Climate Stress │
                                       │  - Labor / Operation Deficit │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Dr. Arjun Mehta RAG Copilot  │
                                       │ Scheme Matching & Corrective │
                                       │ Intervention Strategy        │
                                       └──────────────────────────────┘
```

---

# 🏗️ System Architecture

TerraMind AI uses a decoupled, high-performance architecture separating high-speed geospatial raster computations from real-time interactive UI rendering.

```text
                                 ┌──────────────────────┐
                                 │     TerraMind AI     │
                                 │  Next.js 14 Frontend │
                                 └──────────┬───────────┘
                                            │
                                    REST API Requests
                                            │
                                            ▼
                                 ┌──────────────────────┐
                                 │   FastAPI Router     │
                                 │   (Python 3.12)      │
                                 └──────────┬───────────┘
                                            │
         ┌─────────────────────────┬────────┴────────────────┬────────────────────────┐
         │                         │                         │                        │
         ▼                         ▼                         ▼                        ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│ Geospatial &    │       │ Anomaly & Baseline      │ Trajectory      │      │ Dr. Arjun Mehta │
│ Map Engine      │       │ Diagnostic Engine       │ Forecasting     │      │ RAG Copilot     │
│ (GeoPandas)     │       │ (Probable Cause)        │ (NDVI / NDWI)   │      │ (LangGraph/RAG) │
└─────────────────┘       └─────────────────┘       └─────────────────┘      └─────────────────┘
```

---

# 🌟 Key Features & Subsystems

## 🗺️ 1. Interactive GIS Impact Map (`MapView.tsx`)
- **Pan-India Dynamic Search:** Search for any dam, tiger reserve, wetland, or forest range across India (e.g., *Almatti Dam*, *Sariska*, *Panna*, *Tungabhadra Dam*) and inspect live boundaries.
- **Layer Control:** Toggle between **Satellite**, **NDVI (Vegetation Index)**, and **NDWI (Water Extent)** layers with color-coded health indicators (Green: Healthy, Yellow: Moderate Risk, Red: Critical Degradation).
- **Live Polygon Inspection:** Dynamic side panel providing site baseline statistics, funding status, and risk alerts.

## 🛰️ 2. Satellite Data Repository (`SatelliteRepositoryView.tsx`)
- **Multi-Band Imagery Analysis:** Inspect true-color optical, false-color infrared, and SAR radar satellite passes.
- **Pan-India Site Filter:** Search and filter imagery for both pre-indexed projects and dynamically searched locations.
- **Image Metadata Inspection:** Spatial resolution, cloud coverage percentage, acquisition date, and sensor constellation tracking.

## 📁 3. Conservation Projects Portfolio (`ProjectsPortfolioView.tsx`)
- **Intervention Tracking:** Complete tracking of CAMPA fund disbursements, afforestation hectares, check dam dredging, and timber smuggling interdictions.
- **Searchable Portfolio:** Instant lookup across all active projects and dynamic sites with live status indicators.

## 📈 4. Recovery Trajectory Engine (`TrajectoryChart.tsx`)
- **12-Month Temporal Analysis:** Plot monthly NDVI/NDWI trends against 3-year historical baselines.
- **Trajectory Forecast:** Identify intervention lag, recovery trajectory gaps, and seasonal variations before ecological damage becomes irreversible.

## ⚠️ 5. Probable Cause Diagnostic Engine
- **Automated Root Cause Diagnostics:** Automatically triggered whenever a site drops into **Red (Critical)** or **Yellow (Warning)** status.
- **4-Pillar Breakdown:**
  - 💰 **Financial / Funds:** CAMPA delay, fund shortfall, unreleased grants.
  - 🪓 **Encroachment & Illegal Activities:** Illegal land conversion, timber smuggling, boundary violation.
  - ☀️ **Resource & Climate Stress:** Severe drought, monsoon failure, heatwaves, low inflow.
  - 👷 **Labor & Operational Deficits:** Ranger shortages, patrol gear gaps, seasonal labor shortages.

## 🤖 6. Dr. Arjun Mehta — AI Copilot & Policy RAG (`CopilotChatDrawer.tsx`)
- **Humanized Persona:** Senior Analyst (25+ years experience across FSI, MoEFCC, CWC, WCCB) who responds naturally to casual greetings and shifts to technical expert mode for complex queries.
- **Government Scheme Matching:** Instant retrieval of relevant schemes including *Jal Shakti Abhiyan*, *WDC-PMKSY 2.0*, *CAMPA*, *AMRUT 2.0*, *Green India Mission*, and *DRIP Phase II*.
- **PDF Document Ingestion:** Upload field reports, audit PDFs, or policy papers for RAG context extraction.

---

# 🌐 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects/map` | Fetches all spatial map projects with polygons, health scores, and probable cause breakdowns |
| `GET` | `/api/baseline/{project_id}` | Retrieves 3-year pre-intervention baseline comparison data |
| `GET` | `/api/satellite/repository/{project_id}` | Fetches Sentinel-2 imagery passes, NDVI bands, and metadata |
| `GET` | `/api/trajectory/{project_id}` | Returns 12-month historical telemetry and recovery forecast points |
| `POST` | `/api/copilot/chat` | RAG Copilot chat endpoint powered by Dr. Arjun Mehta persona |
| `POST` | `/api/copilot/upload` | Document upload endpoint for contextual RAG index expansion |
| `GET` | `/api/health` | Health check verifying geospatial engines and AI endpoints |

---

# 🗺️ Monitored Pan-India Sites Matrix

| Site Name | Location | Focus Area | Status | Primary Risk Factor |
| :--- | :--- | :--- | :--- | :--- |
| **Almatti Dam** | Karnataka | Reservoir Siltation & Water Storage | 🟡 Yellow | Silt buildup & upstream inflow delay |
| **Sariska Tiger Reserve** | Rajasthan | Habitat Corridor & Timber Smuggling | 🔴 Red | Encroachment & illegal tree felling |
| **Panna Tiger Reserve** | Madhya Pradesh | Afforestation & Canopy Cover | 🔴 Red | CAMPA funding delay & ranger shortage |
| **Tungabhadra Dam** | Karnataka | Bathymetric Water Extent | 🟢 Green | Optimal recovery post-dredging |
| **Loktak Lake** | Manipur | Phumdi Wetland Rejuvenation | 🟡 Yellow | Siltation & floating vegetation loss |
| **Chilika Lake** | Odisha | Lagoon Salinity & Fishery Corridor | 🟢 Green | Stable brackish water balance |
| **Aravalli Range** | HR/RJ Border | Mine Reclamation & Eco-Sensitive Zone | 🔴 Red | Mining encroachment & severe heat stress |
| **Mettur Stanley Reservoir** | Tamil Nadu | Drought Catchment Management | 🟡 Yellow | Monsoon deficit & upstream low flow |

---

# 💻 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Git**: Installed and configured

### 1. Clone Repository
```bash
git clone https://github.com/kvmkashyap-stack/TerraMind-AI.git
cd TerraMind-AI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to open the TerraMind AI dashboard.

---

# 🧪 Running Verification Tests

```bash
cd backend
python -m pytest tests/test_all_features.py
```
*(All 10 test modules cover API router endpoints, anomaly diagnostics, probable cause breakdown calculations, and satellite repository APIs).*

---

# 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
