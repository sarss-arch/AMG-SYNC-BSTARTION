import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";
import { getDecisionQueue } from "@/services/decision.service";

const hrefMap: Record<string,string> = {
  "Jagung": "/procurement/jagung",
  "Bungkil kedelai": "/feed-ai",
  "Pakan jadi": "/inventory",
  "Karkas beku": "/penjualan"
};

export default async function KeputusanPage() {
  const rows = await getDecisionQueue();
  return (
    <>
      <PageHeader title="Pusat Keputusan" subtitle="Semua rekomendasi aktif yang perlu direview sesuai domain dan workspace." />
      <section className="panel">
        <div className="panel-pad">
          <h2 className="panel-title">Antrean keputusan</h2>
          <div className="panel-sub">Prioritas berdasarkan impact, risk, confidence, dan business constraint.</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Item</th><th>Domain</th><th>Aksi</th><th>Keyakinan</th><th>Prioritas</th><th></th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.item}</strong></td>
                  <td>{row.domain}</td>
                  <td><ActionBadge action={row.action}/></td>
                  <td>{row.confidence}%</td>
                  <td>{row.priority}</td>
                  <td><Link className="btn btn-ghost" href={hrefMap[row.item] ?? "/ringkasan"}>Lihat</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
