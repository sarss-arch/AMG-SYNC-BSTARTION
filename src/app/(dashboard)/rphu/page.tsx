import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";

const slots = [
  ["08.00–12.00","GSU-01","21 ton","Booked"],
  ["13.00–17.00","GSU-03","24 ton","Recommended"],
  ["18.00–21.00","Buffer","17 ton","Available"]
];

export default function RphuPage() {
  return (
    <>
      <PageHeader
        title="RPHU Allocation"
        subtitle="Selaraskan harvest intake, carcass yield, processing capacity, order, dan cold storage."
      />

      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Kapasitas hari ini</div><div className="kpi-value">86 ton</div><div className="kpi-change">100% nominal</div></div>
        <div className="kpi"><div className="kpi-label">Sudah terbooking</div><div className="kpi-value">61 ton</div><div className="kpi-change">71% utilized</div></div>
        <div className="kpi"><div className="kpi-label">Tersedia</div><div className="kpi-value">25 ton</div><div className="kpi-change">1 recommended slot</div></div>
        <div className="kpi"><div className="kpi-label">Carcass yield</div><div className="kpi-value">72,4%</div><div className="kpi-change">Demo average</div></div>
      </div>

      <div className="grid grid-2">
        <section className="panel">
          <div className="panel-pad"><h2 className="panel-title">Processing schedule</h2></div>
          <table className="data-table"><thead><tr><th>Slot</th><th>Source</th><th>Volume</th><th>Status</th></tr></thead>
            <tbody>{slots.map(row=><tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody>
          </table>
        </section>

        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-dot"/>Allocation recommendation</div>
          <h2 className="hero-title" style={{fontSize:34}}>Alokasikan GSU-03</h2>
          <p className="hero-lead">24 ton · slot 13.00–17.00</p>
          <div className="metric-grid" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
            <div><div className="metric-label">Expected output</div><div className="metric-value">17,4 ton</div></div>
            <div><div className="metric-label">Decision</div><div className="metric-value"><ActionBadge action="ALLOCATE"/></div></div>
          </div>
          <div className="actions"><Link href="/distribution" className="btn btn-primary">Lihat downstream allocation</Link></div>
        </section>
      </div>
    </>
  );
}
