"""
main.py — FastAPI ingestion service for the AMG SYNC dummy database.

Two ways this gets used:
  1. One-time seed load: run build_seed_data.py to produce ./json/*.json,
     then POST each file's contents to the matching /ingest/* endpoint
     (see scripts/load_seed_data.py — it does exactly this, in order).
  2. Ongoing real ingestion: point a real data source (a scraper, a
     partner feed, a manual entry form) at the same endpoints later.
     Nothing about the endpoints assumes "seed data" — that's only what
     scripts/load_seed_data.py happens to feed them today.

Deliberately NOT here: any endpoint that writes to model_versions,
forecast_runs, forecast_points, or recommendations. Per 01_schema.sql's
own comments, those tables must only be written by a real training run
or a real Decision Engine execution — never by an ingestion endpoint.
Wiring a POST /ingest/recommendations here would recreate exactly the
"hardcoded AI" trap the schema was written to avoid.
"""
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager

from . import db
from .schemas import (
    MarketPriceIn, PriceCandleIn, SupplierOfferingIn,
    ProvinceIn, RegionalProteinConsumptionIn, RegionalPriorityScoreIn,
    IngestResult,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(title="AMG SYNC Ingestion API", lifespan=lifespan)


# ---------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------
async def _commodity_id(conn, code: str) -> str:
    row = await conn.fetchrow("SELECT id FROM commodities WHERE code = $1", code)
    if not row:
        raise HTTPException(422, f"Unknown commodity_code '{code}' — seed commodities "
                                  f"via 02_static_foundation.sql first.")
    return row["id"]

async def _province_id(conn, code: str, name: str) -> str:
    row = await conn.fetchrow(
        "SELECT id FROM provinces WHERE province_code = $1 AND name = $2", code, name
    )
    if row:
        return row["id"]
    row = await conn.fetchrow(
        "INSERT INTO provinces (province_code, name) VALUES ($1, $2) RETURNING id",
        code, name,
    )
    return row["id"]


# ---------------------------------------------------------------------
# market prices / price candles / supplier offerings
# ---------------------------------------------------------------------
@app.post("/ingest/market-prices", response_model=IngestResult)
async def ingest_market_prices(rows: list[MarketPriceIn]):
    pool = db.get_pool()
    inserted = 0
    async with pool.acquire() as conn, conn.transaction():
        for r in rows:
            cid = await _commodity_id(conn, r.commodity_code)
            await conn.execute(
                """INSERT INTO market_prices (commodity_id, observed_at, price)
                   VALUES ($1, $2, $3)""",
                cid, r.observed_at, r.price,
            )
            inserted += 1
    return IngestResult(inserted=inserted)


@app.post("/ingest/price-candles", response_model=IngestResult)
async def ingest_price_candles(rows: list[PriceCandleIn]):
    pool = db.get_pool()
    inserted = 0
    async with pool.acquire() as conn, conn.transaction():
        for r in rows:
            cid = await _commodity_id(conn, r.commodity_code)
            await conn.execute(
                """INSERT INTO price_candles
                   (commodity_id, candle_time, open, high, low, close, volume)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)""",
                cid, r.candle_time, r.open, r.high, r.low, r.close, r.volume,
            )
            inserted += 1
    return IngestResult(inserted=inserted)


@app.post("/ingest/supplier-offerings", response_model=IngestResult)
async def ingest_supplier_offerings(rows: list[SupplierOfferingIn]):
    pool = db.get_pool()
    inserted = 0
    async with pool.acquire() as conn, conn.transaction():
        for r in rows:
            cid = await _commodity_id(conn, r.commodity_code)
            sup = await conn.fetchrow(
                "SELECT id FROM suppliers WHERE supplier_code = $1", r.supplier_code
            )
            if not sup:
                raise HTTPException(422, f"Unknown supplier_code '{r.supplier_code}'")
            await conn.execute(
                """INSERT INTO supplier_offerings
                   (supplier_id, commodity_id, offered_price, available_capacity,
                    lead_time_days, observed_at)
                   VALUES ($1, $2, $3, $4, $5, $6)""",
                sup["id"], cid, r.offered_price_rp_per_kg, r.available_capacity_kg,
                r.lead_time_days, r.observed_at,
            )
            inserted += 1
    return IngestResult(inserted=inserted)


# ---------------------------------------------------------------------
# regional protein consumption / priority scores
# ---------------------------------------------------------------------
@app.post("/ingest/provinces", response_model=IngestResult)
async def ingest_provinces(rows: list[ProvinceIn]):
    pool = db.get_pool()
    inserted = 0
    async with pool.acquire() as conn, conn.transaction():
        for r in rows:
            res = await conn.execute(
                """INSERT INTO provinces (province_code, name) VALUES ($1, $2)
                   ON CONFLICT (province_code, name) DO NOTHING""",
                r.province_code, r.name,
            )
            if res.endswith("1"):
                inserted += 1
    return IngestResult(inserted=inserted, skipped_existing=len(rows) - inserted)


@app.post("/ingest/regional-protein-consumption", response_model=IngestResult)
async def ingest_protein_consumption(rows: list[RegionalProteinConsumptionIn]):
    pool = db.get_pool()
    inserted = 0
    async with pool.acquire() as conn, conn.transaction():
        for r in rows:
            pid = await _province_id(conn, r.province_code, r.province_name)
            res = await conn.execute(
                """INSERT INTO regional_protein_consumption
                   (province_id, year, protein_consumption_g_per_cap_day)
                   VALUES ($1, $2, $3)
                   ON CONFLICT (province_id, year) DO UPDATE
                     SET protein_consumption_g_per_cap_day = EXCLUDED.protein_consumption_g_per_cap_day""",
                pid, r.year, r.protein_consumption_g_per_cap_day,
            )
            inserted += 1
    return IngestResult(inserted=inserted)


@app.post("/ingest/regional-priority-scores", response_model=IngestResult)
async def ingest_priority_scores(rows: list[RegionalPriorityScoreIn]):
    pool = db.get_pool()
    inserted = 0
    async with pool.acquire() as conn, conn.transaction():
        for r in rows:
            pid = await _province_id(conn, r.province_code, r.province_name)
            await conn.execute(
                """INSERT INTO regional_priority_scores
                   (province_id, year, protein_consumption_g_per_cap_day,
                    national_avg_g_per_cap_day, priority_score, priority_rank)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   ON CONFLICT (province_id, year) DO UPDATE
                     SET priority_score = EXCLUDED.priority_score,
                         priority_rank = EXCLUDED.priority_rank""",
                pid, r.year, r.protein_consumption_g_per_cap_day,
                r.national_avg_g_per_cap_day, r.priority_score, r.priority_rank,
            )
            inserted += 1
    return IngestResult(inserted=inserted)


# ---------------------------------------------------------------------
# read side — this is what a training job pulls FROM, after ingestion
# ---------------------------------------------------------------------
@app.get("/training-data/priority-scores")
async def get_priority_scores(year: int | None = None):
    """Feature table for a priority-allocation model: one row per
    province-year, ready to join against supply/inventory data."""
    pool = db.get_pool()
    async with pool.acquire() as conn:
        if year:
            rows = await conn.fetch(
                """SELECT p.province_code, p.name, s.year,
                          s.protein_consumption_g_per_cap_day,
                          s.national_avg_g_per_cap_day,
                          s.priority_score, s.priority_rank
                   FROM regional_priority_scores s
                   JOIN provinces p ON p.id = s.province_id
                   WHERE s.year = $1
                   ORDER BY s.priority_rank""",
                year,
            )
        else:
            rows = await conn.fetch(
                """SELECT p.province_code, p.name, s.year,
                          s.protein_consumption_g_per_cap_day,
                          s.national_avg_g_per_cap_day,
                          s.priority_score, s.priority_rank
                   FROM regional_priority_scores s
                   JOIN provinces p ON p.id = s.province_id
                   ORDER BY s.year, s.priority_rank"""
            )
        return [dict(r) for r in rows]