# PHC Sentinel - AI-Driven Health Center & Supply Chain Management

### **Track 3: Smart Health Challenge & Logistics Optimization Command Center**
A premium, production-ready, fully responsive administrative dashboard prototype engineered for District Administrators and Members of Parliament. This system provides a unified telemetry pane monitoring rural Primary Health Centers (PHCs) and Community Health Centers (CHCs) in Guntur District, Andhra Pradesh, with real-time analytics, automated supply redistribution routing, and safety-threshold ledger controls.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** React 18+ with TypeScript via Vite (optimized for fast HMR and build times).
- **Styling:** Tailwind CSS (configured with standard PostCSS directives and a custom slate-950/900 deep theme).
- **Visuals & Charts:** Recharts (using dynamic rendering to plot bed capacities vs. occupancies).
- **Icons:** Lucide React.
- **State Management:** React Context (`DashboardContext`) for unified telemetry states, active navigation views, map node focusing, and AI triggers.
- **Backend Integration Design:** Standalone `src/services/api.ts` exposing async service layers with commented integration endpoints:
  ```typescript
  // TODO: Paste Google Cloud Function API URL here to query real BigQuery datasets
  ```

---

## 🌟 Key Views & Capabilities

### 📡 View A: Guntur District Command Center
- **Hero KPI Metrics:**
  - *PHCs Monitored:* Number of connected health clinics.
  - *Critical Stockouts:* Active count with pulsing alert indicators.
  - *Operational Beds Available:* Live occupancy metrics.
  - *Pending Inter-PHC Transfers:* Active supply routes awaiting dispatch.
- **Cyber-Grid Vector Map:** A stylized coordinate canvas plot representing Guntur District. It renders clinics with custom status circles. Dotted animated pipelines trace active transfer routes.
- **Watchlist & Alerts:** A prioritized watchlist flagging facilities facing medical stockouts or physician shortages.
- **Capacity Analytics Chart:** A double-bar Recharts visualization tracking bed allocations.

### 🧠 View B: Gemini Logistics Redistribution Engine
- **Simulated Computation Timeline:** Clicking "Run AI Optimization" triggers a 2-second pipeline loading timeline:
  1. *Establishing secure pipeline to BigQuery & GCS...*
  2. *Gemini is analyzing regional asset velocities & demand rates...*
  3. *Running predictive regression on seasonal epidemiology...*
  4. *Simulating transit network latency & routing constraints...*
  5. *Synthesizing clinical justifications for redistribution...*
- **Actionable AI Recommendations:** A stream of cards outlining logistics transfers (e.g., Polyvalent Antivenom vials from Narasaraopet Central to Sattenapalli CHC).
- **Gemini Clinical Justifications:** Details the clinical logic behind the recommendation:
  - Explains the local epidemiology trends (e.g., monsoon agricultural clearing causing snakebite clusters).
  - Outlines the safety-stock ratios (e.g., Narasaraopet Central holding 400% safety buffer).
- **Interactive Dispatch Control:** Administrators can click **"Authorize Shift"** to execute the transfer, updating the data context and inventory levels in memory instantly.

### 📋 View C: Clinic Safety Ledger & Assets Tracker
- **Telemetry Dropdown:** Switch focus between different clinics.
- **Safety Margin Progress Bars:** Color-graded bars showing stock levels relative to safety thresholds:
  - 🟢 **Stable:** Stock is at safe margins.
  - 🟡 **Warning:** Stock has dropped below the minimum safety threshold.
  - 🔴 **Critical:** Stock is completely depleted (Stockout).
- **Interactive Simulation Controls:**
  - *Log Count:* Type in manual audits.
  - *Presets (Deplete/Restock):* Click to instantly trigger stockouts or fill reserves for demonstration purposes.

---

## ⚡ Map Interaction Optimization & Click Fixes

To resolve standard SVG click-glitching issues:
1. **Pulsing Pin Rings:** Replaced standard CSS animations (`animate-ping`/`animate-pulse`) with native SVG `<animate>` elements. This prevents layout scaling bugs relative to the SVG canvas origin (0,0) and locks animations to circle centers.
2. **Invisible Click Targets:** Placed a transparent `<circle cx={cx} cy={cy} r="24" fill="transparent" />` overlay on each clinic pin. This increases the interactive cursor boundary to 24px, ensuring clicks are successfully registered.
3. **Explicit Selectors:** Added unique element IDs (`id={`pin-${clinic.id}`}`) to allow automated QA frameworks to target nodes.

---

## 🚀 Local Development Quickstart

Ensure you have [Node.js](https://nodejs.org/) installed, then execute:

1. **Clone & Navigate:**
   ```bash
   cd c:\gHackathon
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Launch Dev Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Compile Production Build:**
   ```bash
   npm run build
   ```
   Compiles optimized production files into the `dist/` directory.

---

## 📂 Source Code Layout

- `src/services/api.ts` — Asynchronous data actions and mock state updates.
- `src/context/DashboardContext.tsx` — Global React state and AI execution timelines.
- `src/components/Sidebar.tsx` — Sidebar navigation panel.
- `src/components/HeroKPICards.tsx` — Dynamic KPI trackers.
- `src/components/DistrictMap.tsx` — Interactive SVG map and focal telemetry cards.
- `src/components/WatchlistPanel.tsx` — watchlist database showing staff/stock alerts.
- `src/components/AISupplyEngine.tsx` — Gemini optimization loader and recommendation feeds.
- `src/components/ClinicInventory.tsx` — Inventory ledger, manual audits, and demo presets.
- `src/components/PerformanceChart.tsx` — Recharts district beds allocation visualization.
- `src/App.tsx` — Global page shell, title bars, and time counters.
