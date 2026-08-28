# 🎨 Gaddhamukt — UI Design System & Component Breakdown Guide

This guide documents the design aesthetics, color palette, custom animation components, and visual breakdown of **Gaddhamukt**.

---

## 1. Brand Aesthetics & Color System

Gaddhamukt is designed with a **sleek dark civic palette** combined with vibrant orange highlights inspired by Indian safety traffic cones and resurfaced asphalt:

| Element | Color Hex | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Navy Background** | `#0F294A` / `#07172B` | `bg-[#0F294A]` / `bg-[#07172B]` | Hero background, navbar, and footer |
| **Vibrant Civic Orange** | `#F97316` | `bg-[#F97316]` / `text-[#F97316]` | Primary CTAs, active highlights, cursor |
| **Emerald Verification** | `#10B981` / `#15803D` | `text-emerald-500` / `bg-emerald-50` | Resolved status, citizen sign-off |
| **Emergency Red** | `#EF4444` / `#DC2626` | `bg-red-500` / `text-red-600` | Immediate Danger hazards & SLA breaches |
| **Typography** | `Plus Jakarta Sans` | `font-['Plus_Jakarta_Sans']` | Primary UI typography across headings |

---

## 2. Key Interactive Components Breakdown

### 📍 1. Tubelight Pill Navbar (`src/components/layout/Navbar.tsx`)
- **Aesthetic**: Floating dark pill navbar with glassmorphism backdrop blur (`backdrop-blur-md bg-[#0F294A]/90`).
- **Tubelight Lamp Animation**: Powered by `motion/react` with `layoutId="active-tab"`.
- **Top Lamp Glow**: A glowing orange bar (`bg-[#F97316] shadow-[0_-2px_10px_rgba(249,115,22,0.9)]`) slides smoothly to whichever tab is active (`/`, `/track`, `/dashboard`, `/admin`).

---

### ↔️ 2. Before & After Drag Slider (`src/components/ui/RoadRepairShowcase.tsx`)
- **Functionality**: Interactive dual-layer image comparison slider.
- **Top Layer**: Dangerous 4-inch deep pothole image (`/demo-images/pothole-1.jpg`) clipped dynamically using CSS `width: ${sliderPos}%`.
- **Bottom Layer**: Smoothly resurfaced asphalt patch image (`/demo-images/repair-proof.jpg`).
- **Fixed Badges**: `BEFORE: Dangerous Road Pothole` (red) and `AFTER: Verified Fixed Road` (green) sit on fixed outer frame z-layers to prevent text clipping during drag.

---

### ⌨️ 3. Animated Typewriter Text (`src/components/common/TypingText.tsx`)
- **Effect**: Character-by-character typing and deleting animation with a pulsing cursor (`|`).
- **Rotating Phrases**:
  1. `"Fix Roads. Hold Engineers Accountable."`
  2. `"Track Live Municipal Repair Progress."`
  3. `"Generate Legal RTI & CMO Escalations."`
  4. `"Citizen Verification & Quality Sign-Off."`

---

### 🌲 4. Alternating Step Timeline Tree (`src/components/issue/IssueTimeline.tsx`)
- **Layout**: Full-width alternating timeline tree.
- **Odd Steps (1, 3, 5)**: Positioned on the **LEFT** side of the central vertical line.
- **Even Steps (2, 4, 6)**: Positioned on the **RIGHT** side of the central vertical line.
- **Scroll Animations**: Uses `motion.div` with `whileInView` so cards slide into place from the left (`x: -40 → 0`) or right (`x: 40 → 0`) as the user scrolls!

---

### 📡 5. Civic Radar Search Loading Scanner (`src/pages/TrackComplaintPage.tsx`)
- **Effect**: When a user tracks a ticket ID or clicks a sample pill (`#CP-PB-101`, `#CP-90210`), a simulated 450ms radar scanner activates with a pulsing radar wave (`animate-ping`) and progress bar.

---

### ❤️ 6. Beating Heart Footer Credit (`src/components/layout/Footer.tsx`)
- **Effect**: Pulsing heartbeat animation on the red heart icon (`motion.span` scaling loop).
- **Author Attribution**: `Crafted with ❤️ by Sushant Chand for safer roads`.

---

## 3. Image & Media Asset Registry

| Image Path | Description | Usage Site |
| :--- | :--- | :--- |
| `public/demo-images/pothole-1.jpg` | Deep asphalt crater on GT Road | Hero Before Slider & LPU Gate 1 Ticket |
| `public/demo-images/repair-proof.jpg` | Resurfaced asphalt patch | Hero After Slider & Resolved Tickets |
| `public/demo-images/road-repair-work.jpg` | Heavy compaction roller civil work | 3-Stage Live Repair Proof Showcase |
| `public/logo.svg` & `src/assets/logo.svg` | Vector Gaddhamukt branding logo | Navbar & Footer headers |
