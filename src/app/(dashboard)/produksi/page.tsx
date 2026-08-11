import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";

const farms = [
  { farm:"GSU-01", birds:"248 rb", age:"27 hari", fcr:"1,53", mortality:"2,10%", weight:"1,54 kg", status:"MAINTAIN" },
  { farm:"GSU-02", birds:"231 rb", age:"30 hari", fcr:"1,61", mortality:"2,72%", weight:"1,77 kg", status:"MAINTAIN" },
  { farm:"GSU-03", birds:"226 rb", age:"33 hari", fcr:"1,58", mortality:"2,45%", weight:"1,92 kg", status:"HARVEST" },
  { farm:"GSU-04", birds:"219 rb", age:"31 hari", fcr:"1,67", mortality:"2,88%", weight:"1,74 kg", status:"DELAY" }
];

export default function ProduksiPage() {
  return (
    <>
      <PageHeader
        title="Production Intelligence"
        subtitle="Monitor DOC, flock health, FCR, mortalitas, live weight, feed availability, dan expected output."
      />

      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Birds aktif</div><div className="kpi-value">924 rb</div><div className="kpi-change">4 farm cluster</div></div>
        <div className="kpi"><div className="kpi-label">FCR rata-rata</div><div className="kpi-value">1,58</div><div className="kpi-change">Within target demo</div></div>
        <div className="kpi"><div className="kpi-label">Mortalitas</div><div className="kpi-value">2,45%</div><div className="kpi-change">Group current average</div></div>
        <div className="kpi"><div className="kpi-label">Expected harvest 7H</div><div className="kpi-value">67 ton</div><div className="kpi-change">Feed + weight constrained</div></div>
      </div>

      <div className="grid grid-2">
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-dot"/>Keputusan produksi</div>
          <h2 className="hero-title">Panen GSU-03</h2>
          <p className="hero-lead">24 ton diprioritaskan untuk slot RPHU dan demand aktif.</p>
          <div className="metric-grid" style={{gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
            <div><div className="metric-label">Live weight</div><div className="metric-value">1,92 kg</div></div>
            <div><div className="metric-label">FCR</div><div className="metric-value">1,58</div></div>
            <div><div className="metric-label">Keyakinan</div><div className="metric-value">81%</div></div>
          </div>
        </section>

        <section className="ops-panel">
          <h2 className="panel-title">Constraint yang dibaca</h2>
          <div className="reason-list">
            <div className="reason"><div className="reason-num">01</div><div><div className="reason-title">Feed availability</div><div className="reason-copy">Cukup hingga target harvest.</div></div></div>
            <div className="reason"><div className="reason-num">02</div><div><div className="reason-title">RPHU capacity</div><div className="reason-copy">Slot 13.00–17.00 masih tersedia.</div></div></div>
            <div className="reason"><div className="reason-num">03</div><div><div className="reason-title">Demand downstream</div><div className="reason-copy">Kebutuhan carcass aktif mendukung harvest timing.</div></div></div>
          </div>
        </section>
      </div>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad"><h2 className="panel-title">Farm performance</h2><div className="panel-sub">Demo operational snapshot.</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Farm</th><th>Birds</th><th>Umur</th><th>FCR</th><th>Mortalitas</th><th>Live weight</th><th>Decision</th></tr></thead>
            <tbody>
              {farms.map(row=>(
                <tr key={row.farm}>
                  <td><strong>{row.farm}</strong></td><td>{row.birds}</td><td>{row.age}</td><td>{row.fcr}</td><td>{row.mortality}</td><td>{row.weight}</td><td><ActionBadge action={row.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
