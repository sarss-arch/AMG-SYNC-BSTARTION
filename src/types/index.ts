export type WorkspaceId = "AMG" | "PAM" | "HYBRO" | "GSU" | "CIF" | "MPS" | "AMP";
export type ModuleId =
  | "ringkasan" | "keputusan" | "pasar" | "feed-ai" | "feed-exchange"
  | "procurement" | "produksi" | "harvest" | "rphu" | "inventory" | "penjualan"
  | "demand" | "distribution" | "traceability" | "circular"
  | "persetujuan" | "kinerja" | "data-sources" | "admin";

export type WorkspaceMembership = {
  workspaceId: WorkspaceId;
  roleCode: string;
  roleName: string;
  permissions: string[];
};

export type MockUser = {
  id: string;
  name: string;
  email: string;
  memberships: WorkspaceMembership[];
};

export type WorkspaceDefinition = {
  id: WorkspaceId;
  shortName: string;
  legalName: string;
  business: string;
  modules: ModuleId[];
};

export type DecisionAction =
  | "BUY" | "WAIT" | "HOLD" | "SELL"
  | "INCREASE" | "MAINTAIN" | "REDUCE"
  | "HARVEST" | "DELAY" | "ALLOCATE";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type ForecastPoint = {
  time: string;
  value: number;
  lower: number;
  upper: number;
};

export type DecisionReason = {
  id: string;
  title: string;
  detail: string;
};

export type Recommendation = {
  id: string;
  domain: string;
  action: DecisionAction;
  item: string;
  quantity: number;
  unit: string;
  currentPrice: number;
  forecastPrice: number;
  expectedChangePercent: number;
  expectedSaving: number;
  confidence: number;
  risk: RiskLevel;
  executionDeadline: string;
  costDelayImpact: number;
  reasons: DecisionReason[];
  modelVersion: string;
  generatedAt: string;
};

export type OperationalContext = {
  inventoryDays: number;
  safetyStockDays: number;
  demandChange: number;
  warehouseCapacity: number;
};

export type ApprovalStatus = "PENDING" | "APPROVED" | "MODIFIED" | "REJECTED";

export type Approval = {
  id: string;
  recommendationId: string;
  item: string;
  action: DecisionAction;
  quantity: number;
  value: number;
  requester: string;
  approver: string;
  priority: "TINGGI" | "SEDANG" | "NORMAL";
  status: ApprovalStatus;
  createdAt: string;
};

export type Batch = {
  id: string;
  product: string;
  stage: string;
  chainStatus: "INTACT" | "PENDING" | "BROKEN";
  anchorStatus: "VERIFIED" | "PENDING" | "ANOMALY";
  updatedAt: string;
};
