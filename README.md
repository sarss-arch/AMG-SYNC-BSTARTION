# AMG SYNC

Frontend prototype terbaru untuk **AMG SYNC — Decision Intelligence Platform**.

## Stack

- Next.js App Router
- TypeScript
- Component-based architecture
- Lightweight Charts v5 untuk candlestick OHLC
- Mock service/data layer
- Mock session + workspace membership
- CSS design tokens, gradients, dan SVG ringan
- Tidak menggunakan icon package eksternal untuk shell/navigation, sehingga error named-export seperti `ChartCandlestick` tidak terjadi lagi

## Logo

Logo yang dipakai adalah konsep nomor 2:
- open synchronization loop
- satu active node berwarna orange
- filosofi: data lintas perusahaan terus tersinkron, tetapi setiap user tetap masuk melalui node/workspace yang terotorisasi

Asset:
- `public/amg-sync-mark.svg`
- `public/amg-sync-mark-inverse.svg`
- `src/components/brand/AmgSyncLogo.tsx`
- `src/app/icon.svg`

## Color palette

- Dark olive: `#3D5300`
- Sage: `#ABB97C`
- Yellow: `#FEE31A`
- Orange: `#F0931A`

## Mock login

Password semua akun demo: `demo1234`

### Group Executive
`executive@amgsync.id`

Akses:
- AMG Group
- seluruh company workspace sebagai Board Viewer

Karena memiliki lebih dari satu membership, akun ini masuk ke Workspace Selector.

### Procurement Manager
`procurement@amgsync.id`

Workspace:
- PT Citra Ina Feedmill

Langsung masuk ke dashboard CIF setelah login.

### Farm Manager
`farm@amgsync.id`

Workspace:
- PT Gunung Sari Utama

### Sales Manager
`sales@amgsync.id`

Workspace:
- PT Argo Makmur Proteindo

> Role tidak dipilih bebas. Pada backend production, struktur ini akan berasal dari `/auth/me` + organization membership + permission + data scope.

## Workspace yang disiapkan

- AMG Group
- PT Peternakan Ayam Manggis
- PT Hybro Indonesia
- PT Gunung Sari Utama
- PT Citra Ina Feedmill
- PT Megah Prayasa Santosa
- PT Argo Makmur Proteindo

Dashboard, menu, KPI, dan decision focus berubah sesuai workspace.

## Modul

### Control Tower
- Ringkasan
- Pusat Keputusan
- Intelijen Pasar

### Intelligence
- Feed AI
- Feed Exchange / Open Bid
- Demand Intelligence
- Smart Distribution

### Operations
- Procurement
- Produksi
- Harvest
- RPHU
- Inventory
- Penjualan

### Trust & Control
- TraceChain
- Circular Ecosystem
- Persetujuan
- Kinerja Model
- Sumber Data
- Admin

## Feed AI

Flow:
`PREDICT → COMPARE → BID → BUY`

Mencakup:
- forecast kebutuhan
- forecast harga
- inventory
- alternative feed comparison
- BUY / WAIT / HOLD
- supplier bidding
- supplier score
- purchase-order simulation

## Supplier score demo

Bobot:
- 30% Price
- 25% Quality
- 20% Supply Capacity
- 15% Delivery Reliability
- 10% Historical Performance

Best Value tidak selalu sama dengan cheapest price.

## Candlestick

File:
`src/components/market/CandlestickChart.tsx`

Library:
`lightweight-charts`

Input:
```ts
{
  time,
  open,
  high,
  low,
  close,
  volume
}
```

Chart:
- real candlestick bodies + wicks
- volume
- MA7
- MA14
- MA30
- H+7 forecast
- upper/lower forecast range
- annotated events
- crosshair
- OHLC tooltip
- 7H / 30H / 3B / 6B / 1T

Data prototype disimpan sebagai deterministic `DEMO / MOCK DATA`.

## Performance principles

Frontend ini sengaja menghindari visual berat:
- gradient memakai CSS
- logo/ornament memakai SVG
- tidak memakai video background
- tidak memakai raster background besar
- chart hanya dimuat pada route yang membutuhkannya
- timeframe hanya merender subset OHLC yang diperlukan
- route App Router terpisah sehingga bundle tidak menjadi satu file aplikasi raksasa
- motion dibuat minimal
- tidak memakai glassmorphism/blur berat

Target saat production:
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- lazy load data/chart berat
- pagination untuk tabel besar
- backend caching dan conditional refresh
- gambar produk via `next/image` bila nanti ditambahkan

## Menjalankan

Pastikan Node.js modern sudah tersedia.

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Build check

```bash
npm run typecheck
npm run build
```

## Integrasi backend berikutnya

Ganti implementasi mock pada:

- `src/services/market.service.ts`
- `src/services/decision.service.ts`
- `src/services/approval.service.ts`
- `src/services/traceability.service.ts`

dengan API FastAPI.

Contoh target:

```text
GET /auth/me
GET /market/{id}/candles
GET /ai/forecast
GET /decisions
POST /simulation
POST /approvals/{id}/approve
```

Backend tetap menjadi authority untuk authentication, authorization, permission, dan data scope.
