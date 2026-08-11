import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";
import { CandlestickChart } from "@/components/market/CandlestickChart";
import { cornCandles, cornForecast } from "@/data/mock/market";

const alternatives = [
  { material:"Soybean meal", price:"Rp8.250/kg", supply:"Tinggi", lead:"14 hari", outlook:"↑ 8%", status:"WAIT", note:"Harga naik, lead time panjang" },
  { material:"Maggot / BSF", price:"Rp7.480/kg", supply:"Sedang", lead:"5 hari", outlook:"↓ 1,5%", status:"BUY", note:"Best value untuk kebutuhan parsial" },
  { material:"Dedak", price:"Rp4.620/kg", supply:"Tinggi", lead:"3 hari", outlook:"→ stabil", status:"BUY", note:"Supply lokal kuat" },
  { material:"Spirulina", price:"Rp17.900/kg", supply:"Rendah", lead:"7 hari", outlook:"→ stabil", status:"HOLD", note:"Ketersediaan terbatas" }
];

export default function FeedAiPage() {
  return (
    <>
      <PageHeader
        title="Feed AI"
        subtitle="Predict. Compare. Bid. Buy. Bandingkan kebutuhan, forecast harga, inventory, lead time, dan alternatif bahan pakan."
        meta={<><span>Decision domain: Feed Sourcing</span><span>•</span><span>Data demo</span></>}
      />

      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Feed demand 30 hari</div><div className="kpi-value">500 ton</div><div className="kpi-change">Kebutuhan terprediksi</div></div>
        <div className="kpi"><div className="kpi-label">Inventory saat ini</div><div className="kpi-value">180 ton</div><div className="kpi-change">36% dari kebutuhan</div></div>
        <div className="kpi"><div className="kpi-label">30-day requirement</div><div className="kpi-value">620 ton</div><div className="kpi-change">Termasuk safety buffer</div></div>
        <div className="kpi"><div className="kpi-label">Rekomendasi utama</div><div className="kpi-value">Maggot</div><div className="kpi-change">Best value · demo</div></div>
      </div>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot"/>AI Feed Sourcing Engine</div>
        <h2 className="hero-title">Beli 200 ton maggot sekarang</h2>
        <p className="hero-lead">Tahan soybean meal untuk pembelian berikutnya dan buka bid ke supplier terverifikasi.</p>
        <div className="metric-grid" style={{gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
          <div><div className="metric-label">Kebutuhan tertutup</div><div className="metric-value">40%</div></div>
          <div><div className="metric-label">Supplier terverifikasi</div><div className="metric-value">12</div></div>
          <div><div className="metric-label">Keyakinan</div><div className="metric-value">82%</div></div>
          <div><div className="metric-label">Decision</div><div className="metric-value metric-positive">BUY NOW</div></div>
        </div>
        <div className="actions">
          <Link href="/feed-exchange" className="btn btn-primary">Buka Open Bid</Link>
          <Link href="/simulator" className="btn btn-secondary">Simulasikan komposisi</Link>
        </div>
      </section>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad">
          <h2 className="panel-title">Perbandingan alternatif bahan pakan</h2>
          <div className="panel-sub">Rekomendasi tidak berarti substitusi 1:1; kelayakan nutrisi, kualitas, supply, dan regulasi tetap harus divalidasi.</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Bahan</th><th>Harga</th><th>Supply</th><th>Lead time</th><th>Forecast</th><th>Status</th><th>Catatan</th></tr></thead>
            <tbody>
              {alternatives.map((row) => (
                <tr key={row.material}>
                  <td><strong>{row.material}</strong></td><td>{row.price}</td><td>{row.supply}</td><td>{row.lead}</td>
                  <td>{row.outlook}</td><td><ActionBadge action={row.status}/></td><td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{height:17}}/>
      <CandlestickChart candles={cornCandles} forecast={cornForecast}/>
    </>
  );
}
