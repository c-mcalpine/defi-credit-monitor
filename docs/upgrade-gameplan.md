# DeFi Credit Market Monitor — Institutional Quality Upgrade Plan

## Current State Assessment

**What you have (and it's solid):**
- Live DeFi Llama integration pulling lending pools from Aave V2/V3, Compound V3, Morpho, Spark
- Dune Analytics historical data: liquidations, borrow volume, stablecoin net flows
- Signal engine computing a market regime (risk-on / neutral / risk-off) from TVL-weighted borrow rates and utilization
- SWR polling (60s for live data, 1hr for Dune)
- Seven visualization components: SignalBanner, MetricCards, LendingTable, TvlChart, UtilizationChart, LiquidationChart, BorrowVolumeChart, StableFlowChart

**What's keeping it from institutional quality:**

The data layer is surprisingly good. The presentation layer is what needs the overhaul. Right now it reads like a hackathon prototype — the bones are right but no institutional desk would trust a dashboard that looks like this at first glance. The typography, spacing, information hierarchy, and visual refinement all need to level up. Below is the concrete plan.

---

## Phase 1: Visual Identity & Layout Overhaul

### 1.1 — Typography & Font System
**Current:** Geist (Vercel default). Reads like a generic dev dashboard.
**Target:** A font pairing that signals "financial terminal meets modern fintech."

- [ ] Replace Geist with a monospaced data font for numbers (JetBrains Mono or IBM Plex Mono) paired with a clean sans-serif for labels (IBM Plex Sans, DM Sans, or Satoshi)
- [ ] All numerical values rendered in the mono font — rates, TVL, utilization percentages. This is what Bloomberg, Coinglass, and Token Terminal do
- [ ] Establish a strict type scale: 11px labels, 13px body, 14px table data, 20px card values, 28px page title. No random sizes

### 1.2 — Color System & Dark Theme Refinement
**Current:** Tailwind zinc palette defaults, black background, generic green/red/amber.
**Target:** A deliberate, DeFi-native color system.

- [ ] Define CSS variables in globals.css for a proper theme: `--bg-primary: #0B0E11` (not pure black — Binance/Coinglass-style dark), `--bg-card: #12161C`, `--bg-elevated: #1A1F28`, `--border: #1E2530`
- [ ] Accent palette: Electric blue (`#3B82F6`) for primary actions/links, Protocol green (`#00D4AA`) for positive, Signal red (`#EF4444`) for negative, Amber (`#F59E0B`) for warnings
- [ ] Remove all `bg-zinc-900/60`, `bg-zinc-950/40` inline classes — consolidate into the CSS variable system so the theme is coherent
- [ ] Add very subtle noise texture or fine grid pattern to background (not flat black — depth matters)

### 1.3 — Layout & Grid Restructure
**Current:** Single column scroll with some 2/3 + 1/3 splits. No visual hierarchy.
**Target:** Bloomberg Terminal-inspired dense information layout with clear zones.

- [ ] **Top Bar:** Fixed/sticky header with logo/title left, live status + last-updated timestamp right. Add a subtle bottom border with a 1px gradient line (brand accent)
- [ ] **Signal Banner:** Keep but redesign — make it more compact. Move it to a slim horizontal strip under the header, not a large card. The signal (risk-on/neutral/risk-off) should be immediately scannable in <1 second
- [ ] **Metric Cards Row:** Keep the 4-card layout but redesign cards:
  - Remove the italic "tradFi analog" text from the cards — move these into tooltips (info icon hover). The cards should show: label, big number, delta/change indicator. That's it. Clean and fast.
  - Add sparkline mini-charts inside each metric card (even if just a simple 7-point SVG line showing last 7 data points direction)
- [ ] **Main Content Grid:** Switch to a 2-column layout for the core data section:
  - Left (wide): LendingTable (full width of its column)
  - Right (narrow): Stacked cards — TVL by Protocol chart + Utilization chart stacked vertically
- [ ] **Historical Section:** 3-column grid is fine, but add section header with icon and a subtle separator. The "Historical trends — last 90 days" header needs more presence

### 1.4 — Component-Level Visual Polish

**SignalBanner:**
- [ ] Redesign as a compact "Market Regime" strip — left side shows a colored dot + signal label + one-line description, right side shows the two key metrics in a tight inline layout
- [ ] Use a left-border accent (4px colored bar on the left edge) instead of full background color tint — more refined, less "alert box"

**MetricCards:**
- [ ] Add a subtle left-border accent on each card (2px, brand color)
- [ ] Numbers in monospace font, larger (text-3xl)
- [ ] Replace the tradFi analog paragraph with a small `(i)` tooltip icon that reveals it on hover
- [ ] Add a subtle up/down arrow or delta badge (even if static for now — placeholder for future historical comparison)

**LendingTable:**
- [ ] Add row hover effect (`hover:bg-[#1A1F28]` subtle highlight)
- [ ] Protocol name column: add small protocol logo/icon (favicon-sized, 16x16). You can source from DeFi Llama's icon CDN: `https://icons.llamao.fi/icons/protocols/{project}?w=32&h=32`
- [ ] Chain column: add chain icon similarly
- [ ] Utilization bar: make it slightly taller (h-2 instead of h-1.5), add the percentage value overlaid on or right-aligned next to the bar
- [ ] Add subtle column header background differentiation
- [ ] Consider adding a simple text filter/search input above the table (protocol or asset filter)
- [ ] Pin header row on scroll (sticky thead)

**All Charts (Recharts):**
- [ ] Unify tooltip styling across all charts — create a shared `TOOLTIP_STYLE` constant
- [ ] Add `cursor: { fill: 'rgba(255,255,255,0.03)' }` to bar charts for hover feedback
- [ ] Use the defined color system (no more hardcoded `#378ADD`, `#E24B4A` etc. — reference CSS variables or a shared constants file)
- [ ] Add chart titles inside the chart area (not just the container heading)
- [ ] Consider adding `CartesianGrid` with very subtle dashed horizontal lines (`stroke="#1E2530" strokeDasharray="3 3"`) for readability

---

## Phase 2: Missing Data & Analytical Gaps

### 2.1 — Data Enrichment (API Layer)

- [ ] **Protocol-level metadata:** Add protocol icons, chain icons, and links to each pool entry from DeFi Llama
- [ ] **Yield spread calculation:** Compute and display the spread between supply APY and borrow APY for each pool — this is a core credit analysis metric (net interest margin equivalent)
- [ ] **Rate change indicators:** Cache previous API responses and compute deltas (rate up/down vs. last fetch). Display as `▲ 0.12%` or `▼ 0.05%` next to current values. Even a simple in-memory cache on the API route works
- [ ] **Borrow/Supply ratio:** Already computed as utilization, but surface the raw borrow USD and supply USD values in the table or a tooltip

### 2.2 — Missing Analytical Views

- [ ] **Yield Curve Equivalent:** Add a scatter plot or line chart showing borrow rates across different protocols for the same asset (e.g., USDC borrow rate: Aave V3 vs Compound V3 vs Morpho vs Spark). This is the DeFi equivalent of a yield curve — shows where credit is cheapest
- [ ] **Rate Distribution Histogram:** Simple histogram showing the distribution of borrow rates across all pools — helps identify outliers and the "market rate"
- [ ] **Cross-chain comparison view:** Group metrics by chain (Ethereum vs Arbitrum vs Optimism vs Base) to show where capital and demand are flowing

### 2.3 — Signal Engine Improvements

- [ ] **Signal history:** Store signal state transitions over time (even just in-memory for the session, or a simple JSON file). Show a timeline of when the signal last changed
- [ ] **Multi-factor signal breakdown:** Show the individual components that drive the signal (rate threshold, utilization threshold) as a small gauge or progress bar so users understand WHY it's risk-on vs neutral
- [ ] **Add a simple "Signal Explanation" expandable section** that breaks down the logic: "Stable borrow rate is X% (threshold: >7% = risk-on). Utilization is Y% (threshold: >82% = risk-on)."

---

## Phase 3: UX & Interaction Polish

### 3.1 — Loading & Error States
- [ ] Replace the basic skeleton with a properly designed shimmer/pulse animation that matches the actual layout shape
- [ ] Add individual component-level loading states (not just page-level)
- [ ] Error state: design a proper error card with retry button, not just red text
- [ ] If Dune data fails, show a clear "Historical data unavailable — Dune API error" message with a manual retry button

### 3.2 — Responsive Design
- [ ] Audit mobile layout — the table will be the biggest problem. Add horizontal scroll with a frozen first column (protocol name)
- [ ] Stack the metric cards properly on mobile (2x2 grid, not 1x4)
- [ ] Charts need min-height on mobile so they don't get crushed

### 3.3 — Micro-interactions
- [ ] Table sort: add a brief transition when re-sorting (subtle row reorder animation or at minimum a quick fade)
- [ ] Number formatting: use `tabular-nums` font feature for all numeric columns so they align properly
- [ ] Add a subtle fade-in animation on initial data load (not a jarring pop-in)
- [ ] Signal banner: add a pulse animation on the status dot when signal is "risk-on"

### 3.4 — Header & Navigation
- [ ] Add a proper sticky top nav with: Logo/Title left, "Last updated: X" center, status dot right
- [ ] Add a simple "About" or "Methodology" link that opens a modal/drawer explaining the data sources, signal logic, and what each metric means — this is what separates institutional from hobbyist tools
- [ ] Add "Data Sources" footer section crediting DeFi Llama and Dune Analytics with links

---

## Phase 4: Code Quality & Performance

### 4.1 — Architecture Cleanup
- [ ] Create a `constants/` directory with: `colors.ts` (color palette), `formatting.ts` (shared formatters like `formatTvl`, `formatUsd` — currently duplicated across 4+ files), `chart-config.ts` (shared tooltip styles, axis styles)
- [ ] Extract shared chart tooltip config — currently duplicated identically in 5 components
- [ ] Move the `STABLECOINS` set to a shared constants file (defined in both `signals.ts` and `LendingTable.tsx`)
- [ ] The `types/index.ts` file is empty — either populate it with shared types or remove it

### 4.2 — Performance
- [ ] Add `loading.tsx` and `error.tsx` Next.js conventions for better built-in loading/error handling
- [ ] The Dune API route has no caching beyond `Cache-Control` header — add in-memory caching with a TTL since Dune data is expensive to fetch
- [ ] Add `React.memo` to chart components that receive stable props
- [ ] Lazy-load the historical charts section (below the fold) with `dynamic(() => import(...), { ssr: false })`

### 4.3 — Data Validation
- [ ] Add null/undefined guards on all API response parsing — if DeFi Llama returns unexpected data shape, the app shouldn't crash
- [ ] Handle edge cases: what if 0 pools match the filter? Show an empty state, not a blank table

---

## Execution Order (Priority Sequence for Claude Code)

This is the recommended order to tackle these tasks. Each step builds on the previous.

**Step 1 — Foundation (do first, everything depends on this):**
1. Create `lib/constants.ts` with shared color palette, formatters, chart config
2. Update `globals.css` with the new CSS variable theme system
3. Swap fonts (add IBM Plex Mono + IBM Plex Sans or your chosen pair via `next/font/google`)
4. Apply `tabular-nums` and mono font to all numeric values

**Step 2 — Layout Restructure:**
5. Redesign the page layout in `page.tsx` — new grid structure, sticky header, compact signal banner
6. Redesign `MetricCards` — remove tradFi analog text (move to tooltip), bigger numbers, mono font, accent border
7. Redesign `SignalBanner` — compact strip with left-border accent style

**Step 3 — Table & Chart Overhaul:**
8. Overhaul `LendingTable` — protocol icons, hover states, sticky header, filter input, row styling
9. Unify all chart components to use shared config from `lib/constants.ts`
10. Add `CartesianGrid`, cursor hover, consistent colors across all charts
11. Add the yield spread column to the table

**Step 4 — New Analytical Views:**
12. Add yield curve comparison chart (borrow rates across protocols for same asset)
13. Add signal breakdown component showing threshold gauges
14. Add rate change delta indicators (▲/▼) on metric cards and table

**Step 5 — Polish:**
15. Loading states, error states, animations
16. Mobile responsive audit and fixes
17. About/methodology modal
18. Footer with data source credits

---

## Reference Dashboards for Aesthetic Benchmarking

When implementing, reference the look and feel of:
- **Token Terminal** (tokenterminal.com) — clean, data-dense, monospace numbers, dark theme done right
- **DefiLlama** (defillama.com) — table styling, protocol icons, chain badges
- **Coinglass** (coinglass.com) — signal banners, color-coded metrics, dense layout
- **Dune Dashboards** — chart styling, dark backgrounds, clean axis labels
- **Gauntlet Risk Dashboard** — institutional credit risk monitoring, clean metric cards

The goal is to land somewhere between Token Terminal's clean precision and Coinglass's information density — a dashboard that a crypto fund PM would keep open on a second monitor.