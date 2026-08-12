"""
build_seed_data.py
Parses the 3 uploaded CSVs into real, dated JSON series, and generates
reasonable-estimate SUPPLIER_OFFERINGS for Maggot/BSF, Dedak, and Spirulina
(no public price source exists for these three — see README.md for the
grounding/assumption behind each number).

Run once: python3 build_seed_data.py
Writes all files into ./json/ and prints a summary.
"""
import csv, json, uuid, random
from datetime import date, timedelta

random.seed(42)
OUT = "json"

def uid():
    return str(uuid.uuid4())

# =====================================================================
# 1. BROILER & LAYER — real data, harga_pangan_data.csv (Kemendag/BI-style)
# =====================================================================
month_map = {"Jul": 7, "Aug": 8}
def parse_tanggal(s, year=2026):
    day, mon = s.strip().split()
    return date(year, month_map[mon], int(day))

broiler, layer = [], []
with open('/mnt/user-data/uploads/harga_pangan_data.csv') as f:
    for r in csv.DictReader(f):
        d = parse_tanggal(r["Tanggal"])
        broiler.append({
            "observed_at": d.isoformat(),
            "price": int(r["Daging Ayam Ras (Rp)"]),
            "disparity_vs_het_pct": float(r["Disparitas HET/HA Daging Ayam (%)"]),
        })
        layer.append({
            "observed_at": d.isoformat(),
            "price": int(r["Telur Ayam Ras (Rp)"]),
            "disparity_vs_het_pct": float(r["Disparitas HET/HA Telur Ayam (%)"]),
        })

with open(f"{OUT}/market_prices_broiler_layer.json", "w") as f:
    json.dump({
        "_provenance": "REAL — parsed from uploaded harga_pangan_data.csv "
                        "(Kemendag/BI-style regional food price monitoring). "
                        "Year 2026 assumed (not in source file; matches "
                        "conversation date and soybean data's 'current Aug 12').",
        "commodity_code": "BROILER",
        "commodity_name": "Daging Ayam Ras (Broiler)",
        "unit": "Rp/kg",
        "market_prices": broiler,
    }, f, indent=2)

with open(f"{OUT}/market_prices_layer_eggs.json", "w") as f:
    json.dump({
        "_provenance": "REAL — parsed from uploaded harga_pangan_data.csv.",
        "commodity_code": "LAYER_EGG",
        "commodity_name": "Telur Ayam Ras",
        "unit": "Rp/kg",
        "market_prices": layer,
    }, f, indent=2)

print(f"Broiler: {len(broiler)} rows, {broiler[0]['observed_at']} to {broiler[-1]['observed_at']}")
print(f"Layer:   {len(layer)} rows, {layer[0]['observed_at']} to {layer[-1]['observed_at']}")

# =====================================================================
# 2. SOYBEAN MEAL — real data, two CSVs (daily approx + intraday snapshot)
# =====================================================================
FX_USD_IDR = 17800  # BI mid-rate reference, 11 Aug 2026 — update before real use
SHORT_TON_KG = 907.185

daily_rows = []
with open('/mnt/user-data/uploads/soybean_meal_daily_approx.csv') as f:
    for r in csv.DictReader(f):
        daily_rows.append(r)

start = date(2026, 7, 14)  # candle 1 -> Jul 14; candle 29 -> Aug 11 (exact
                            # calendar-day match to harga_pangan_data's window)
sbm_candles = []
for r in daily_rows:
    idx = int(r["candle_index"])
    if idx > 30:
        continue  # 31/32 are overlapping intraday re-reads of Aug 12 — see snapshot file instead
    d = start + timedelta(days=idx - 1) if idx <= 29 else date(2026, 8, 12)
    close_ust = float(r["close_est"])
    idr_cbot_equiv = round((close_ust / SHORT_TON_KG) * FX_USD_IDR)
    row = {
        "candle_time": d.isoformat(),
        "open": float(r["open_est"]), "high": float(r["high_est"]),
        "low": float(r["low_est"]), "close": close_ust,
        "unit": "USD/short_ton",
        "close_idr_per_kg_cbot_equiv": idr_cbot_equiv,
    }
    if idx == 30:
        row["note"] = "Aug 12 candle as of data capture time (partial/current trading day)"
    sbm_candles.append(row)

with open('/mnt/user-data/uploads/soybean_meal_intraday_indicators_snapshot.csv') as f:
    indicators = {r["indicator"]: {"value": r["value"], "note": r["note"]} for r in csv.DictReader(f)}

with open(f"{OUT}/market_prices_soybean_meal.json", "w") as f:
    json.dump({
        "_provenance": "REAL — parsed from uploaded soybean_meal_daily_approx.csv "
                        "(CBOT-style chart reading). candle_index 1-29 mapped to "
                        "calendar days 2026-07-14 to 2026-08-11 (29-day span matches "
                        "exactly). candle 30 = 2026-08-12 partial day. Candles 31/32 "
                        "from the source file were dropped as redundant intraday "
                        "re-reads of Aug 12 — see market_prices_soybean_meal_intraday_snapshot.json instead.",
        "commodity_code": "SBM",
        "commodity_name": "Soybean Meal (CBOT benchmark)",
        "unit": "USD/short_ton",
        "fx_usd_idr_used": FX_USD_IDR,
        "fx_source_note": "Bank Indonesia USD/IDR mid rate, 11 Aug 2026. "
                           "close_idr_per_kg_cbot_equiv is the RAW commodity-equivalent "
                           "price only — it excludes import duty, freight, and "
                           "distributor margin. Do not use it directly as a domestic "
                           "purchase price; use supplier_offerings_feed_ingredients.json "
                           "for that.",
        "price_candles": sbm_candles,
    }, f, indent=2)

with open(f"{OUT}/market_prices_soybean_meal_intraday_snapshot.json", "w") as f:
    json.dump({
        "_provenance": "REAL — parsed from uploaded soybean_meal_intraday_indicators_snapshot.csv. "
                        "A single point-in-time snapshot (Aug 9-12 window), not a time series. "
                        "Useful as ready-made technical-indicator features (SMA/Bollinger/MACD/"
                        "support-resistance) to validate your own feature-engineering code against.",
        "commodity_code": "SBM",
        "as_of": "2026-08-12",
        "indicators": indicators,
    }, f, indent=2)

print(f"Soybean meal: {len(sbm_candles)} daily candles, {sbm_candles[0]['candle_time']} to {sbm_candles[-1]['candle_time']}")
print(f"  latest close: {sbm_candles[-1]['close']} USD/short_ton  ~= Rp {sbm_candles[-1]['close_idr_per_kg_cbot_equiv']}/kg (CBOT-equivalent, pre-markup)")

# =====================================================================
# 3. SUPPLIER_OFFERINGS — quality / price / availability / lead time
#    across all 4 feed ingredients. SBM is real-anchored (with a stated,
#    labeled markup assumption). Maggot/BSF, Dedak, Spirulina have NO
#    public price source — every number below is an estimate, and each
#    is labeled with exactly how confident/grounded it is. See README.md
#    "Grounding notes" before trusting these for a real purchase decision.
# =====================================================================

SUPPLIERS = [
    {"code": "SUP-SBM-01", "name": "PT Sumber Protein Nusantara", "type": "importer_distributor"},
    {"code": "SUP-SBM-02", "name": "PT Agro Pakan Sejahtera",      "type": "distributor"},
    {"code": "SUP-DDK-01", "name": "Koperasi Penggilingan Padi Makmur", "type": "local_mill"},
    {"code": "SUP-DDK-02", "name": "UD Dedak Jaya Sentosa",        "type": "local_mill"},
    {"code": "SUP-BSF-01", "name": "PT BioMagg Indonesia",          "type": "bsf_producer"},
    {"code": "SUP-BSF-02", "name": "Koperasi Maggot Mandiri Jaya",  "type": "bsf_producer"},
    {"code": "SUP-SPR-01", "name": "PT Alga Nutrisi Indonesia",     "type": "specialty_producer"},
]

def jitter(base, pct):
    return round(base * (1 + random.uniform(-pct, pct)))

sbm_landed_base = sbm_candles[-1]["close_idr_per_kg_cbot_equiv"] * 1.35  # +35% illustrative
# import duty + freight + distributor margin — REPLACE with a real supplier
# quote as soon as you have one; this is the least-defensible number in the
# SBM chain specifically because it's a markup assumption, not sourced data.

offerings = []
today = date(2026, 8, 12)

# --- Soybean Meal: 2 suppliers, price anchored to real CBOT data ---
for sup, base_mult, cap, lead in [
    ("SUP-SBM-01", 1.00, 40000, 21),   # importer: cheaper, longer lead time
    ("SUP-SBM-02", 1.06, 15000, 7),    # local distributor: pricier, faster
]:
    offerings.append({
        "supplier_code": sup, "commodity_code": "SBM",
        "offered_price_rp_per_kg": jitter(sbm_landed_base * base_mult, 0.03),
        "available_capacity_kg": cap,
        "lead_time_days": lead,
        "quality_score": round(random.uniform(82, 93), 1),
        "quality_basis": "Estimated — protein ~46-48% typical for imported SBM; "
                          "verify actual lab COA per shipment before trusting this score.",
        "price_grounding": "DERIVED from real CBOT close (soybean_meal_daily_approx.csv) "
                            "+ 35% illustrative import/freight/margin markup. Replace the "
                            "35% with a real quote as soon as one exists.",
        "observed_at": today.isoformat(),
    })

# --- Dedak (rice bran): 2 local suppliers, seasonal, short lead time ---
# Grounding: general market knowledge of Indonesian dedak padi pricing
# (roughly Rp 3,000-4,500/kg domestically), NOT a cited source — treat as a
# rough planning estimate only.
for sup, base, cap, lead in [
    ("SUP-DDK-01", 3400, 8000, 2),
    ("SUP-DDK-02", 3650, 5000, 1),
]:
    offerings.append({
        "supplier_code": sup, "commodity_code": "DDK",
        "offered_price_rp_per_kg": jitter(base, 0.08),
        "available_capacity_kg": cap,
        "lead_time_days": lead,
        "quality_score": round(random.uniform(60, 82), 1),  # wide range — fiber/moisture/rancidity vary a lot
        "quality_basis": "ESTIMATED — no lab data. Rice bran quality is genuinely "
                          "inconsistent across small mills (crude fiber %, oil content, "
                          "and rancidity risk from age all vary) — the wide/mediocre "
                          "score range reflects that reality, it is not noise.",
        "price_grounding": "ESTIMATED from general market knowledge, not a cited source. "
                            "Verify against a real quote before relying on this number.",
        "observed_at": today.isoformat(),
    })

# --- Maggot/BSF meal: 2 producers, price grounded in earlier research this
# session (dried BSF meal ~Rp30,000-40,000/kg, 40-60% crude protein),
# capacity-limited (small-batch producers), moderate lead time ---
for sup, base, cap, lead, q in [
    ("SUP-BSF-01", 34000, 800, 10, 88),   # more established producer
    ("SUP-BSF-02", 31000, 350, 14, 76),   # smaller/newer cooperative
]:
    offerings.append({
        "supplier_code": sup, "commodity_code": "BSF",
        "offered_price_rp_per_kg": jitter(base, 0.06),
        "available_capacity_kg": cap,
        "lead_time_days": lead,
        "quality_score": q,
        "quality_basis": "PARTIALLY GROUNDED — price range (Rp30-40k/kg, 40-60% crude "
                          "protein) is from real BSF-meal market research found earlier "
                          "in this project; the specific quality_score per supplier is "
                          "still an estimate, not a lab result.",
        "price_grounding": "PARTIALLY GROUNDED — Rp30,000-40,000/kg range is a real "
                            "market figure for dried BSF meal; exact per-supplier price "
                            "and capacity are illustrative.",
        "observed_at": today.isoformat(),
    })

# --- Spirulina: 1 specialty producer, highest price, sparse/long lead time,
# LEAST grounded of the four — no researched source at all ---
offerings.append({
    "supplier_code": "SUP-SPR-01", "commodity_code": "SPR",
    "offered_price_rp_per_kg": jitter(110000, 0.15),
    "available_capacity_kg": 120,
    "lead_time_days": 25,
    "quality_score": round(random.uniform(78, 92), 1),
    "quality_basis": "ESTIMATED — no source found for feed-grade spirulina pricing in "
                      "Indonesia specifically. This is the weakest-grounded number in "
                      "the whole dataset; treat it as a placeholder order-of-magnitude, "
                      "not a planning figure, until you get a real quote.",
    "price_grounding": "UNGROUNDED ESTIMATE — no public or researched source. "
                        "Human/nutraceutical-grade spirulina retails far higher "
                        "(Rp150k-300k+/kg); this assumes a lower feed-grade tier, "
                        "which is itself an assumption, not a finding.",
    "observed_at": today.isoformat(),
})

with open(f"{OUT}/supplier_offerings_feed_ingredients.json", "w") as f:
    json.dump({
        "_provenance": "MIXED — see price_grounding/quality_basis per row. SBM rows "
                        "derive from real CBOT data plus a labeled markup assumption. "
                        "DDK and BSF rows are partially grounded in general/researched "
                        "market knowledge. SPR rows are an ungrounded placeholder — "
                        "replace before using in any real decision.",
        "suppliers": SUPPLIERS,
        "supplier_offerings": offerings,
    }, f, indent=2)

print(f"\nSupplier offerings: {len(offerings)} rows across {len(SUPPLIERS)} suppliers, 4 commodities")
for o in offerings:
    print(f"  {o['commodity_code']:5} {o['supplier_code']:12} Rp{o['offered_price_rp_per_kg']:>8,}/kg  "
          f"cap={o['available_capacity_kg']:>6}kg  lead={o['lead_time_days']:>2}d  q={o['quality_score']}")

# =====================================================================
# 4. POULTRY OPERATIONS — small synthetic sample (3 flock batches), NOT
#    meant as AI training depth (that needs real farm history we don't
#    have yet, I cant find spirulina, dedak, and maggots data) — this exists only so FK-dependent tables have something
#    to reference and the frontend has non-empty screens to render.
# =====================================================================
flock_batches, farm_metrics, harvest_plans = [], [], []
placement_dates = [date(2026, 6, 1), date(2026, 6, 15), date(2026, 7, 1)]
for i, pdate in enumerate(placement_dates):
    batch_id = uid()
    doc_qty = random.choice([10000, 15000, 20000])
    flock_batches.append({
        "id": batch_id, "batch_code": f"FLK-2026-{i+1:03d}",
        "doc_quantity": doc_qty, "placement_date": pdate.isoformat(),
        "status": "GROWING" if pdate == placement_dates[-1] else "HARVESTED",
    })
    for age in range(0, min((today - pdate).days, 35) + 1, 5):
        mdate = pdate + timedelta(days=age)
        fcr = round(1.2 + age * 0.018 + random.uniform(-0.03, 0.03), 2)  # FCR degrades with age
        mortality_spike = 0.008 if age <= 5 else 0.001  # early-cycle mortality spike
        farm_metrics.append({
            "flock_batch_id": batch_id, "metric_date": mdate.isoformat(),
            "age_day": age,
            "feed_consumption_kg": round(doc_qty * 0.02 * (age + 1), 1),
            "mortality_rate": round(random.uniform(0, mortality_spike), 4),
            "average_live_weight_kg": round(0.04 + age * 0.052, 3),
            "fcr": fcr,
        })
    if pdate != placement_dates[-1]:
        harvest_plans.append({
            "flock_batch_id": batch_id,
            "planned_harvest_date": (pdate + timedelta(days=32)).isoformat(),
            "planned_volume_kg": round(doc_qty * 0.97 * 1.85),  # ~97% survival * ~1.85kg avg
            "status": "COMPLETED",
        })

with open(f"{OUT}/poultry_operations_sample.json", "w") as f:
    json.dump({
        "_provenance": "SYNTHETIC SAMPLE ONLY — 3 illustrative flock batches so "
                        "FK-dependent tables and frontend screens have data to show. "
                        "This is NOT sufficient depth for training a real Production/"
                        "Harvest model (PRD P1) — that needs real AMG farm history.",
        "flock_batches": flock_batches,
        "farm_daily_metrics": farm_metrics,
        "harvest_plans": harvest_plans,
    }, f, indent=2)
print(f"\nPoultry ops (synthetic sample): {len(flock_batches)} batches, {len(farm_metrics)} daily metrics, {len(harvest_plans)} harvest plans")

# =====================================================================
# 5. DEMAND — small synthetic sample, 3 regions
# =====================================================================
demand_nodes = [
    {"node_code": "DMD-JKT", "name": "Jabodetabek Retail", "segment": "modern_retail", "region": "DKI Jakarta", "estimated_population": 30000000},
    {"node_code": "DMD-SBY", "name": "Surabaya Traditional Market", "segment": "traditional_market", "region": "Jawa Timur", "estimated_population": 3000000},
    {"node_code": "DMD-BDG", "name": "Bandung Modern Retail", "segment": "modern_retail", "region": "Jawa Barat", "estimated_population": 2500000},
]
demand_forecasts = []
for n in demand_nodes:
    base_qty = {"DMD-JKT": 45000, "DMD-SBY": 18000, "DMD-BDG": 15000}[n["node_code"]]
    for wk in range(4):
        demand_forecasts.append({
            "demand_node_code": n["node_code"],
            "product": "broiler_carcass",
            "period_start": (today + timedelta(weeks=wk)).isoformat(),
            "forecast_quantity_kg": jitter(base_qty, 0.08),
            "confidence": round(random.uniform(0.65, 0.85), 2),
        })

with open(f"{OUT}/demand_distribution_sample.json", "w") as f:
    json.dump({
        "_provenance": "SYNTHETIC SAMPLE ONLY — 3 illustrative demand nodes, 4-week "
                        "forward forecast each. Replace with real order/POS data before "
                        "using for an actual Sales Allocation decision (PRD P1).",
        "demand_nodes": demand_nodes,
        "demand_forecasts": demand_forecasts,
    }, f, indent=2)
print(f"Demand (synthetic sample): {len(demand_nodes)} nodes, {len(demand_forecasts)} forecast rows")

# =====================================================================
# 6. REGIONAL PROTEIN CONSUMPTION — real data, 1778576244.csv
#    (BPS/Susenas-style, gram/kapita/hari, 34-38 provinces x 2018-2025).
#    Builds a priority_score per province/year: lower protein consumption
#    -> higher score -> higher allocation priority. This is the real
#    dataset meant to train/ground the "prioritize the region with the
#    lower score" behavior — not a synthetic stand-in like section 5.
#
#    NOTE — province_code reuse: BPS renumbered/redistricted Papua in
#    2022. Code 91 = "Papua Barat" through 2023, then "Papua" from 2024.
#    Code 94 = "Papua" through 2023, then "Papua Tengah" from 2024. New
#    codes 92/93/95/96 appear only from 2024 (the split-off provinces).
#    So provinces are keyed on (code, name), NOT code alone — a naive
#    dedupe on code would silently merge two different provinces.
# =====================================================================
provinces_seen = {}  # (code, name) -> uid
protein_rows = []
with open('/mnt/user-data/uploads/1778576244.csv') as f:
    for r in csv.DictReader(f):
        code = r["Kode Provinsi"].strip()
        name = r["Nama Provinsi"].strip()
        key = (code, name)
        if key not in provinces_seen:
            provinces_seen[key] = uid()
        protein_rows.append({
            "province_code": code,
            "province_name": name,
            "province_uid": provinces_seen[key],
            "year": int(r["Tahun"]),
            "protein_consumption_g_per_cap_day": float(r["Konsumsi Protein (gram/kap/hari)"]),
        })

provinces_out = [{"id": pid, "province_code": c, "name": n} for (c, n), pid in provinces_seen.items()]

# priority score per year: higher score = lower consumption = higher
# priority. Scored against that year's own national average (the set of
# provinces reporting changes in 2024 due to the Papua split, so scoring
# within-year keeps it fair rather than comparing across a shifting
# province list).
by_year = {}
for row in protein_rows:
    by_year.setdefault(row["year"], []).append(row)

priority_scores = []
for yr, rows in sorted(by_year.items()):
    avg = sum(r["protein_consumption_g_per_cap_day"] for r in rows) / len(rows)
    scored = []
    for r in rows:
        score = max(0.0, round(avg - r["protein_consumption_g_per_cap_day"], 2))
        scored.append({**r, "national_avg_g_per_cap_day": round(avg, 2), "priority_score": score})
    scored.sort(key=lambda x: -x["priority_score"])
    for rank, r in enumerate(scored, start=1):
        r["priority_rank"] = rank
    priority_scores.extend(scored)

with open(f"{OUT}/provinces.json", "w") as f:
    json.dump({
        "_provenance": "REAL — derived from uploaded 1778576244.csv (BPS/Susenas-style "
                        "provincial protein consumption). Keyed on (province_code, name) "
                        "because BPS reused numeric codes after the 2022 Papua "
                        "redistricting — see build_seed_data.py comments.",
        "provinces": provinces_out,
    }, f, indent=2)

with open(f"{OUT}/regional_protein_consumption.json", "w") as f:
    json.dump({
        "_provenance": "REAL — parsed directly from uploaded 1778576244.csv, no "
                        "transformation besides typing. gram/kapita/hari, 2018-2025.",
        "unit": "gram/kapita/hari",
        "regional_protein_consumption": [
            {"province_uid": r["province_uid"], "province_code": r["province_code"],
             "province_name": r["province_name"], "year": r["year"],
             "protein_consumption_g_per_cap_day": r["protein_consumption_g_per_cap_day"]}
            for r in protein_rows
        ],
    }, f, indent=2)

with open(f"{OUT}/regional_priority_scores.json", "w") as f:
    json.dump({
        "_provenance": "REAL data, DERIVED score. protein_consumption values are real "
                        "(1778576244.csv); priority_score/priority_rank are computed here "
                        "as (that year's national average minus this province's "
                        "consumption, floored at 0) — this is the concrete signal meant "
                        "to train/evaluate 'prioritize the region with the lower score.' "
                        "Scored within-year to stay fair across the 2024 Papua province "
                        "split (see build_seed_data.py comments).",
        "scoring_method": "priority_score = max(0, national_avg_g_per_cap_day - "
                           "protein_consumption_g_per_cap_day); priority_rank 1 = lowest "
                           "consumption = highest priority that year.",
        "regional_priority_scores": [
            {k: v for k, v in r.items() if k != "province_name"} | {"province_name": r["province_name"]}
            for r in priority_scores
        ],
    }, f, indent=2)

latest_year = max(by_year)
lowest_latest = min(by_year[latest_year], key=lambda r: r["protein_consumption_g_per_cap_day"])
print(f"\nRegional protein consumption: {len(provinces_out)} distinct (code,name) provinces, "
      f"{len(protein_rows)} province-year rows, {min(by_year)}-{latest_year}")
print(f"  lowest {latest_year} consumption (highest priority): "
      f"{lowest_latest['province_name']} — {lowest_latest['protein_consumption_g_per_cap_day']} g/kap/hari")

print("\nDone. All files written to ./json/")
