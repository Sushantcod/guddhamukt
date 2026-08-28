# 🏆 Official Smart India Hackathon (SIH) Presentation Deck

---

## SLIDE 1: Title & Problem Statement Header
- **Problem Statement ID**: SIH-2025-CIVIC-042
- **Problem Statement Title**: Automated Road Pothole Detection, Municipal SLA Tracking & Contractor Liability Platform
- **Category**: Software
- **Ministry / Department**: Ministry of Housing & Urban Affairs (MoHUA) & Ministry of Panchayati Raj (MoPR)
- **Team Leader**: Sushant Chand (Lovely Professional University - LPU)
- **Solution Name**: **GADDHAMUKT (गड्ढामुक्त)** — *Report Potholes. Fix Roads. Hold Engineers Accountable.*

---

## SLIDE 2: Proposed Solution (Point-by-Point)
### 1. Photo Geo-Tagging & Spatial Deduplication
- Citizens capture photos with automatic GPS location pin & reverse geocoding.
- Haversine distance algorithm detects duplicate complaints within a 50-meter radius and merges them.
- Increments Citizen Confirmation Count without clogging municipal queues.

### 2. 72-Hour Statutory SLA Engine
- Dynamic countdown based on Hazard Severity: Immediate Danger (24h), High (48h), Medium (72h).
- Enforces Municipal Gazette & Citizen Charter SLA resolution deadlines.
- Automated Tier-2 Overdue Escalation when official deadlines elapse.

### 3. Interactive Before & After Repair Proof Slider
- Dual-layer comparison slider showing raw pothole crater vs resurfaced asphalt patch.
- 3-Stage Repair Proof: Registered → Compaction Roller Work → Citizen 5-Star Sign-Off.
- Ensures contractors verify physical compaction work before closing dockets.

### 4. 1-Click RTI & CMO Legal PDF Dossier Generator
- Generates client-side PDF petition dossier incorporating GPS maps, photos, and tender IDs.
- Includes formatted legal clauses under Section 72 Public Disclosure Act for RTI & CMO filing.
- Empowers citizens with actionable legal leverage against delinquent authorities.

---

## SLIDE 3: Technical Architecture & System Workflow Diagram
### Workflow Execution Pipeline:
```
[Stage 1: Citizen Photo Upload + GPS Geo-Tagging]
                        │
                        ▼
[Stage 2: Haversine 50m Spatial Deduplication Check]
                        │
                        ▼
[Stage 3: Auto-Routing to Ward Engineer / Panchayat Sarpanch]
                        │
                        ▼
[Stage 4: 72h Statutory SLA Countdown Engine Active]
                        │
                        ▼
[Stage 5: Asphalt Compaction Work & Citizen Verification Sign-Off]
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
[Resolved & Verified]       [If SLA Breached: 1-Click RTI / CMO PDF Packet]
```
- **Real-World Test Corridor**: Punjab LPU GT Road Corridor (NH-44 Phagwara & Jalandhar) + Bengaluru BBMP Grid.

---

## SLIDE 4: Technology Stack & Key Libraries (Point-by-Point)
### 1. Core Web Framework
- **React 19 & TypeScript 5.8**: Component architecture & strict type-safety.
- **Vite 6 SPA Bundler**: Lightning fast module replacement & optimized production build.
- **React Router v7**: Declarative route transitions with `AnimatePresence`.

### 2. UI Styling & Motion
- **TailwindCSS v4 (@tailwindcss/vite)**: Custom design tokens & glassmorphism.
- **Motion / Framer Motion**: Tubelight lamp glow, scroll entrance animations.
- **Lucide React Icons**: Modern, crisp vector UI icon system.

### 3. Geospatial, PDF & Data Persistence
- **Leaflet & React-Leaflet**: Geospatial pothole map with custom markers.
- **jsPDF Utility Engine**: Client-side legal petition & dossier PDF compiler.
- **Recharts Library**: Interactive public governance analytics.
- **LocalStorage State Engine**: Client-side custom hook engine (`useIssues`) with zero backend overhead.

---

## SLIDE 5: Feasibility, Viability & Social Impact
- 💰 **Economic Viability**: Zero cloud backend costs during initial rollout. Operates as a serverless static web application integrable with existing NIC / Municipal portals.
- 🛡️ **Public Safety Impact**: Drastically reduces two-wheeler road fatalities by prioritizing Immediate Danger potholes (24h SLA) on high-speed GT Road corridors.
- 📜 **Contractor Liability**: Publicly publishes road contract IDs and tender defect liability periods, preventing corrupt re-tendering of recently paved roads.

---

## SLIDE 6: Conclusion & SIH Presentation Summary
- 🔗 **GitHub Repository**: [https://github.com/Sushantcod/guddhamukt](https://github.com/Sushantcod/guddhamukt)
- 📍 **Test Corridor**: Punjab LPU GT Road NH-44 & Bengaluru BBMP Grid
- 👨‍💻 **Team Leader**: Sushant Chand (LPU)
- **Let's Make Indian Roads 100% Gaddhamukt!**
