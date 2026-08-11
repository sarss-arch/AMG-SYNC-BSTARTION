import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Recommendation } from "@/types";
import { compactRupiah, pricePerKg } from "@/lib/format";

export function RecommendationHero({ item }: { item: Recommendation }) {
  return (
    <section className="hero">
      <div className="eyebrow"><span className="eyebrow-dot"/>Perlu diputuskan hari ini</div>
      <h2 className="hero-title">Beli {item.item.toLowerCase()}</h2>
      <p className="hero-lead">Disarankan beli {item.quantity} {item.unit}</p>
      <div className="hero-deadline">Amankan pembelian sebelum {item.executionDeadline}</div>

      <div className="metric-grid">
        <div>
          <div className="metric-label">Harga saat ini</div>
          <div className="metric-value">{pricePerKg(item.currentPrice)}</div>
        </div>
        <div>
          <div className="metric-label">Perkiraan 7 hari</div>
          <div className="metric-value">{pricePerKg(item.forecastPrice)}</div>
          <div className="metric-note metric-attention">↑ sekitar {item.expectedChangePercent}%</div>
        </div>
        <div>
          <div className="metric-label">Potensi penghematan</div>
          <div className="metric-value metric-positive">{compactRupiah(item.expectedSaving)}</div>
        </div>
        <div>
          <div className="metric-label">Tingkat keyakinan</div>
          <div className="metric-value">{item.confidence}% · Tinggi</div>
        </div>
        <div>
          <div className="metric-label">Risiko</div>
          <div className="metric-value metric-positive">Rendah</div>
        </div>
      </div>

      <div className="actions">
        <Link href="/procurement/jagung" className="btn btn-primary">Lihat keputusan <Icon name="arrow" size={16}/></Link>
        <Link href="/simulator" className="btn btn-secondary">Coba simulasi</Link>
      </div>
    </section>
  );
}
