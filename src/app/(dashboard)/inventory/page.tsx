import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";

const rows = [
  ["CIF Warehouse A","Jagung","1.240 ton","8,4 hari","67%","BUY"],
  ["CIF Warehouse B","Soybean meal","620 ton","14,1 hari","48%","WAIT"],
  ["AMP Cold Storage","Karkas beku","84 ton","6,1 hari","82%","SELL"],
  ["AMP Cold Storage","Boneless breast","29 ton","7,4 hari","71%","HOLD"]
];

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory Intelligence"
        subtitle="Posisi stock, coverage, capacity, stockout risk, overstock risk, dan decision context lintas lokasi."
      />

      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Feed raw material</div><div className="kpi-value">1.860 ton</div><div className="kpi-change">CIF monitored inventory</div></div>
        <div className="kpi"><div className="kpi-label">Frozen inventory</div><div className="kpi-value">113 ton</div><div className="kpi-change">AMP cold storage</div></div>
        <div className="kpi"><div className="kpi-label">Stockout watch</div><div className="kpi-value">1 item</div><div className="kpi-change">Jagung below safety target</div></div>
        <div className="kpi"><div className="kpi-label">Overstock watch</div><div className="kpi-value">1 item</div><div className="kpi-change">Frozen carcass aging</div></div>
      </div>

      <section className="panel">
        <div className="panel-pad"><h2 className="panel-title">Stock position</h2></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Lokasi</th><th>Item</th><th>Stock</th><th>Coverage</th><th>Capacity</th><th>Decision</th></tr></thead>
            <tbody>{rows.map(row=>(
              <tr key={row[0]+row[1]}><td>{row[0]}</td><td><strong>{row[1]}</strong></td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td><ActionBadge action={row[5]}/></td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
