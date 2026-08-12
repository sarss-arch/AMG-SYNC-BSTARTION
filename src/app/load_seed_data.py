"""
load_seed_data.py — feeds build_seed_data.py's ./json/ output into the
running FastAPI service via HTTP, instead of writing SQL directly.

Why go through the API rather than psql/COPY: the endpoints do the same
validation (Pydantic) and lookups (commodity_code -> id, get-or-create
province) that any future real ingestion will also go through, so the
seed load is a genuine end-to-end test of the ingestion path, not a
shortcut around it.

Run order matters:
  1. psql -f 01_schema.sql            (tables)
  2. psql -f 02_static_foundation.sql (commodities, suppliers — the
     lookup tables /ingest/* endpoints expect to already exist)
  3. python3 build_seed_data.py       (writes ./json/*.json)
  4. uvicorn app.main:app             (start the API)
  5. python3 scripts/load_seed_data.py   <- this script
"""
import json
import httpx

BASE_URL = "http://localhost:8000"
JSON_DIR = "json"


def post(client, path, payload):
    r = client.post(f"{BASE_URL}{path}", json=payload)
    r.raise_for_status()
    print(f"  {path}: {r.json()}")


def load_market_prices(client):
    for fname, code in [
        ("market_prices_broiler_layer.json", "BROILER"),
        ("market_prices_layer_eggs.json", "LAYER_EGG"),
    ]:
        with open(f"{JSON_DIR}/{fname}") as f:
            data = json.load(f)
        rows = [{"commodity_code": code, **r} for r in data["market_prices"]]
        post(client, "/ingest/market-prices", rows)


def load_price_candles(client):
    with open(f"{JSON_DIR}/market_prices_soybean_meal.json") as f:
        data = json.load(f)
    rows = [
        {"commodity_code": data["commodity_code"], "candle_time": r["candle_time"],
         "open": r["open"], "high": r["high"], "low": r["low"], "close": r["close"]}
        for r in data["price_candles"]
    ]
    post(client, "/ingest/price-candles", rows)


def load_supplier_offerings(client):
    with open(f"{JSON_DIR}/supplier_offerings_feed_ingredients.json") as f:
        data = json.load(f)
    rows = [
        {"supplier_code": o["supplier_code"], "commodity_code": o["commodity_code"],
         "offered_price_rp_per_kg": o["offered_price_rp_per_kg"],
         "available_capacity_kg": o.get("available_capacity_kg"),
         "lead_time_days": o.get("lead_time_days"),
         "observed_at": o["observed_at"]}
        for o in data["supplier_offerings"]
    ]
    post(client, "/ingest/supplier-offerings", rows)


def load_regional_protein(client):
    with open(f"{JSON_DIR}/regional_protein_consumption.json") as f:
        consumption = json.load(f)["regional_protein_consumption"]
    post(client, "/ingest/regional-protein-consumption", [
        {"province_code": r["province_code"], "province_name": r["province_name"],
         "year": r["year"],
         "protein_consumption_g_per_cap_day": r["protein_consumption_g_per_cap_day"]}
        for r in consumption
    ])

    with open(f"{JSON_DIR}/regional_priority_scores.json") as f:
        scores = json.load(f)["regional_priority_scores"]
    post(client, "/ingest/regional-priority-scores", [
        {"province_code": r["province_code"], "province_name": r["province_name"],
         "year": r["year"],
         "protein_consumption_g_per_cap_day": r["protein_consumption_g_per_cap_day"],
         "national_avg_g_per_cap_day": r["national_avg_g_per_cap_day"],
         "priority_score": r["priority_score"], "priority_rank": r["priority_rank"]}
        for r in scores
    ])


if __name__ == "__main__":
    with httpx.Client(timeout=60) as client:
        print("Loading market prices (broiler/layer)...")
        load_market_prices(client)
        print("Loading soybean meal price candles...")
        load_price_candles(client)
        print("Loading supplier offerings...")
        load_supplier_offerings(client)
        print("Loading regional protein consumption + priority scores...")
        load_regional_protein(client)
        print("\nDone — seed data loaded through the API.")