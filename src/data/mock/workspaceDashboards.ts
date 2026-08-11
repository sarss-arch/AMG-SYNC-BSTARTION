import type { WorkspaceId } from "@/types";

export type WorkspaceDashboard = {
  title: string;
  subtitle: string;
  recommendation: {
    label: string;
    title: string;
    lead: string;
    deadline: string;
    actionLabel: string;
    href: string;
    confidence: number;
    risk: string;
  };
  kpis: { label: string; value: string; note: string }[];
};

export const workspaceDashboards: Record<Exclude<WorkspaceId,"AMG"|"CIF">, WorkspaceDashboard> = {
  PAM: {
    title: "Ringkasan Breeding & DOC",
    subtitle: "Ketersediaan PS, DOC, feed, dan downstream demand dalam satu view.",
    recommendation: {
      label: "Keputusan produksi",
      title: "Pertahankan placement DOC",
      lead: "Rencana placement broiler minggu ini masih sesuai demand downstream.",
      deadline: "Review kembali 14 Agustus",
      actionLabel: "Lihat produksi",
      href: "/produksi",
      confidence: 78,
      risk: "Rendah"
    },
    kpis: [
      { label: "DOC siap alokasi", value: "842 rb", note: "Broiler + layer" },
      { label: "PS aktif", value: "118 rb", note: "Dalam siklus" },
      { label: "Feed coverage", value: "13,2 hari", note: "Di atas target aman" },
      { label: "Downstream demand", value: "+4,8%", note: "7 hari ke depan" }
    ]
  },
  HYBRO: {
    title: "Ringkasan GPS & Parent Stock",
    subtitle: "Monitor GPS, DOC PS, siklus breeding, dan kebutuhan downstream.",
    recommendation: {
      label: "Keputusan breeding",
      title: "Pertahankan jadwal GPS",
      lead: "Ketersediaan DOC PS masih seimbang dengan demand group.",
      deadline: "Review kembali 18 Agustus",
      actionLabel: "Lihat produksi",
      href: "/produksi",
      confidence: 76,
      risk: "Rendah"
    },
    kpis: [
      { label: "GPS aktif", value: "24,8 rb", note: "Current cycle" },
      { label: "DOC PS forecast", value: "162 rb", note: "30 hari" },
      { label: "Hatchability", value: "84,6%", note: "Demo metric" },
      { label: "Demand coverage", value: "1,08×", note: "Supply vs plan" }
    ]
  },
  GSU: {
    title: "Ringkasan Produksi Farm",
    subtitle: "FCR, mortalitas, live weight, feed consumption, dan kesiapan harvest.",
    recommendation: {
      label: "Perlu diputuskan hari ini",
      title: "Panen GSU-03",
      lead: "Disarankan harvest 24 ton untuk menangkap bobot optimal dan slot RPHU.",
      deadline: "Eksekusi 14 Agustus",
      actionLabel: "Lihat harvest",
      href: "/harvest",
      confidence: 81,
      risk: "Sedang"
    },
    kpis: [
      { label: "Live weight", value: "1,92 kg", note: "GSU-03" },
      { label: "FCR", value: "1,58", note: "Rata-rata flock" },
      { label: "Mortalitas", value: "2,45%", note: "Masih terkendali" },
      { label: "Feed coverage", value: "6,7 hari", note: "Sampai target harvest" }
    ]
  },
  MPS: {
    title: "Ringkasan Feedmill Breeding",
    subtitle: "Kebutuhan feed breeding, raw material, forecast harga, dan production plan.",
    recommendation: {
      label: "Keputusan sourcing",
      title: "Tahan soybean meal",
      lead: "Harga jangka pendek diperkirakan melemah; prioritaskan alternatif lokal untuk kebutuhan parsial.",
      deadline: "Review kembali 15 Agustus",
      actionLabel: "Buka Feed AI",
      href: "/feed-ai",
      confidence: 72,
      risk: "Sedang"
    },
    kpis: [
      { label: "Feed demand 30H", value: "420 ton", note: "Breeding" },
      { label: "Raw material stock", value: "13,8 hari", note: "Coverage" },
      { label: "Soybean outlook", value: "↓ 2,1%", note: "H+14 demo" },
      { label: "Production plan", value: "96%", note: "Capacity loaded" }
    ]
  },
  AMP: {
    title: "Ringkasan RPHU & Penjualan",
    subtitle: "Processing intake, cold storage, demand, margin, dan sales allocation.",
    recommendation: {
      label: "Keputusan penjualan",
      title: "Jual karkas beku",
      lead: "Disarankan alokasikan 38 ton ke demand aktif sebelum inventory aging meningkat.",
      deadline: "Eksekusi sebelum 13 Agustus",
      actionLabel: "Lihat penjualan",
      href: "/penjualan",
      confidence: 79,
      risk: "Rendah"
    },
    kpis: [
      { label: "RPHU utilization", value: "71%", note: "Hari ini" },
      { label: "Cold storage", value: "82%", note: "Capacity used" },
      { label: "Demand aktif", value: "62 ton", note: "7 hari" },
      { label: "Margin/unit", value: "+Rp8.200", note: "Karkas beku" }
    ]
  }
};
