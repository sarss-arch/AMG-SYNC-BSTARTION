import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";

const rows = [
  { farm:"GSU-03", age:"33 hari", weight:"1,92 kg", volume:"24 ton", feed:"1,58 FCR", rphu:"Slot tersedia", decision:"HARVEST", confidence:"81%" },
  { farm:"GSU-04", age:"31 hari", weight:"1,74 kg", volume:"19 ton", feed:"1,67 FCR", rphu:"Padat", decision:"DELAY", confidence:"74%" },
  { farm:"GSU-02", age:"30 hari", weight:"1,77 kg", volume:"22 ton", feed:"1,61 FCR", rphu:"Tersedia besok", decision:"WAIT", confidence:"70%" }
];

export default function HarvestPage() {
  return (
    <>
      <PageHeader
        title="Harvest Decision"
        subtitle="Evaluasi umur, live weight, FCR, feed consumption, market price, demand, dan RPHU capacity."
      />

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot"/>Priority harvest</div>
        <h2 className="hero-title">Harvest GSU-03 · 24 ton</h2>
        <p className="hero-lead">Eksekusi 14 Agustus untuk menjaga performance dan memanfaatkan slot processing.</p>
        <div className="metric-grid" style={{gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
          <div><div className="metric-label">Umur</div><div className="metric-value">33 hari</div></div>
          <div><div className="metric-label">Bobot</div><div className="metric-value">1,92 kg</div></div>
          <div><div className="metric-label">RPHU slot</div><div className="metric-value">Tersedia</div></div>
          <div><div className="metric-label">Keyakinan</div><div className="metric-value">81%</div></div>
        </div>
        <div className="actions"><Link href="/rphu" className="btn btn-primary">Lihat alokasi RPHU</Link></div>
      </section>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad"><h2 className="panel-title">Harvest queue</h2></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Farm</th><th>Umur</th><th>Bobot</th><th>Volume</th><th>Feed</th><th>RPHU</th><th>Decision</th><th>Keyakinan</th></tr></thead>
            <tbody>{rows.map(row=>(
              <tr key={row.farm}><td><strong>{row.farm}</strong></td><td>{row.age}</td><td>{row.weight}</td><td>{row.volume}</td><td>{row.feed}</td><td>{row.rphu}</td><td><ActionBadge action={row.decision}/></td><td>{row.confidence}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
