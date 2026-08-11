import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";

const rows = [
  ["Karkas beku 1 kg","38 ton","Rp38.000/kg","SELL","79%","+Rp8.200/kg","Fithub + Retail"],
  ["Whole chicken","24 ton","Rp36.500/kg","HOLD","73%","+Rp6.100/kg","Institutional"],
  ["Boneless breast","12 ton","Rp61.000/kg","SELL","81%","+Rp12.900/kg","Gym / Horeca"]
];

export default function PenjualanPage() {
  return (
    <>
      <PageHeader
        title="Sales Decision"
        subtitle="Rekomendasi jual/tahan berdasarkan inventory, demand, expected price, margin, dan delivery constraints."
      />

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot"/>Prioritas sales</div>
        <h2 className="hero-title">Jual 38 ton karkas beku</h2>
        <p className="hero-lead">Alokasikan ke demand aktif sebelum inventory aging meningkatkan holding risk.</p>
        <div className="metric-grid" style={{gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
          <div><div className="metric-label">Current price</div><div className="metric-value">Rp38.000/kg</div></div>
          <div><div className="metric-label">Margin/unit</div><div className="metric-value">+Rp8.200</div></div>
          <div><div className="metric-label">Keyakinan</div><div className="metric-value">79%</div></div>
          <div><div className="metric-label">Decision</div><div className="metric-value"><ActionBadge action="SELL"/></div></div>
        </div>
        <div className="actions"><Link href="/demand" className="btn btn-primary">Lihat demand</Link><Link href="/distribution" className="btn btn-secondary">Atur distribusi</Link></div>
      </section>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad"><h2 className="panel-title">Produk siap dialokasikan</h2></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Produk</th><th>Inventory</th><th>Harga</th><th>Aksi</th><th>Keyakinan</th><th>Margin/unit</th><th>Demand</th></tr></thead>
            <tbody>{rows.map(row=>(
              <tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td><ActionBadge action={row[3]}/></td><td>{row[4]}</td><td>{row[5]}</td><td>{row[6]}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
