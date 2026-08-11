import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { CandlestickChart } from "@/components/market/CandlestickChart";
import { ReasonPanel } from "@/components/decision/ReasonPanel";
import { OperationalContextPanel } from "@/components/decision/OperationalContextPanel";
import { getPrimaryRecommendation, getOperationalContext } from "@/services/decision.service";
import { getCornMarketData } from "@/services/market.service";
import { pricePerKg, compactRupiah } from "@/lib/format";

export default async function ProcurementJagungPage() {
  const [rec, ops, market] = await Promise.all([getPrimaryRecommendation(),getOperationalContext(),getCornMarketData()]);
  return (
    <>
      <PageHeader title="Keputusan Procurement · Jagung" subtitle="Evaluasi rekomendasi sebelum membuat permintaan procurement." meta={<><span>{rec.id}</span><span>•</span><span>{rec.modelVersion}</span></>}/>
      <div className="split">
        <div className="grid">
          <CandlestickChart candles={market.candles} forecast={market.forecast}/>
          <ReasonPanel reasons={rec.reasons}/>
        </div>
        <aside className="grid sticky-side">
          <section className="hero" style={{padding:22}}>
            <div className="eyebrow"><span className="eyebrow-dot"/>Rekomendasi aktif</div>
            <h2 className="hero-title" style={{fontSize:34}}>Beli</h2>
            <p className="hero-lead">{rec.quantity} {rec.unit} jagung</p>
            <div className="hero-deadline">Sebelum {rec.executionDeadline}</div>
            <div style={{display:"grid",gap:12,marginTop:20}}>
              <div><div className="metric-label">Harga sekarang</div><div className="metric-value">{pricePerKg(rec.currentPrice)}</div></div>
              <div><div className="metric-label">Proyeksi H+7</div><div className="metric-value">{pricePerKg(rec.forecastPrice)}</div></div>
              <div><div className="metric-label">Potensi penghematan</div><div className="metric-value metric-positive">{compactRupiah(rec.expectedSaving)}</div></div>
              <div><div className="metric-label">Keyakinan / Risiko</div><div className="metric-value">{rec.confidence}% · Rendah</div></div>
            </div>
            <div className="actions"><Link href="/simulator" className="btn btn-secondary">Coba simulasi</Link><Link href="/persetujuan/APR-240811-01" className="btn btn-primary">Ajukan persetujuan</Link></div>
          </section>
          <OperationalContextPanel data={ops}/>
        </aside>
      </div>
    </>
  );
}
