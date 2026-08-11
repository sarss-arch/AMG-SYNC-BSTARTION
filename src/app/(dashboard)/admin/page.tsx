"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";

const users=[
  ["Andi Pratama","Citra Ina Feedmill","Procurement Manager","Forecast, Simulation, Approve"],
  ["Rina Putri","Citra Ina Feedmill","Procurement Analyst","Forecast, Simulation, Create Request"],
  ["Sinta Wijaya","AMG Group","Group Executive","Group View, Large Approval"],
  ["Dewi Laras","AMG Group","QA/Compliance","Traceability, Integrity Review"]
];

export default function AdminPage(){
  const [query,setQuery]=useState("");
  const filtered=users.filter(u=>u.join(" ").toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageHeader title="Administrasi Akses" subtitle="Kelola user, perusahaan, role, permission, dan data scope."/>
    <section className="panel">
      <div className="panel-pad" style={{display:"flex",justifyContent:"space-between",gap:12}}><div><h2 className="panel-title">User & role</h2><div className="panel-sub">Frontend hanya menyembunyikan kontrol; backend tetap sumber otorisasi final.</div></div><input className="input" style={{maxWidth:280}} placeholder="Cari user..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <table className="data-table"><thead><tr><th>User</th><th>Company</th><th>Role</th><th>Permission ringkas</th><th></th></tr></thead>
      <tbody>{filtered.map(r=><tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><button className="btn btn-ghost" onClick={()=>alert("Editor permission prototype")}>Kelola</button></td></tr>)}</tbody></table>
    </section>
  </>;
}
