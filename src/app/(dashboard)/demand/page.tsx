import { PageHeader } from "@/components/ui/PageHeader";

const segments = [
  { type:"Gym & atlet", partner:"Fithub Malang", demand:"300 kg/minggu", signal:"+12%", note:"1.500 member · high-protein demand" },
  { type:"RS / klinik", partner:"Bunda Jakarta", demand:"200 kg/minggu", signal:"+5%", note:"Maternal & recovery nutrition" },
  { type:"Sekolah", partner:"Cluster sekolah A", demand:"420 kg/minggu", signal:"+8%", note:"Program nutrisi anak" },
  { type:"Lansia", partner:"Care network B", demand:"140 kg/minggu", signal:"+3%", note:"Maintenance muscle mass" }
];

export default function DemandPage() {
  return (
    <>
      <PageHeader
        title="Demand Intelligence"
        subtitle="Cari di mana kebutuhan protein paling tinggi, lalu ubah produksi dan inventory menjadi demand-driven allocation."
      />

      <div className="segment-grid">
        {segments.map((item,index) => (
          <article className="segment-card" key={item.type}>
            <div className="engine-card-index">{String(index+1).padStart(2,"0")}</div>
            <h3>{item.type}</h3>
            <p>{item.partner}</p>
            <div className="segment-number">{item.demand}</div>
            <div className="kpi-change">{item.signal} demand signal</div>
            <div className="reason-copy" style={{marginTop:7}}>{item.note}</div>
          </article>
        ))}
      </div>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad">
          <h2 className="panel-title">Rekomendasi demand-driven</h2>
          <div className="panel-sub">Allocation recommendation berasal dari demand, inventory, cold-chain capacity, dan margin constraints.</div>
        </div>
        <table className="data-table">
          <thead><tr><th>Tujuan</th><th>Segmen</th><th>Demand forecast</th><th>Rekomendasi</th><th>Priority</th></tr></thead>
          <tbody>
            <tr><td><strong>Fithub Malang</strong></td><td>Gym & atlet</td><td>300 kg/minggu</td><td>Alokasikan 300 kg/minggu</td><td>Tinggi</td></tr>
            <tr><td><strong>RS Bunda Jakarta</strong></td><td>RS / klinik</td><td>200 kg/minggu</td><td>Alokasikan 200 kg/minggu</td><td>Tinggi</td></tr>
            <tr><td><strong>Cluster sekolah A</strong></td><td>Sekolah</td><td>420 kg/minggu</td><td>Siapkan shipment terjadwal</td><td>Sedang</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
