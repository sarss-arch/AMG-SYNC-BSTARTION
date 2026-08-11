"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";

const initial=[
  {name:"Harga pasar jagung",type:"Market API",fresh:"12 menit lalu",status:"Sehat"},
  {name:"Inventory CIF",type:"Internal DB",fresh:"18 menit lalu",status:"Sehat"},
  {name:"Demand feed",type:"Internal API",fresh:"34 menit lalu",status:"Sehat"},
  {name:"Supplier quotation",type:"CSV/SFTP",fresh:"2 jam lalu",status:"Perlu cek"}
];

export default function DataSourcesPage(){
  const [rows,setRows]=useState(initial);
  return <>
    <PageHeader title="Sumber Data" subtitle="Pantau freshness, sumber, dan kualitas data yang masuk ke Decision Engine."/>
    <section className="panel">
      <table className="data-table"><thead><tr><th>Sumber</th><th>Tipe</th><th>Update terakhir</th><th>Status</th><th></th></tr></thead>
      <tbody>{rows.map((r,i)=><tr key={r.name}><td><strong>{r.name}</strong></td><td>{r.type}</td><td>{r.fresh}</td><td>{r.status}</td><td><button className="btn btn-ghost" onClick={()=>setRows(x=>x.map((a,j)=>j===i?{...a,fresh:"baru saja",status:"Sehat"}:a))}>Sinkronkan</button></td></tr>)}</tbody></table>
    </section>
  </>;
}
