import type { ModuleId, WorkspaceDefinition } from "@/types";

export const workspaces: Record<string, WorkspaceDefinition> = {
  AMG: {
    id: "AMG",
    shortName: "AMG Group",
    legalName: "AMG Group",
    business: "Group Control Tower",
    modules: [
      "ringkasan","keputusan","pasar","feed-ai","feed-exchange","procurement",
      "produksi","harvest","rphu","inventory","penjualan","demand","distribution",
      "traceability","circular","persetujuan","kinerja","data-sources","admin"
    ]
  },
  PAM: {
    id: "PAM",
    shortName: "Peternakan Ayam Manggis",
    legalName: "PT Peternakan Ayam Manggis",
    business: "PS · DOC Broiler & Layer",
    modules: ["ringkasan","produksi","harvest","inventory","traceability","kinerja"]
  },
  HYBRO: {
    id: "HYBRO",
    shortName: "Hybro Indonesia",
    legalName: "PT Hybro Indonesia",
    business: "GPS · DOC PS Broiler",
    modules: ["ringkasan","produksi","inventory","traceability","kinerja"]
  },
  GSU: {
    id: "GSU",
    shortName: "Gunung Sari Utama",
    legalName: "PT Gunung Sari Utama",
    business: "Commercial Broiler Farm",
    modules: ["ringkasan","produksi","harvest","inventory","traceability","kinerja"]
  },
  CIF: {
    id: "CIF",
    shortName: "Citra Ina Feedmill",
    legalName: "PT Citra Ina Feedmill",
    business: "Feedmill",
    modules: ["ringkasan","keputusan","pasar","feed-ai","feed-exchange","procurement","inventory","persetujuan","kinerja","data-sources"]
  },
  MPS: {
    id: "MPS",
    shortName: "Megah Prayasa Santosa",
    legalName: "PT Megah Prayasa Santosa",
    business: "Feedmill · Breeding",
    modules: ["ringkasan","keputusan","pasar","feed-ai","feed-exchange","procurement","produksi","inventory","persetujuan","kinerja"]
  },
  AMP: {
    id: "AMP",
    shortName: "Argo Makmur Proteindo",
    legalName: "PT Argo Makmur Proteindo",
    business: "RPHU · Karkas & Frozen Food",
    modules: ["ringkasan","keputusan","rphu","inventory","penjualan","demand","distribution","traceability","persetujuan","kinerja"]
  }
};

export const moduleMeta: Record<ModuleId, { label: string; href: string; group: string; icon: string }> = {
  ringkasan: { label: "Ringkasan", href: "/ringkasan", group: "Utama", icon: "grid" },
  keputusan: { label: "Keputusan", href: "/keputusan", group: "Utama", icon: "decision" },
  pasar: { label: "Pasar", href: "/pasar", group: "Utama", icon: "chart" },

  "feed-ai": { label: "Feed AI", href: "/feed-ai", group: "Intelligence", icon: "pulse" },
  "feed-exchange": { label: "Feed Exchange", href: "/feed-exchange", group: "Intelligence", icon: "link" },
  demand: { label: "Demand Intelligence", href: "/demand", group: "Intelligence", icon: "users" },
  distribution: { label: "Smart Distribution", href: "/distribution", group: "Intelligence", icon: "truck" },

  procurement: { label: "Procurement", href: "/procurement", group: "Operasional", icon: "cart" },
  produksi: { label: "Produksi", href: "/produksi", group: "Operasional", icon: "factory" },
  harvest: { label: "Harvest", href: "/harvest", group: "Operasional", icon: "leaf" },
  rphu: { label: "RPHU", href: "/rphu", group: "Operasional", icon: "process" },
  inventory: { label: "Inventory", href: "/inventory", group: "Operasional", icon: "box" },
  penjualan: { label: "Penjualan", href: "/penjualan", group: "Operasional", icon: "store" },

  traceability: { label: "TraceChain", href: "/traceability", group: "Trust & Control", icon: "fingerprint" },
  circular: { label: "Circular Ecosystem", href: "/circular", group: "Trust & Control", icon: "refresh" },
  persetujuan: { label: "Persetujuan", href: "/persetujuan", group: "Trust & Control", icon: "check" },
  kinerja: { label: "Kinerja", href: "/kinerja", group: "Trust & Control", icon: "bars" },
  "data-sources": { label: "Sumber Data", href: "/data-sources", group: "Trust & Control", icon: "database" },
  admin: { label: "Admin", href: "/admin", group: "Trust & Control", icon: "shield" }
};
