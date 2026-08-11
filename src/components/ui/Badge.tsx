export function ActionBadge({ action }: { action: string }) {
  const cls =
    action === "BUY" ? "badge-buy" :
    action === "SELL" ? "badge-sell" :
    action === "WAIT" ? "badge-wait" : "badge-neutral";

  const labels: Record<string, string> = {
    BUY: "Beli", WAIT: "Tunggu", HOLD: "Tahan", SELL: "Jual",
    INCREASE: "Naikkan", MAINTAIN: "Pertahankan", REDUCE: "Kurangi",
    HARVEST: "Panen", DELAY: "Tunda", ALLOCATE: "Alokasikan"
  };

  return <span className={`badge ${cls}`}>{labels[action] ?? action}</span>;
}
