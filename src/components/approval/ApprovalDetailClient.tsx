"use client";

import { useState } from "react";
import type { Approval, ApprovalStatus } from "@/types";
import { compactRupiah } from "@/lib/format";

export function ApprovalDetailClient({ approval }: { approval: Approval }) {
  const [status,setStatus]=useState<ApprovalStatus>(approval.status);
  const [reason,setReason]=useState("");
  const [quantity,setQuantity]=useState(approval.quantity);
  const [toast,setToast]=useState("");

  function commit(next: ApprovalStatus) {
    if(next==="REJECTED" && !reason.trim()){ setToast("Alasan penolakan wajib diisi."); return; }
    setStatus(next);
    localStorage.setItem(`approval:${approval.id}`, JSON.stringify({status:next,reason,quantity,at:new Date().toISOString()}));
    setToast(`Keputusan tersimpan: ${next}`);
    setTimeout(()=>setToast(""),2200);
  }

  return (
    <>
      <div className="split">
        <section className="panel panel-pad">
          <h2 className="panel-title">Konteks persetujuan</h2>
          <div className="grid grid-3" style={{marginTop:18}}>
            <div><div className="metric-label">Item</div><div className="metric-value">{approval.item}</div></div>
            <div><div className="metric-label">Nilai transaksi</div><div className="metric-value">{compactRupiah(approval.value)}</div></div>
            <div><div className="metric-label">Status</div><div className="metric-value">{status}</div></div>
          </div>
          <div className="form-grid" style={{marginTop:24}}>
            <div className="field"><label>Jumlah final (ton)</label><input className="input" type="number" value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></div>
            <div className="field"><label>Approver</label><input className="input" value={approval.approver} readOnly/></div>
          </div>
          <div className="field" style={{marginTop:14}}><label>Alasan modifikasi / penolakan</label><textarea className="textarea" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Jelaskan alasan bila keputusan diubah atau ditolak."/></div>
        </section>
        <section className="hero sticky-side">
          <div className="eyebrow"><span className="eyebrow-dot"/>Human-in-the-loop</div>
          <h2 className="hero-title" style={{fontSize:32}}>Beli {quantity} ton</h2>
          <div className="page-subtitle">Rekomendasi awal: {approval.quantity} ton · {approval.recommendationId}</div>
          <div className="actions">
            <button className="btn btn-primary" onClick={()=>commit("APPROVED")}>Setujui</button>
            <button className="btn btn-warning" onClick={()=>commit("MODIFIED")}>Simpan perubahan</button>
            <button className="btn btn-danger" onClick={()=>commit("REJECTED")}>Tolak</button>
          </div>
        </section>
      </div>
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
