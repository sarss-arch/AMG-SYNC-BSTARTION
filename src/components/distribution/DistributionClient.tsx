"use client";

import { useState } from "react";

const allocations = [
  { id:"ALC-01", destination:"Fithub Malang", product:"Chicken breast", qty:"300 kg", eta:"Rabu 10.00", status:"Siap dialokasikan" },
  { id:"ALC-02", destination:"RS Bunda Jakarta", product:"Whole chicken", qty:"200 kg", eta:"Kamis 08.00", status:"Menunggu cold-chain slot" },
  { id:"ALC-03", destination:"Cluster sekolah A", product:"Processed protein", qty:"420 kg", eta:"Jumat 07.00", status:"Siap dialokasikan" }
];

export function DistributionClient() {
  const [rows,setRows]=useState(allocations);

  function dispatch(id:string) {
    setRows(prev=>prev.map(row=>row.id===id?{...row,status:"Dispatch demo dibuat"}:row));
  }

  return (
    <section className="panel">
      <div className="panel-pad">
        <h2 className="panel-title">Allocation queue</h2>
        <div className="panel-sub">WMS/TMS nantinya menjadi execution layer; AMG SYNC tetap menjadi decision layer.</div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Tujuan</th><th>Produk</th><th>Qty</th><th>ETA</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(row=>(
              <tr key={row.id}>
                <td>{row.id}</td><td><strong>{row.destination}</strong></td><td>{row.product}</td><td>{row.qty}</td><td>{row.eta}</td><td>{row.status}</td>
                <td><button className="btn btn-ghost" onClick={()=>dispatch(row.id)}>Buat dispatch</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
