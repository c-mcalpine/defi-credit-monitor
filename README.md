# DeFi Credit Market Monitor

A macro analysis dashboard for decentralized lending markets. It combines live lending pool data from DeFiLlama with 90-day historical on-chain event data from Dune Analytics to surface the same credit conditions — rates, utilization, leverage, and capital flows — that fixed-income analysts track in traditional markets, applied to DeFi.

**Live demo:** [add your Vercel URL here]

## Architecture

The monitor uses a two-layer data approach. DeFiLlama provides a real-time snapshot of lending pool metrics across major protocols, refreshed every 60 seconds via SWR. Dune Analytics supplies historical on-chain event data decoded from Aave V3 Ethereum contracts, cached at the CDN layer and refreshed hourly.

## Signals and methodology

### Live signals

| Signal | Metric | TradFi analog |
|--------|--------|---------------|
| **Stablecoin borrow rate** | TVL-weighted average borrow APY across USDC/USDT/DAI pools | Fed funds rate / money market rate — the cost of borrowing the ecosystem's base currency |
| **Utilization rate** | TVL-weighted ratio of borrowed assets to total deposits | Loan-to-deposit ratio — measures how aggressively the system is lending against its capital base |
| **Total value locked** | Aggregate USD deposits across tracked lending pools | Bank deposits / AUM — total capital allocated to DeFi lending as an asset class |

### Historical charts

| Chart | Metric | TradFi analog |
|-------|--------|---------------|
| **Daily liquidations** | Count of liquidation events and unique users liquidated per day | Margin call activity — spikes indicate cascading forced selling and systemic stress |
| **USDC borrow volume** | Daily USDC borrowing volume and transaction count | Commercial paper issuance / credit demand — rising volume signals leverage expansion |
| **Stablecoin net flows** | Daily net inflows minus outflows of USDC, USDT, and DAI | Money market fund flows — negative flows signal risk-off positioning and capital rotation out of lending |

## Data sources

- **DeFiLlama** — [Yields API](https://defillama.com/docs/api) for real-time lending pool data (TVL, borrow rates, utilization) across Aave, Compound, Spark, Morpho, and others
- **Dune Analytics** — Aave V3 Ethereum decoded contracts for historical liquidation events, borrow transactions, and stablecoin reserve flows

## Local development

Create a `.env.local` file with the following variables:

```
DUNE_API_KEY=your_dune_api_key
DUNE_LIQUIDATIONS_ID=your_liquidations_query_id
DUNE_BORROW_VOLUME_ID=your_borrow_volume_query_id
DUNE_STABLE_FLOWS_ID=your_stable_flows_query_id
```

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.
