# AMG SYNC Frontend v3 — Changelog

## Fixed

- Removed dependency on `@phosphor-icons/react` from application code.
- Removed invalid `ChartCandlestick` named import that caused the Next.js build error.
- Navigation icons now come from the internal lightweight `Icon.tsx` SVG component.
- Every visible navigation/action button in the current prototype has a route or local interaction.

## Brand

- Product renamed visually to **AMG SYNC**.
- Added logo option #2: open sync-loop + orange active node.
- Added light/dark variants.
- Added app icon.
- Updated palette:
  - `#3D5300`
  - `#ABB97C`
  - `#FEE31A`
  - `#F0931A`

## Authorization / workspace prototype

- Role is no longer freely selectable.
- Mock login resolves organization memberships.
- Single-membership users go directly to their dashboard.
- Multi-membership users see only authorized workspace cards.
- Sidebar modules change by active workspace.
- AMG Group executive can switch across group/company workspaces.
- Board Viewer mode is identified in the top bar.

## Company-specific dashboard focus

- AMG Group: Control Tower
- PAM: breeding / DOC
- HYBRO: GPS / DOC PS
- GSU: farm production / harvest
- CIF: Feed AI / procurement / commodity price
- MPS: breeding feedmill / sourcing
- AMP: RPHU / sales / demand / distribution

## Architecture additions

Added frontend modules:
- Feed AI
- Feed Exchange
- Supplier Ranking
- Open Bid
- Demand Intelligence
- Smart Distribution
- Circular Protein Ecosystem
- TraceChain / Harvest Passport

## Candlestick

Upgraded to:
- 365 deterministic OHLC demo candles
- volume
- MA7 / MA14 / MA30
- H+7 forecast
- upper/lower forecast bounds
- markers
- crosshair
- OHLC tooltip
- 7H / 30H / 3B / 6B / 1T ranges

## Performance

- CSS gradients rather than large raster assets
- SVG logo/icon system
- no icon-library bundle for shell
- route-based Next.js page chunks
- only chart routes import Lightweight Charts
- bounded candle set per selected range
- no autoplay video, particle engine, or heavy blur effects
