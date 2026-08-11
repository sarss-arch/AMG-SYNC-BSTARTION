"use client";

import { useMemo, useState } from "react";
import { compactRupiah } from "@/lib/format";

export function SimulatorClient() {
  const [qty,setQty]=useState(500);
  const [buy,setBuy]=useState(5750);
  const [sell,setSell]=useState(6210);
  const [days,setDays]=useState(5);
  const [storage,setStorage]=useState(35);

  const result = useMemo(()=>{
    const kg = qty * 1000;
    const holding = kg * storage * days;
    const gross = (sell-buy)*kg;
    return { total: buy*kg+holding, gross: gross-holding, unit: (gross-holding)/kg };
  },[qty,buy,sell,days,storage]);

  return (
    <div className="split">
      <section className="panel panel-pad">
        <h2 className="panel-title">Asumsi simulasi</h2>
        <div className="form-grid" style={{marginTop:18}}>
          <div className="field"><label>Jumlah pembelian (ton)</label><input className="input" type="number" value={qty} onChange={e=>setQty(Number(e.target.value))}/></div>
          <div className="field"><label>Harga beli (Rp/kg)</label><input className="input" type="number" value={buy} onChange={e=>setBuy(Number(e.target.value))}/></div>
          <div className="field"><label>Harga pembanding H+7</label><input className="input" type="number" value={sell} onChange={e=>setSell(Number(e.target.value))}/></div>
          <div className="field"><label>Lama penyimpanan (hari)</label><input className="input" type="number" value={days} onChange={e=>setDays(Number(e.target.value))}/></div>
          <div className="field"><label>Biaya simpan per kg/hari</label><input className="input" type="number" value={storage} onChange={e=>setStorage(Number(e.target.value))}/></div>
        </div>
      </section>
      <section className="hero sticky-side">
        <div className="eyebrow"><span className="eyebrow-dot"/>Hasil simulasi</div>
        <h2 className="hero-title" style={{fontSize:32}}>Beli sekarang</h2>
        <div className="grid" style={{marginTop:20}}>
          <div><div className="metric-label">Total biaya</div><div className="metric-value">{compactRupiah(result.total)}</div></div>
          <div><div className="metric-label">Potensi selisih bersih</div><div className="metric-value metric-positive">{compactRupiah(result.gross)}</div></div>
          <div><div className="metric-label">Selisih per kg</div><div className="metric-value">Rp{Math.round(result.unit).toLocaleString("id-ID")}/kg</div></div>
        </div>
        <div className="actions"><button className="btn btn-primary" onClick={()=>alert("Skenario dipilih untuk demo.")}>Gunakan skenario ini</button><button className="btn btn-secondary" onClick={()=>{setQty(500);setBuy(5750);setSell(6210);setDays(5);setStorage(35)}}>Reset</button></div>
      </section>
    </div>
  );
}
