import { PageHeader } from "@/components/ui/PageHeader";
import { CandlestickChart } from "@/components/market/CandlestickChart";
import { getCornMarketData } from "@/services/market.service";

export default async function PasarPage() {
  const market = await getCornMarketData();
  return (
    <>
      <PageHeader title="Intelijen Pasar" subtitle="Baca harga historis, OHLC, tren, volatilitas, dan proyeksi sebelum mengambil keputusan." meta={<><span>{market.item}</span><span>•</span><span>{market.region}</span></>}/>
      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Harga saat ini</div><div className="kpi-value">Rp5.750/kg</div><div className="kpi-change">↑ 2,4% hari ini</div></div>
        <div className="kpi"><div className="kpi-label">30 hari tertinggi</div><div className="kpi-value">Rp5.960</div><div className="kpi-change">Area resistensi terbaru</div></div>
        <div className="kpi"><div className="kpi-label">Volatilitas</div><div className="kpi-value">Rendah</div><div className="kpi-change">Risiko jangka pendek terkendali</div></div>
        <div className="kpi"><div className="kpi-label">Window pembelian</div><div className="kpi-value">9–12 Agu</div><div className="kpi-change">Berdasarkan forecast + inventory</div></div>
      </div>
      <CandlestickChart candles={market.candles} forecast={market.forecast}/>
    </>
  );
}
