import { cornCandles, cornForecast } from "@/data/mock/market";

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCornMarketData() {
  await delay();
  return {
    item: "Jagung",
    region: "Jawa Timur",
    currentPrice: 5750,
    changePercent: 2.4,
    volatility: "Rendah",
    stableWindow: "9–12 Agustus",
    candles: cornCandles,
    forecast: cornForecast,
    lastUpdated: "12 menit lalu"
  };
}
