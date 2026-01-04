# 🌧️ DelhiMonsoonGuard
## Mapping Water-Logging Hotspots & Monsoon Preparedness of Delhi

DelhiMonsoonGuard is a **data-driven, GIS-enabled platform** designed to **identify and map water-logging hotspots across Delhi** and **assess monsoon preparedness at the ward level**.  
The project supports **proactive urban planning and early response** by municipal authorities during the monsoon season.

---

## 🚨 Problem Statement

Delhi faces recurring **water-logging during monsoons**, leading to:
- Traffic disruption and commuter delays
- Damage to roads and urban infrastructure
- Public inconvenience and safety risks

Current approaches are largely **reactive**, lack **ward-level preparedness assessment**, and underutilize available spatial and environmental data.

---

## 💡 Our Solution

DelhiMonsoonGuard transforms fragmented urban data into **predictive, actionable insights** by:

- Mapping **water-logging hotspots using GIS**
- Predicting **ward-level flood risk (Low / Medium / High)**
- Computing a **Monsoon Preparedness Score** for each ward
- Providing **decision-ready dashboards** for authorities

> From static flood maps → to predictive preparedness intelligence

---

## 🏗️ System Architecture

### End-to-End Flow
1. **Data Sources**
   - Rainfall data (IMD / API – proxy)
   - Drainage network data
   - Elevation & terrain data
   - Past flood records

2. **Data Processing**
   - Data cleaning & validation
   - GIS-based spatial mapping (ward/grid)
   - Feature engineering

3. **Analytics**
   - Risk & preparedness scoring engine
   - Predictive risk classification

4. **Backend Services**
   - API layer
   - Spatial database (PostGIS-ready)

5. **Visualization & Action**
   - GIS hotspot maps
   - Authority dashboards
   - Alerts & decision support

---

## ✨ Features

- 🗺️ GIS-based water-logging hotspot mapping
- 📊 Ward-level monsoon preparedness score
- 🚦 Predictive risk categorization (Low / Medium / High)
- 🔍 Explainable risk insights
- 📋 Authority-focused priority dashboard
- ⚙️ Scalable and deployment-ready architecture

---

## 🚀 Unique Selling Points (USP)

- **Beyond Mapping**: Focuses on preparedness, not just visualization
- **Explainable & Trustworthy**: Transparent scoring logic
- **Decision-Oriented**: Designed for proactive municipal planning
- **Future-Ready**: Easily integrates real-time civic datasets

---

## 🧪 Data Disclaimer

⚠️ This is a **functional prototype** developed for hackathon purposes.  
The system currently uses **proxy and simulated data** to demonstrate feasibility.  
It is fully scalable with real-time government and municipal datasets.

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Leaflet.js

### Backend
- Python (Flask / FastAPI)
- REST APIs

### Data & GIS
- GeoJSON (Ward boundaries)
- Spatial Database (PostGIS-ready)

---

## Frontend Setup

- **Navigate to frontend directory:** cd frontend
- **Install dependencies:** npm install
- **Start development server:** npm run dev
- **Open in browser:** http://localhost:5173

---

## Backend Setup

- **Navigate to backend directory:** cd backend
- **Start the API server:** python -m uvicorn risk_engine.api:app --reload
- **Backend runs at: http:** http://localhost:8000/risk-data

---

## 📌 Use Cases

- Municipal corporations for monsoon preparedness planning
- Disaster management authorities for early response
- Urban planners for infrastructure prioritization
- Public dashboards for citizen awareness

---

## 👥 Team

**Team Name:** DelhiMonsoonGuard

**Members:**
- Pranshu Sharma (Team Leader)
- Suryansh Tomar
- Kritika Sharma
- Raghav Singh

**Affiliation:**  
Jaypee Institute of Information Technology (JIIT), Noida

---

## 🏁 Conclusion

DelhiMonsoonGuard demonstrates how **GIS and data analytics** can shift urban flood management from **reaction to prevention**, enabling smarter, faster, and more resilient cities.
