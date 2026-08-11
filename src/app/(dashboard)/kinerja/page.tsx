import { PageHeader } from "@/components/ui/PageHeader";

export default function KinerjaPage(){
  const metrics=[
    ["MAE","Rp420/kg","Error rata-rata forecast"],
    ["MAPE","3,8%","Error relatif"],
    ["Akurasi arah","73%","UP / DOWN / STABLE"],
    ["Akurasi signal","69%","BUY / WAIT / SELL"]
  ];
  return <>
    <PageHeader title="Kinerja Model" subtitle="Pantau akurasi forecast, kualitas signal, dan kesehatan data."/>
    <div className="kpi-row">{metrics.map(m=><div className="kpi" key={m[0]}><div className="kpi-label">{m[0]}</div><div className="kpi-value">{m[1]}</div><div className="kpi-change">{m[2]}</div></div>)}</div>
    <div className="grid grid-2">
      <section className="panel panel-pad"><h2 className="panel-title">Model aktif</h2><div className="reason-list">
        <div className="reason"><div className="reason-num">01</div><div><div className="reason-title">price-v1.0+rules-v3</div><div className="reason-copy">Status sehat · evaluasi terakhir hari ini.</div></div></div>
        <div className="reason"><div className="reason-num">02</div><div><div className="reason-title">Data freshness</div><div className="reason-copy">Market 12 menit lalu · inventory 18 menit lalu.</div></div></div>
      </div></section>
      <section className="ops-panel"><h2 className="panel-title">Safety rule</h2><p className="reason-copy">Jika keyakinan turun di bawah threshold atau data kritikal stale, sistem menampilkan “Belum ada rekomendasi kuat” alih-alih memaksa BUY/SELL.</p></section>
    </div>
  </>;
}
