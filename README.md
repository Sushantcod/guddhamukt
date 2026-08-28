# Gaddhamukt (गड्ढामुक्त) — Civic Road Accountability Platform

A modern civic road-issue reporting and public governance accountability web application for urban cities (e.g., Bengaluru BBMP), rural villages (e.g., Gram Panchayats), and Punjab (LPU GT Road Corridor).

---

### 🏆 Hackathon Documentation & Slide Deck
All presentation slides, Q&A pitch guides, system architecture diagrams, and UI guides are consolidated in the **[`hackathon-docs/`](file:///Users/sushant/Documents/guddhamukt/hackathon-docs/README.md)** directory:
- 📊 **[`HACKATHON_PRESENTATION.html`](file:///Users/sushant/Documents/guddhamukt/hackathon-docs/HACKATHON_PRESENTATION.html)** — Interactive Browser Presentation (Arrow Key Navigation)
- 📜 **[`HACKATHON_SLIDES.md`](file:///Users/sushant/Documents/guddhamukt/hackathon-docs/HACKATHON_SLIDES.md)** — 10-Slide Markdown Deck
- 🏆 **[`HACKATHON_QA_PITCH.md`](file:///Users/sushant/Documents/guddhamukt/hackathon-docs/HACKATHON_QA_PITCH.md)** — Judges Pitch & Q&A Master Guide
- 🏗️ **[`SYSTEM_ARCHITECTURE_FLOW.md`](file:///Users/sushant/Documents/guddhamukt/hackathon-docs/SYSTEM_ARCHITECTURE_FLOW.md)** — System Architecture & Data Pipeline
- 🎨 **[`UI_DESIGN_SYSTEM_GUIDE.md`](file:///Users/sushant/Documents/guddhamukt/hackathon-docs/UI_DESIGN_SYSTEM_GUIDE.md)** — UI Design System & Component Breakdown

---

## 🏛️ Features

- **Interactive Civic Map**: Pinpoint and explore road hazards, potholes, waterlogging, and streetlights with custom severity markers and category filters.
- **Reporting Wizard**: 4-step civic grievance filing with photo capture simulation, GPS geo-location, and automated duplicate detection using Haversine distance.
- **Accountability Card**: Transparent public tender ID, contractor details, project budget, and warranty tracking.
- **7-Tier Escalation Hierarchy**: Administrative routing from Junior Ward Engineers and Sarpanches to Municipal Commissioners, MLAs, MPs, and Chief Minister Grievance Cells (Jansunwai).
- **Formal Dossier / PDF Generator**: Generates formal civic grievance petitions and escalation dossiers client-side using `jsPDF`.
- **Public Analytics Dashboard**: Ward leaderboard, resolution SLAs, category distributions, and hazard hotspots powered by `recharts`.
- **Simulated Admin Desk**: Interactive municipal officer portal to review complaints, schedule inspections, update repair proofs, and close tickets.

---

## 📁 Project Structure

```text
guddhamutk/
├── public/
│   └── demo-images/
│       ├── pothole-1.jpg
│       ├── pothole-2.jpg
│       └── repair-proof.jpg
│
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   ├── map/
│   │   │   ├── IssueMap.tsx
│   │   │   ├── IssueMarker.tsx
│   │   │   └── MapFilters.tsx
│   │   │
│   │   ├── report/
│   │   │   ├── CameraUpload.tsx
│   │   │   ├── LocationCapture.tsx
│   │   │   ├── IssueForm.tsx
│   │   │   └── DuplicateMatchModal.tsx
│   │   │
│   │   ├── issue/
│   │   │   ├── IssueCard.tsx
│   │   │   ├── IssueTimeline.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── AccountabilityCard.tsx
│   │   │   └── AuthorityChain.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── WardChart.tsx
│   │   │   └── HotspotList.tsx
│   │   │
│   │   └── common/
│   │       ├── EmptyState.tsx
│   │       ├── LoadingState.tsx
│   │       └── SourceBadge.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ReportIssuePage.tsx
│   │   ├── IssueDetailPage.tsx
│   │   ├── TrackComplaintPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── AdminDemoPage.tsx
│   │
│   ├── data/
│   │   ├── mockIssues.ts
│   │   ├── mockAuthorities.ts
│   │   ├── mockRoadContracts.ts
│   │   └── mockLocations.ts
│   │
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useIssues.ts
│   │   └── useDuplicateDetection.ts
│   │
│   ├── utils/
│   │   ├── haversine.ts
│   │   ├── issueHelpers.ts
│   │   ├── escalationHelpers.ts
│   │   └── generateComplaintPdf.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start (Frontend Only)

```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev

# Run TypeScript type check
npm run lint

# Build production bundle
npm run build
```

---

## ⚡ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet + OpenStreetMap
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Animations & FX**: Motion + Canvas-Confetti
- **State Management**: Reactive LocalStorage Client Store
