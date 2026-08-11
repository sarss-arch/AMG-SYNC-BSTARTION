import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getApprovals } from "@/services/approval.service";
import { ActionBadge } from "@/components/ui/Badge";
import { compactRupiah } from "@/lib/format";

export default async function ApprovalQueuePage(){
  const rows=await getApprovals();
  return <>
    <PageHeader title="Persetujuan" subtitle="Review permintaan yang membutuhkan otorisasi sebelum dieksekusi."/>
    <section className="panel">
      <table className="data-table"><thead><tr><th>ID</th><th>Item</th><th>Aksi</th><th>Jumlah</th><th>Nilai</th><th>Prioritas</th><th>Status</th><th></th></tr></thead>
      <tbody>{rows.map(r=><tr key={r.id}><td>{r.id}</td><td><strong>{r.item}</strong></td><td><ActionBadge action={r.action}/></td><td>{r.quantity} ton</td><td>{compactRupiah(r.value)}</td><td>{r.priority}</td><td>{r.status}</td><td><Link href={`/persetujuan/${r.id}`} className="btn btn-ghost">Review</Link></td></tr>)}</tbody></table>
    </section>
  </>;
}
