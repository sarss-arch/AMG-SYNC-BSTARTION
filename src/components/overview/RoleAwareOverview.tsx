"use client";

import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";
import { workspaceDashboards } from "@/data/mock/workspaceDashboards";
import { cornRecommendation, operationalContext } from "@/data/mock/decisions";
import { cornCandles, cornForecast } from "@/data/mock/market";
import { RecommendationHero } from "@/components/decision/RecommendationHero";
import { ReasonPanel } from "@/components/decision/ReasonPanel";
import { OperationalContextPanel } from "@/components/decision/OperationalContextPanel";
import { BusinessRiskStrip } from "@/components/decision/BusinessRiskStrip";
import { CandlestickChart } from "@/components/market/CandlestickChart";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

const engineCards = [
  { no: "01", title: "Price AI", copy: "Prediksi harga bahan baku dan kebutuhan feed.", href: "/feed-ai" },
  { no: "02", title: "Feed Exchange", copy: "Compare, open bid, supplier score, dan purchase recommendation.", href: "/feed-exchange" },
  { no: "03", title: "TraceChain", copy: "Digital identity batch dari farm sampai cold-chain.", href: "/traceability" },
  { no: "04", title: "Demand AI", copy: "Baca kebutuhan protein per segmen dan lokasi.", href: "/demand" },
  { no: "05", title: "Smart Distribution", copy: "Alokasikan produk berdasarkan demand yang terukur.", href: "/distribution" }
];

const groupDecisions = [
  { code: "CIF", title: "Beli jagung 500 ton", sub: "Sebelum 12 Agustus · feed-cost protection", action: "BUY", confidence: "84%" },
  { code: "GSU", title: "Panen GSU-03 24 ton", sub: "Slot RPHU tersedia · live weight optimal", action: "HARVEST", confidence: "81%" },
  { code: "AMP", title: "Jual karkas beku 38 ton", sub: "Demand aktif · inventory aging risk", action: "SELL", confidence: "79%" },
  { code: "MPS", title: "Tahan soybean meal", sub: "Outlook H+14 melemah", action: "WAIT", confidence: "72%" }
];

export function RoleAwareOverview() {
  const { workspace, membership } = useWorkspace();
  if (!workspace || !membership) return null;

  if (workspace.id === "CIF") {
    return (
      <>
        <PageHeader
          title="Ringkasan Keputusan"
          subtitle="Keputusan procurement yang perlu dicek hari ini."
          meta={<><span>Citra Ina Feedmill</span><span>•</span><span>Diperbarui 12 menit lalu</span></>}
        />
        <div className="grid grid-2">
          <div className="grid">
            <RecommendationHero item={cornRecommendation} />
            <BusinessRiskStrip impact={cornRecommendation.costDelayImpact} />
            <CandlestickChart candles={cornCandles} forecast={cornForecast} compact />
          </div>
          <div className="grid" style={{alignContent:"start"}}>
            <ReasonPanel reasons={cornRecommendation.reasons} />
            <OperationalContextPanel data={operationalContext} />
          </div>
        </div>
      </>
    );
  }

  if (workspace.id === "AMG") {
    return (
      <>
        <PageHeader
          title="AMG Control Tower"
          subtitle="Satu view untuk menyelaraskan keputusan feed, produksi, traceability, demand, dan distribusi lintas perusahaan."
          meta={<><span>{membership.roleName}</span><span>•</span><span>7 workspace terhubung</span></>}
        />

        <section className="control-hero">
          <div className="eyebrow" style={{color:"#1D2512"}}><span className="eyebrow-dot"/>AMG Protein Ecosystem</div>
          <h2>From feed to family, setiap keputusan bergerak di satu data backbone.</h2>
          <p>
            Control Tower menggabungkan price intelligence, smart sourcing, traceability,
            demand mapping, dan distribution allocation untuk membantu AMG bertindak lebih cepat.
          </p>
          <div className="flow-ribbon">
            {["Predict","Source","Trace","Distribute"].map((step, index) => (
              <span key={step} style={{display:"contents"}}>
                <span className="flow-step">{step}</span>
                {index < 3 ? <span className="flow-arrow">→</span> : null}
              </span>
            ))}
          </div>
        </section>

        <div style={{height:16}} />

        <div className="engine-grid">
          {engineCards.map((engine) => (
            <Link href={engine.href} className="engine-card" key={engine.no}>
              <div className="engine-card-index">{engine.no}</div>
              <h3>{engine.title}</h3>
              <p>{engine.copy}</p>
            </Link>
          ))}
        </div>

        <div style={{height:17}} />

        <div className="grid grid-2">
          <section className="panel panel-pad">
            <h2 className="panel-title">Keputusan lintas perusahaan</h2>
            <div className="panel-sub">Prioritas yang paling berdampak pada operasi grup hari ini.</div>
            <div className="company-decision-list" style={{marginTop:12}}>
              {groupDecisions.map((item) => (
                <div className="company-decision" key={item.code + item.title}>
                  <div className="company-code">{item.code}</div>
                  <div>
                    <div className="company-decision-title">{item.title}</div>
                    <div className="company-decision-sub">{item.sub}</div>
                  </div>
                  <ActionBadge action={item.action} />
                  <strong style={{fontSize:11}}>{item.confidence}</strong>
                </div>
              ))}
            </div>
          </section>

          <div className="grid">
            <section className="ops-panel">
              <h2 className="panel-title">Group margin watch</h2>
              <div className="ops-grid">
                <div className="ops-item"><div className="ops-label">Feed cost exposure</div><div className="ops-value">+Rp420/kg</div></div>
                <div className="ops-item"><div className="ops-label">RPHU utilization</div><div className="ops-value">71%</div></div>
                <div className="ops-item"><div className="ops-label">Demand 7 hari</div><div className="ops-value">+5,7%</div></div>
                <div className="ops-item"><div className="ops-label">Trace verified</div><div className="ops-value">96,8%</div></div>
              </div>
            </section>

            <section className="panel panel-pad">
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <Icon name="refresh" size={19}/>
                <h2 className="panel-title">Circular loop</h2>
              </div>
              <div className="reason-copy" style={{marginTop:8}}>
                Chicken manure → mitra maggot lokal → BSF/alternative feed → feed AMG.
              </div>
              <div className="actions"><Link href="/circular" className="btn btn-ghost">Lihat ekosistem</Link></div>
            </section>
          </div>
        </div>
      </>
    );
  }

  const profile = workspaceDashboards[workspace.id as keyof typeof workspaceDashboards];
  if (!profile) return null;

  return (
    <>
      <PageHeader
        title={profile.title}
        subtitle={profile.subtitle}
        meta={<><span>{workspace.shortName}</span><span>•</span><span>{membership.roleName}</span></>}
      />

      <div className="kpi-row">
        {profile.kpis.map((item) => (
          <div className="kpi" key={item.label}>
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value">{item.value}</div>
            <div className="kpi-change">{item.note}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-dot"/>{profile.recommendation.label}</div>
          <h2 className="hero-title">{profile.recommendation.title}</h2>
          <p className="hero-lead">{profile.recommendation.lead}</p>
          <div className="hero-deadline">{profile.recommendation.deadline}</div>

          <div className="metric-grid" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
            <div><div className="metric-label">Tingkat keyakinan</div><div className="metric-value">{profile.recommendation.confidence}%</div></div>
            <div><div className="metric-label">Risiko</div><div className="metric-value">{profile.recommendation.risk}</div></div>
          </div>

          <div className="actions">
            <Link href={profile.recommendation.href} className="btn btn-primary">
              {profile.recommendation.actionLabel} <Icon name="arrow" size={16}/>
            </Link>
          </div>
        </section>

        <section className="ops-panel">
          <h2 className="panel-title">Data yang diprioritaskan</h2>
          <div className="reason-list">
            <div className="reason"><div className="reason-num">01</div><div><div className="reason-title">Sesuai fungsi perusahaan</div><div className="reason-copy">Dashboard tidak menampilkan seluruh data grup; hanya konteks yang relevan dengan workspace ini.</div></div></div>
            <div className="reason"><div className="reason-num">02</div><div><div className="reason-title">Role-aware</div><div className="reason-copy">Menu dan action mengikuti membership role dari akun yang login.</div></div></div>
            <div className="reason"><div className="reason-num">03</div><div><div className="reason-title">Shared operational view</div><div className="reason-copy">Data lintas perusahaan hanya ditampilkan jika diperlukan untuk keputusan operasional.</div></div></div>
          </div>
        </section>
      </div>
    </>
  );
}
