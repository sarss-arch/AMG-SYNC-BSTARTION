import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";

const materials = [
  { item:"Jagung", price:"Rp5.750/kg", stock:"8,4 hari", action:"BUY", confidence:84, href:"/procurement/jagung" },
  { item:"Bungkil kedelai", price:"Rp8.180/kg", stock:"14,1 hari", action:"WAIT", confidence:71, href:"/procurement/jagung" },
  { item:"Premix", price:"Rp19.400/kg", stock:"18,6 hari", action:"HOLD", confidence:76, href:"/procurement/jagung" }
];

export default function ProcurementPage() {
  return (
    <>
      <PageHeader title="Procurement" subtitle="Prioritas pembelian bahan baku berdasarkan harga, stok, risiko, dan kebutuhan produksi."/>
      <section className="panel">
        <div className="panel-pad"><h2 className="panel-title">Bahan baku yang dipantau</h2></div>
        <table className="data-table">
          <thead><tr><th>Komoditas</th><th>Harga</th><th>Cakupan stok</th><th>Rekomendasi</th><th>Keyakinan</th><th></th></tr></thead>
          <tbody>{materials.map(x=><tr key={x.item}><td><strong>{x.item}</strong></td><td>{x.price}</td><td>{x.stock}</td><td><ActionBadge action={x.action}/></td><td>{x.confidence}%</td><td><Link href={x.href} className="btn btn-ghost">Buka</Link></td></tr>)}</tbody>
        </table>
      </section>
    </>
  );
}
