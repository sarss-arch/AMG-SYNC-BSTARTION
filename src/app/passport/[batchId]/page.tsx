import { AmgSyncLogo } from "@/components/brand/AmgSyncLogo";
import { getBatch } from "@/services/traceability.service";

const steps = [
  ["DOC ditempatkan","28 Juni 2026","Cohort DOC tercatat untuk batch produksi ini."],
  ["Siklus farm","29 Juni–30 Juli","Farm ditampilkan pada level wilayah, bukan GPS presisi."],
  ["Harvest","31 Juli 2026","Batch dipanen dan diteruskan ke fasilitas processing."],
  ["Diproses di RPHU","1 Agustus 2026","Hasil processing direkam ke lifecycle batch."],
  ["Cold storage","1 Agustus 2026","Handoff cold-chain tercatat."]
];

export default async function PassportPage({params}:{params:Promise<{batchId:string}>}) {
  const {batchId}=await params;
  const batch=await getBatch(batchId);

  return (
    <div className="passport-shell">
      <article className="passport-card">
        <header className="passport-hero">
          <AmgSyncLogo inverse />
          <div style={{marginTop:22,fontSize:11,opacity:.7}}>HARVEST PASSPORT</div>
          <h1 style={{margin:"5px 0 5px",fontSize:30}}>{batch.id}</h1>
          <div style={{display:"flex",gap:9,alignItems:"center",marginTop:12}}>
            <span className={`badge ${batch.anchorStatus==="VERIFIED"?"badge-verified":batch.anchorStatus==="ANOMALY"?"badge-sell":"badge-wait"}`}>
              {batch.anchorStatus==="VERIFIED"?"✓ Terverifikasi":"Verifikasi tertunda"}
            </span>
          </div>
        </header>

        <div className="timeline">
          <h2 className="panel-title">Perjalanan batch</h2>
          <p className="reason-copy">Ringkasan asal dan proses batch dari DOC hingga cold storage.</p>

          <div style={{marginTop:22}}>
            {steps.map((step,index)=>(
              <div className="timeline-item" key={step[0]}>
                <div className="timeline-dot">{index+1}</div>
                <div>
                  <div className="timeline-title">{step[0]}</div>
                  <div className="metric-note">{step[1]}</div>
                  <div className="timeline-copy">{step[2]}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ops-panel" style={{marginTop:8}}>
            <h3 style={{marginTop:0}}>Tentang verifikasi</h3>
            <p className="reason-copy">
              Passport membuktikan integritas catatan digital batch. Ini bukan klaim bahwa blockchain
              mencegah risiko keamanan pangan secara fisik.
            </p>
            <a href="https://polygonscan.com/" target="_blank" rel="noreferrer" className="btn btn-secondary">
              Lihat explorer (demo)
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
