"""
schemas.py — request/response models. These mirror the JSON shapes that
build_seed_data.py already writes to ./json/, so the same objects can be
POSTed straight from that script's output OR from a live data source later.
"""
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from uuid import UUID


class MarketPriceIn(BaseModel):
    commodity_code: str
    observed_at: date
    price: float
    disparity_vs_het_pct: Optional[float] = None


class PriceCandleIn(BaseModel):
    commodity_code: str
    candle_time: date
    open: float
    high: float
    low: float
    close: float
    volume: Optional[float] = None


class SupplierOfferingIn(BaseModel):
    supplier_code: str
    commodity_code: str
    offered_price_rp_per_kg: float
    available_capacity_kg: Optional[float] = None
    lead_time_days: Optional[int] = None
    quality_score: Optional[float] = None
    observed_at: date


class ProvinceIn(BaseModel):
    province_code: str
    name: str


class RegionalProteinConsumptionIn(BaseModel):
    province_code: str
    province_name: str
    year: int
    protein_consumption_g_per_cap_day: float


class RegionalPriorityScoreIn(BaseModel):
    province_code: str
    province_name: str
    year: int
    protein_consumption_g_per_cap_day: float
    national_avg_g_per_cap_day: float
    priority_score: float
    priority_rank: int


class IngestResult(BaseModel):
    inserted: int
    skipped_existing: int = 0