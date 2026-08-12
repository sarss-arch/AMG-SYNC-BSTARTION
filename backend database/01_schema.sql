-- =====================================================================
-- 01_schema.sql — AMG SYNC dummy database, full schema
-- Matches AMG_SYNC_Master_ERD.png, all 8 sections.
-- Run first: psql -U postgres -d amg_sync -f sql/01_schema.sql
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============ 1. IDENTITY · ORGANIZATION · ACCESS ============
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES organizations(id),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  organization_type TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  scope_type TEXT
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  module TEXT
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  role_id UUID REFERENCES roles(id),
  status TEXT DEFAULT 'ACTIVE'
);

CREATE TABLE organization_data_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_org_id UUID REFERENCES organizations(id),
  consumer_org_id UUID REFERENCES organizations(id),
  resource_code TEXT,
  access_level TEXT
);

-- ============ 2. MASTER DATA · INTEGRATION ============
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_org_id UUID REFERENCES organizations(id),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  facility_type TEXT,
  capacity NUMERIC
);

CREATE TABLE commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  default_unit TEXT
);

CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  code TEXT UNIQUE NOT NULL,
  source_type TEXT,
  data_domain TEXT
);

CREATE TABLE data_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id UUID REFERENCES data_sources(id),
  status TEXT,
  records_loaded INT,
  started_at TIMESTAMPTZ DEFAULT now()
);

-- ============ 3. MARKET · AI · DECISION ============
CREATE TABLE price_candles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id UUID REFERENCES commodities(id),
  interval_code TEXT NOT NULL DEFAULT '1d',
  candle_time TIMESTAMPTZ NOT NULL,
  open NUMERIC, high NUMERIC, low NUMERIC, close NUMERIC,
  volume NUMERIC
);
CREATE INDEX ON price_candles (commodity_id, candle_time);

CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id UUID REFERENCES commodities(id),
  data_source_id UUID REFERENCES data_sources(id),
  observed_at TIMESTAMPTZ NOT NULL,
  price NUMERIC NOT NULL
);
CREATE INDEX ON market_prices (commodity_id, observed_at);

CREATE TABLE model_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  version TEXT NOT NULL,
  domain TEXT,
  metrics JSONB,
  is_active BOOLEAN DEFAULT FALSE
);
-- NOTE: intentionally NOT seeded. Populated only by a real training run
-- (see 5-Engineering/Local_Dummy_Environment_Setup.md train.py). Seeding
-- this table with fake rows is exactly the "hardcoded AI" trap to avoid.

CREATE TABLE forecast_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  model_version_id UUID REFERENCES model_versions(id),
  forecast_domain TEXT,
  commodity_id UUID REFERENCES commodities(id),
  product_id UUID REFERENCES products(id),
  horizon_days INT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  input_data_until TIMESTAMPTZ
);
-- NOTE: intentionally NOT seeded — same reason as model_versions.

CREATE TABLE forecast_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_run_id UUID REFERENCES forecast_runs(id),
  target_time TIMESTAMPTZ NOT NULL,
  p10 NUMERIC, p50 NUMERIC, p90 NUMERIC,
  trend TEXT,
  confidence NUMERIC
);
-- NOTE: intentionally NOT seeded.

CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  model_version_id UUID REFERENCES model_versions(id),
  forecast_run_id UUID REFERENCES forecast_runs(id),
  decision_domain TEXT,
  action TEXT,
  recommended_quantity NUMERIC,
  confidence NUMERIC,
  risk_level TEXT,
  status TEXT DEFAULT 'PENDING',
  generated_at TIMESTAMPTZ DEFAULT now()
);
-- NOTE: intentionally NOT seeded — this is the table a judge/teammate should
-- see populated ONLY by your Decision Engine actually running, never by seed data.

CREATE TABLE recommendation_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES recommendations(id),
  title TEXT, detail TEXT, weight NUMERIC
);

CREATE TABLE decision_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES recommendations(id),
  executed_action TEXT,
  executed_quantity NUMERIC,
  actual_financial_impact NUMERIC
);

CREATE TABLE decision_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES recommendations(id),
  created_by UUID REFERENCES users(id),
  assumptions JSONB,
  result_cost NUMERIC,
  result_margin NUMERIC
);

-- ============ 4. FEED SOURCING · BIDDING · PROCUREMENT ============
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  supplier_type TEXT,
  verification_status TEXT,
  quality_score NUMERIC,
  delivery_score NUMERIC
);

CREATE TABLE supplier_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id),
  commodity_id UUID REFERENCES commodities(id),
  offered_price NUMERIC NOT NULL,
  available_capacity NUMERIC,
  lead_time_days INT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE feed_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  commodity_id UUID REFERENCES commodities(id),
  required_quantity NUMERIC,
  current_inventory NUMERIC,
  forecast_requirement NUMERIC
);

CREATE TABLE procurement_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  recommendation_id UUID REFERENCES recommendations(id),
  feed_requirement_id UUID REFERENCES feed_requirements(id),
  request_code TEXT UNIQUE,
  commodity_id UUID REFERENCES commodities(id),
  required_quantity NUMERIC,
  status TEXT DEFAULT 'OPEN'
);

CREATE TABLE bid_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_request_id UUID REFERENCES procurement_requests(id),
  bid_code TEXT UNIQUE,
  opened_at TIMESTAMPTZ, closes_at TIMESTAMPTZ,
  status TEXT DEFAULT 'OPEN'
);

CREATE TABLE supplier_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_event_id UUID REFERENCES bid_events(id),
  supplier_id UUID REFERENCES suppliers(id),
  price NUMERIC, offered_quantity NUMERIC, delivery_days INT,
  total_score NUMERIC, rank INT
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  procurement_request_id UUID REFERENCES procurement_requests(id),
  supplier_bid_id UUID REFERENCES supplier_bids(id),
  po_code TEXT UNIQUE,
  supplier_id UUID REFERENCES suppliers(id),
  total_value NUMERIC,
  status TEXT DEFAULT 'DRAFT'
);

-- ============ 5. POULTRY OPERATIONS ============
CREATE TABLE flock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  farm_facility_id UUID REFERENCES facilities(id),
  batch_code TEXT UNIQUE,
  doc_quantity INT,
  placement_date DATE,
  status TEXT
);

CREATE TABLE farm_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_batch_id UUID REFERENCES flock_batches(id),
  metric_date DATE,
  feed_consumption_kg NUMERIC,
  mortality_rate NUMERIC,
  average_live_weight_kg NUMERIC,
  fcr NUMERIC
);

CREATE TABLE harvest_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_batch_id UUID REFERENCES flock_batches(id),
  recommendation_id UUID REFERENCES recommendations(id),
  planned_harvest_date DATE,
  planned_volume_kg NUMERIC,
  status TEXT
);

CREATE TABLE processing_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  harvest_plan_id UUID REFERENCES harvest_plans(id),
  rphu_facility_id UUID REFERENCES facilities(id),
  processing_code TEXT UNIQUE,
  live_input_kg NUMERIC,
  carcass_output_kg NUMERIC,
  carcass_yield NUMERIC
);

CREATE TABLE inventory_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  facility_id UUID REFERENCES facilities(id),
  commodity_id UUID REFERENCES commodities(id),
  product_id UUID REFERENCES products(id),
  on_hand_quantity NUMERIC,
  coverage_days NUMERIC
);

-- ============ 6. DEMAND · DISTRIBUTION ============
CREATE TABLE demand_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_code TEXT UNIQUE NOT NULL,
  name TEXT, segment TEXT, region TEXT, estimated_population INT
);

CREATE TABLE demand_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demand_node_id UUID REFERENCES demand_nodes(id),
  product_id UUID REFERENCES products(id),
  model_version_id UUID REFERENCES model_versions(id),
  forecast_quantity NUMERIC,
  confidence NUMERIC
);

CREATE TABLE distribution_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES recommendations(id),
  demand_forecast_id UUID REFERENCES demand_forecasts(id),
  source_facility_id UUID REFERENCES facilities(id),
  destination_node_id UUID REFERENCES demand_nodes(id),
  product_id UUID REFERENCES products(id),
  allocated_quantity NUMERIC,
  status TEXT DEFAULT 'PLANNED'
);

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id UUID REFERENCES distribution_allocations(id),
  shipment_code TEXT UNIQUE,
  origin_facility_id UUID REFERENCES facilities(id),
  destination_node_id UUID REFERENCES demand_nodes(id),
  shipped_quantity NUMERIC,
  status TEXT DEFAULT 'PENDING',
  cold_chain_status TEXT
);

-- ============ 7. APPROVAL · AUDIT ============
CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  recommendation_id UUID REFERENCES recommendations(id),
  procurement_request_id UUID REFERENCES procurement_requests(id),
  requested_by UUID REFERENCES users(id),
  assigned_approver_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'PENDING'
);

CREATE TABLE approval_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_request_id UUID REFERENCES approval_requests(id),
  actor_user_id UUID REFERENCES users(id),
  action TEXT, reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action TEXT, entity_type TEXT, entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ 8. TRACECHAIN · HARVEST PASSPORT ============
CREATE TABLE trace_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT UNIQUE,
  product_id UUID REFERENCES products(id),
  processing_batch_id UUID REFERENCES processing_batches(id),
  current_stage TEXT,
  chain_status TEXT DEFAULT 'INTACT',
  anchor_status TEXT DEFAULT 'PENDING',
  public_slug TEXT UNIQUE
);

CREATE TABLE trace_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_batch_id UUID REFERENCES trace_batches(id),
  organization_id UUID REFERENCES organizations(id),
  facility_id UUID REFERENCES facilities(id),
  actor_user_id UUID REFERENCES users(id),
  event_type TEXT, event_time TIMESTAMPTZ,
  event_hash CHAR(64)
);

CREATE TABLE blockchain_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_batch_id UUID REFERENCES trace_batches(id),
  trace_event_id UUID REFERENCES trace_events(id),
  network TEXT, tx_hash TEXT,
  anchored_at TIMESTAMPTZ, status TEXT DEFAULT 'PENDING'
);

-- ============ 9. REGIONAL NUTRITION · PRIORITY SCORING ============
-- REAL data source (BPS/Susenas-style provincial protein consumption,
-- gram/kapita/hari, 2018-2025). Feeds a priority score so the Decision
-- Engine can prefer allocating supply to lower-consumption regions,
-- instead of a flat/equal split across demand_nodes.
CREATE TABLE provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_code TEXT NOT NULL,
  name TEXT NOT NULL,
  -- BPS reused province_code numbers after the 2022 Papua redistricting
  -- (e.g. code 91 = "Papua Barat" through 2023, then "Papua" from 2024;
  -- code 94 = "Papua" through 2023, then "Papua Tengah" from 2024).
  -- So a code alone does NOT uniquely identify a province across years —
  -- (code, name) together do. Do not dedupe on province_code alone.
  UNIQUE (province_code, name)
);

CREATE TABLE regional_protein_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id UUID REFERENCES provinces(id),
  year INT NOT NULL,
  protein_consumption_g_per_cap_day NUMERIC NOT NULL,
  UNIQUE (province_id, year)
);

CREATE TABLE regional_priority_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id UUID REFERENCES provinces(id),
  year INT NOT NULL,
  protein_consumption_g_per_cap_day NUMERIC,
  national_avg_g_per_cap_day NUMERIC,
  -- priority_score: higher = lower protein consumption = higher priority
  -- for supply allocation. Computed as national_avg minus this province's
  -- consumption, clipped at 0 (provinces above the national average score 0).
  priority_score NUMERIC,
  priority_rank INT,  -- 1 = lowest consumption = highest priority that year
  UNIQUE (province_id, year)
);
CREATE INDEX ON regional_priority_scores (year, priority_rank);

-- =====================================================================
-- Tables above marked "intentionally NOT seeded" stay empty after
-- 02_static_foundation.sql and the JSON loader run. They exist so our
-- application/training code has somewhere real to write real output —
-- filling them with fake rows now would defeat that purpose.
-- =====================================================================
