import { PageHeader } from "@/components/ui/PageHeader";
import { DistributionClient } from "@/components/distribution/DistributionClient";

export default function DistributionPage() {
  return (
    <>
      <PageHeader
        title="Smart Distribution"
        subtitle="Ubah distribution dari warehouse-driven menjadi demand-driven allocation."
      />
      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Demand aktif</div><div className="kpi-value">920 kg</div><div className="kpi-change">3 priority destination</div></div>
        <div className="kpi"><div className="kpi-label">Cold-chain slots</div><div className="kpi-value">7/9</div><div className="kpi-change">2 slot tersedia</div></div>
        <div className="kpi"><div className="kpi-label">On-time projection</div><div className="kpi-value">96%</div><div className="kpi-change">Demo KPI</div></div>
        <div className="kpi"><div className="kpi-label">Spoilage risk</div><div className="kpi-value">Rendah</div><div className="kpi-change">Current inventory mix</div></div>
      </div>
      <DistributionClient />
    </>
  );
}
