# 🌍 TerraMind AI — Environmental & Resource Conservation Intelligence Platform

**TerraMind AI** is an advanced Earth Observation (EO) satellite intelligence platform designed to monitor conservation interventions over time, identify trajectory gaps, analyze real-time satellite imagery, and provide explainable environmental risk prediction across critical ecological sites in India.

---

## 🌟 Key Features

- **📍 Interactive GIS Impact Map (`MapView.tsx`)**
  - Live satellite overlay, Sentinel-2 baseline vegetation indices (NDVI/NDWI), real-time boundary polygon inspection.
  - Search location feature allowing dynamic pan-India inspection for any dam, reserve, or wetland (e.g. Almatti Dam, Sariska, Panna, Tungabhadra).

- **🛰️ Satellite Data Repository (`SatelliteRepositoryView.tsx`)**
  - Historical & real-time satellite imagery comparisons across optical, multispectral, and SAR radar bands.
  - Full search & filter functionality across all sites.

- **📊 Conservation Projects Portfolio (`ProjectsPortfolioView.tsx`)**
  - Detailed intervention tracking (CAMPA funds, afforestation, check dam desilting, timber smuggling interdiction).
  - Search location & dynamic project filter across all historical project datasets.

- **📈 Recovery Trajectory Engine (`TrajectoryChart.tsx`)**
  - 12-month historical NDVI/NDWI trends, 3-year baseline comparisons, recovery trajectory prediction.

- **⚠️ Probable Cause Breakdown Engine**
  - Automatic AI diagnostics for high-risk (Red) and warning-state (Yellow) conservation sites.
  - Categorized breakdown across **Financial/Funds**, **Encroachment**, **Resource/Climate**, and **Labor/Operational** constraints.

- **🤖 TerraMind Copilot RAG Agent (`CopilotChatDrawer.tsx`)**
  - AI Assistant (Dr. Arjun Mehta persona) providing technical corrective plans, scheme matching (Jal Shakti Abhiyan, CAMPA, AMRUT 2.0), and PDF document RAG uploads.

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router) + React + TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Mapping & Visuals:** Leaflet / OpenStreetMap, Recharts

### Backend
- **Framework:** FastAPI (Python 3.12) + Uvicorn
- **AI & RAG Engine:** LangGraph / LangChain, OpenAI / Anthropic / Gemini integration
- **Geospatial & Analytics:** GeoPandas, Shapely, Pytest suite (10/10 test coverage)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

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
# On Linux/macOS:
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
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

```bash
cd backend
python -m pytest tests/test_all_features.py
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
