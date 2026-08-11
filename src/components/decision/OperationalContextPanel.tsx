import type { OperationalContext } from "@/types";

export function OperationalContextPanel({ data }: { data: OperationalContext }) {
  return (
    <section className="ops-panel">
      <h2 className="panel-title">Kondisi operasional</h2>
      <div className="panel-sub">Konteks yang membatasi keputusan procurement.</div>
      <div className="ops-grid">
        <div className="ops-item"><div className="ops-label">Stok tersedia untuk</div><div className="ops-value">{data.inventoryDays} hari</div></div>
        <div className="ops-item"><div className="ops-label">Target stok aman</div><div className="ops-value">{data.safetyStockDays} hari</div></div>
        <div className="ops-item"><div className="ops-label">Kebutuhan pakan</div><div className="ops-value">Naik {data.demandChange}%</div></div>
        <div className="ops-item"><div className="ops-label">Sisa kapasitas gudang</div><div className="ops-value">{data.warehouseCapacity} ton</div></div>
      </div>
    </section>
  );
}
