import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBatches } from "@/services/traceability.service";

export default async function TraceabilityPage() {
  const batches = await getBatches();
  const verified = batches.filter((b)=>b.anchorStatus==="VERIFIED").length;

  return (
    <>
      <PageHeader
        title="TraceChain"
        subtitle="Digital identity batch dari DOC, farm, feed, harvest, RPHU, cold chain, distribution, hingga consumer-facing Harvest Passport."
      />

      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Batch dipantau</div><div className="kpi-value">{batches.length}</div><div className="kpi-change">Demo registry</div></div>
        <div className="kpi"><div className="kpi-label">Verified anchor</div><div className="kpi-value">{verified}</div><div className="kpi-change">Integrity proof available</div></div>
        <div className="kpi"><div className="kpi-label">Anomaly</div><div className="kpi-value">{batches.filter(b=>b.anchorStatus==="ANOMALY").length}</div><div className="kpi-change">Perlu review QA</div></div>
        <div className="kpi"><div className="kpi-label">Public passport</div><div className="kpi-value">Aktif</div><div className="kpi-change">Allow-listed fields only</div></div>
      </div>

      <section className="panel">
        <div className="panel-pad">
          <h2 className="panel-title">Batch registry</h2>
          <div className="panel-sub">Internal control surface untuk chain integrity, anchor status, dan lifecycle stage.</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Batch</th><th>Produk</th><th>Tahap</th><th>Chain</th><th>Anchor</th><th>Update</th><th></th></tr></thead>
            <tbody>
              {batches.map((batch)=>(
                <tr key={batch.id}>
                  <td><strong>{batch.id}</strong></td>
                  <td>{batch.product}</td>
                  <td>{batch.stage}</td>
                  <td>{batch.chainStatus}</td>
                  <td><span className={`badge ${batch.anchorStatus==="VERIFIED"?"badge-verified":batch.anchorStatus==="ANOMALY"?"badge-sell":"badge-wait"}`}>{batch.anchorStatus}</span></td>
                  <td>{batch.updatedAt}</td>
                  <td><Link className="btn btn-ghost" href={`/traceability/${batch.id}`}>Periksa</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{height:17}}/>

      <section className="process-flow">
        {[
          ["DOC","Batch identity dimulai"],
          ["Farm","Cohort & operational events"],
          ["Harvest","Harvest event"],
          ["RPHU","Processing event"],
          ["Cold chain","Distribution handoff"]
        ].map((node,index)=>(
          <div className="process-node" key={node[0]}>
            <div className="process-node-kicker">Stage {index+1}</div>
            <div className="process-node-title">{node[0]}</div>
            <div className="process-node-copy">{node[1]}</div>
          </div>
        ))}
      </section>
    </>
  );
}
