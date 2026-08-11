"use client";

import { useMemo, useState } from "react";

const initialBids = [
  { id:"SUP-A", supplier:"Maggot Nusantara A", price:7420, volume:50, delivery:5, quality:91, reliability:93, history:88 },
  { id:"SUP-B", supplier:"BSF Mitra Malang", price:7510, volume:100, delivery:7, quality:95, reliability:89, history:92 },
  { id:"SUP-C", supplier:"Circular Feed C", price:7380, volume:75, delivery:4, quality:87, reliability:91, history:84 }
];

function score(row: typeof initialBids[number]) {
  const min = Math.min(...initialBids.map(x=>x.price));
  const max = Math.max(...initialBids.map(x=>x.price));
  const priceScore = max === min ? 100 : 100 - ((row.price - min) / (max - min)) * 20;
  const capacity = Math.min(100, row.volume);
  const delivery = Math.max(60, 100 - row.delivery * 4);
  return Math.round(priceScore*.30 + row.quality*.25 + capacity*.20 + delivery*.15 + row.history*.10);
}

export function FeedExchangeClient() {
  const [selected, setSelected] = useState<string>("SUP-B");
  const [status, setStatus] = useState("Open Bid aktif · tutup dalam 48 jam");
  const ranked = useMemo(
    () => initialBids.map(row => ({...row, score:score(row)})).sort((a,b)=>b.score-a.score),
    []
  );

  function choose(id:string) {
    setSelected(id);
    const item = ranked.find(x=>x.id===id);
    setStatus(item ? `${item.supplier} dipilih sebagai preferred bid untuk demo.` : status);
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot"/>Open Bid #AMG-0826</div>
        <h2 className="hero-title">100 ton Maggot / BSF</h2>
        <p className="hero-lead">Delivery maksimal 7 hari · tujuan Malang · supplier terverifikasi.</p>
        <div className="metric-grid" style={{gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
          <div><div className="metric-label">Bid masuk</div><div className="metric-value">{ranked.length}</div></div>
          <div><div className="metric-label">Best score</div><div className="metric-value">{ranked[0].score}/100</div></div>
          <div><div className="metric-label">Best price</div><div className="metric-value">Rp7.380/kg</div></div>
          <div><div className="metric-label">Status</div><div className="metric-value" style={{fontSize:15}}>48 jam</div></div>
        </div>
      </section>

      <div style={{height:17}}/>

      <section className="panel">
        <div className="panel-pad">
          <h2 className="panel-title">Supplier ranking</h2>
          <div className="panel-sub">Best Value ≠ harga termurah. Score demo: 30% price · 25% quality · 20% capacity · 15% delivery · 10% historical performance.</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Rank</th><th>Supplier</th><th>Harga</th><th>Volume</th><th>Delivery</th><th>Quality</th><th>Score</th><th></th></tr></thead>
            <tbody>
              {ranked.map((row,index) => (
                <tr key={row.id}>
                  <td><strong>#{index+1}</strong></td>
                  <td><strong>{row.supplier}</strong></td>
                  <td>Rp{row.price.toLocaleString("id-ID")}/kg</td>
                  <td>{row.volume} ton</td>
                  <td>{row.delivery} hari</td>
                  <td>{row.quality}/100</td>
                  <td style={{minWidth:150}}>
                    <div className="feed-score">
                      <div className="score-track"><div className="score-fill" style={{width:`${row.score}%`}}/></div>
                      <div className="score-number">{row.score}</div>
                    </div>
                  </td>
                  <td><button className={`btn ${selected===row.id?"btn-primary":"btn-ghost"}`} onClick={()=>choose(row.id)}>{selected===row.id?"Dipilih":"Pilih"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{height:17}}/>
      <div className="grid grid-2">
        <section className="ops-panel">
          <h2 className="panel-title">Decision rule</h2>
          <div className="reason-list">
            <div className="reason"><div className="reason-num">30</div><div><div className="reason-title">Price</div><div className="reason-copy">Harga kompetitif tanpa mengorbankan kualitas.</div></div></div>
            <div className="reason"><div className="reason-num">25</div><div><div className="reason-title">Quality</div><div className="reason-copy">Kualitas bahan dan konsistensi spesifikasi.</div></div></div>
            <div className="reason"><div className="reason-num">20</div><div><div className="reason-title">Capacity</div><div className="reason-copy">Kemampuan memenuhi volume yang dibutuhkan.</div></div></div>
          </div>
        </section>
        <section className="panel panel-pad">
          <h2 className="panel-title">Aksi</h2>
          <div className="reason-copy" style={{marginTop:8}}>{status}</div>
          <div className="actions">
            <button className="btn btn-primary" onClick={()=>setStatus("Purchase Order demo berhasil dibuat dari preferred bid.")}>Buat Purchase Order</button>
            <button className="btn btn-secondary" onClick={()=>setStatus("Notifikasi Open Bid demo dikirim ke channel supplier.")}>Kirim notifikasi supplier</button>
          </div>
        </section>
      </div>
    </>
  );
}
