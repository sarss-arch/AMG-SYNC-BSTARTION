import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBatch } from "@/services/traceability.service";

const events = [
  ["DOC_PLACED","28 Jun 2026","Cohort placement recorded"],
  ["FARM_GROWTH","15 Jul 2026","Weight & flock checkpoint"],
  ["HARVESTED","31 Jul 2026","Harvest event recorded"],
  ["PROCESSED","1 Aug 2026","RPHU processing complete"],
  ["COLD_STORAGE","1 Aug 2026","Cold-chain handoff recorded"]
];

export default async function TraceabilityDetailPage({params}:{params:Promise<{batchId:string}>}) {
  const {batchId}=await params;
  const batch=await getBatch(batchId);

  return (
    <>
      <PageHeader
        title={`Integritas batch ${batch.id}`}
        subtitle="Internal QA/Compliance view untuk memeriksa lifecycle event, chain integrity, dan public proof."
        meta={<><span>{batch.product}</span><span>•</span><span>{batch.stage}</span></>}
      />

      <div className="grid grid-2">
        <section className="panel panel-pad">
          <h2 className="panel-title">Integrity status</h2>
          <div className="reason-list">
            <div className="reason"><div className="reason-num">01</div><div><div className="reason-title">Chain status</div><div className="reason-copy">{batch.chainStatus}</div></div></div>
            <div className="reason"><div className="reason-num">02</div><div><div className="reason-title">Anchor status</div><div className="reason-copy">{batch.anchorStatus}</div></div></div>
            <div className="reason"><div className="reason-num">03</div><div><div className="reason-title">Last update</div><div className="reason-copy">{batch.updatedAt}</div></div></div>
          </div>
        </section>

        <section className="ops-panel">
          <h2 className="panel-title">Harvest Passport</h2>
          <p className="reason-copy" style={{marginTop:8}}>
            Passport publik menampilkan field yang di-allow-list. Internal supplier detail,
            commercial data, dan lokasi sensitif tidak diekspos.
          </p>
          <div className="actions"><Link className="btn btn-primary" href={`/passport/${batch.id}`}>Buka passport publik</Link></div>
        </section>
      </div>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad"><h2 className="panel-title">Lifecycle events</h2></div>
        <table className="data-table">
          <thead><tr><th>Event</th><th>Waktu</th><th>Ringkasan</th></tr></thead>
          <tbody>{events.map(row=><tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody>
        </table>
      </section>
    </>
  );
}
