import type { OperationalContext, Recommendation } from "@/types";

export const cornRecommendation: Recommendation = {
  id: "PRC-2026-0811-003",
  domain: "PROCUREMENT",
  action: "BUY",
  item: "Jagung",
  quantity: 500,
  unit: "ton",
  currentPrice: 5750,
  forecastPrice: 6210,
  expectedChangePercent: 8,
  expectedSaving: 210000000,
  confidence: 84,
  risk: "LOW",
  executionDeadline: "12 Agustus 2026",
  costDelayImpact: 420,
  modelVersion: "price-v1.0+rules-v3",
  generatedAt: "11 Agustus 2026 • 20.56 WIB",
  reasons: [
    { id: "01", title: "Stok belum cukup aman", detail: "Cakupan stok baru 8,4 hari dari target aman 12 hari." },
    { id: "02", title: "Harga diperkirakan naik", detail: "Harga jagung berpotensi naik sekitar 8% dalam 7 hari." },
    { id: "03", title: "Pergerakan harga relatif stabil", detail: "Risiko perubahan ekstrem masih rendah pada horizon rekomendasi." },
    { id: "04", title: "Kebutuhan pakan meningkat", detail: "Kebutuhan pakan diperkirakan naik 6,2%." }
  ]
};

export const operationalContext: OperationalContext = {
  inventoryDays: 8.4,
  safetyStockDays: 12,
  demandChange: 6.2,
  warehouseCapacity: 620
};

export const decisionQueue = [
  { id: "d1", item: "Jagung", domain: "Procurement", action: "BUY", confidence: 84, priority: "Tinggi" },
  { id: "d2", item: "Bungkil kedelai", domain: "Procurement", action: "WAIT", confidence: 71, priority: "Sedang" },
  { id: "d3", item: "Pakan jadi", domain: "Inventory", action: "HOLD", confidence: 76, priority: "Normal" },
  { id: "d4", item: "Karkas beku", domain: "Sales", action: "SELL", confidence: 79, priority: "Sedang" }
];
