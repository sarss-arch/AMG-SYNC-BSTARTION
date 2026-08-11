import { PageHeader } from "@/components/ui/PageHeader";

const nodes = [
  ["AMG Farm","Chicken manure sebagai feedstock"],
  ["Mitra maggot lokal","Menerima feedstock / waste resource"],
  ["BSF production","Menghasilkan alternative feed ingredient"],
  ["Feed AI / QA","Validasi harga, supply, quality, dan kelayakan"],
  ["AMG Feed","Bahan alternatif masuk ke sourcing mix"]
];

export default function CircularPage() {
  return (
    <>
      <PageHeader
        title="Circular Protein Ecosystem"
        subtitle="Closed-loop sourcing: Waste → Feed → Chicken → Waste → Feed."
      />
      <section className="circular-loop">
        {nodes.map((node,index)=>(
          <div key={node[0]} style={{display:"contents"}}>
            <div className="circular-node"><strong>{node[0]}</strong><small>{node[1]}</small></div>
            {index<nodes.length-1?<div className="circular-arrow">→</div>:null}
          </div>
        ))}
      </section>

      <div style={{height:17}}/>

      <div className="grid grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Partnership logic</h2>
          <div className="reason-list">
            <div className="reason"><div className="reason-num">01</div><div><div className="reason-title">AMG menyediakan feedstock</div><div className="reason-copy">Waste resource dapat menjadi input untuk partner lokal sesuai standar dan kelayakan.</div></div></div>
            <div className="reason"><div className="reason-num">02</div><div><div className="reason-title">Partner memproduksi BSF</div><div className="reason-copy">Komunitas memperoleh offtake pathway yang lebih terstruktur.</div></div></div>
            <div className="reason"><div className="reason-num">03</div><div><div className="reason-title">AMG menjadi buyer/offtaker</div><div className="reason-copy">Sourcing tetap melalui quality, nutrition, supply, dan commercial validation.</div></div></div>
          </div>
        </section>
        <section className="ops-panel">
          <h2 className="panel-title">Guardrail penting</h2>
          <p className="reason-copy" style={{marginTop:8}}>
            Alternative feed ingredient tidak diasumsikan menggantikan soybean meal 1:1.
            Formula, kualitas, supply, dan regulasi tetap menjadi constraint sebelum digunakan.
          </p>
        </section>
      </div>
    </>
  );
}
