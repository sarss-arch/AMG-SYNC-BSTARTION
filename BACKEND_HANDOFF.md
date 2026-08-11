# Backend / AI Handoff Contract

Frontend is currently mock-driven.

## Authentication

Target:

`POST /auth/login`

`GET /auth/me`

Expected `/auth/me` shape:

```json
{
  "user": {
    "id": "USR-001",
    "name": "Rina Putri",
    "email": "rina@cif.manggis.id"
  },
  "memberships": [
    {
      "organization": {
        "id": "CIF",
        "name": "PT Citra Ina Feedmill",
        "type": "FEEDMILL"
      },
      "role": {
        "code": "PROCUREMENT_MANAGER",
        "name": "Manajer Procurement"
      },
      "permissions": [
        "VIEW_MARKET",
        "VIEW_FORECAST",
        "RUN_SIMULATION",
        "CREATE_BUY_REQUEST",
        "APPROVE_BUY"
      ],
      "dataScope": ["CIF", "SHARED_GROUP_FEED_DEMAND"]
    }
  ]
}
```

## Market

`GET /market/{item}/candles?range=90d`

Expected candle:

```json
{
  "time": "2026-08-11",
  "open": 5688,
  "high": 5824,
  "low": 5652,
  "close": 5750,
  "volume": 1672
}
```

## Forecast

`GET /ai/forecast?item=corn&horizon=7`

```json
{
  "currentPrice": 5750,
  "points": [
    {
      "time": "2026-08-18",
      "p10": 5940,
      "p50": 6210,
      "p90": 6380
    }
  ],
  "volatility": "LOW",
  "confidence": 0.84
}
```

## Decision

`GET /decisions/{id}`

```json
{
  "decisionDomain": "PROCUREMENT",
  "action": "BUY",
  "item": "CORN",
  "recommendedQuantity": 500,
  "unit": "TON",
  "confidence": 0.84,
  "risk": "LOW",
  "executionWindow": {
    "start": "2026-08-11",
    "end": "2026-08-12"
  },
  "reasons": []
}
```

## Feed Exchange

`POST /bids`

`GET /bids/{id}/supplier-offers`

`POST /bids/{id}/select`

Supplier offer should include:
- price
- capacity
- delivery lead time
- quality score
- delivery reliability
- historical performance
- overall supplier score

## Demand Intelligence

`GET /demand/segments`

`GET /demand/allocations`

## Smart Distribution

`GET /distribution/recommendations`

`POST /distribution/dispatch-request`

## Traceability

`GET /batches`

`GET /batches/{batchId}`

`POST /batches/{batchId}/events`

`GET /public/passport/{batchId}`

## Security principle

The backend must authorize and filter data **before** AI inference or data response.
Frontend permission checks are UX only, not a security boundary.
