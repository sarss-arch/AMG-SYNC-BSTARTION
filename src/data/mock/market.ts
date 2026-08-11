import type { Candle, ForecastPoint } from "@/types";

// DEMO / MOCK DATA — bukan data aktual AMG.
// Data deterministic supaya hasil chart stabil dan tidak berubah setiap render.
function isoDate(offsetFromEnd: number) {
  const d = new Date("2026-08-11T00:00:00+07:00");
  d.setDate(d.getDate() - offsetFromEnd);
  return d.toISOString().slice(0, 10);
}

export const cornCandles: Candle[] = Array.from({ length: 365 }, (_, index) => {
  const remaining = 364 - index;
  const trend = 4900 + index * 2.1;
  const cycleA = Math.sin(index / 13) * 260;
  const cycleB = Math.sin(index / 37) * 185;
  const shock =
    index > 88 && index < 108 ? 380 * Math.sin(((index - 88) / 20) * Math.PI) :
    index > 218 && index < 236 ? -310 * Math.sin(((index - 218) / 18) * Math.PI) :
    0;

  const closeRaw = trend + cycleA + cycleB + shock;
  const openRaw = closeRaw + Math.sin(index * 1.73) * 92;
  const highRaw = Math.max(openRaw, closeRaw) + 60 + Math.abs(Math.sin(index / 4)) * 90;
  const lowRaw = Math.min(openRaw, closeRaw) - 55 - Math.abs(Math.cos(index / 5)) * 78;

  return {
    time: isoDate(remaining),
    open: Math.round(openRaw),
    high: Math.round(highRaw),
    low: Math.round(lowRaw),
    close: Math.round(closeRaw),
    volume: Math.round(1100 + (Math.sin(index / 7) + 1) * 420 + (index % 9) * 35)
  };
});

// Paksa titik akhir agar sesuai angka demo yang dipakai di UI.
cornCandles[cornCandles.length - 1] = {
  ...cornCandles[cornCandles.length - 1],
  open: 5688,
  high: 5824,
  low: 5652,
  close: 5750,
  volume: 1672
};

export const cornForecast: ForecastPoint[] = [
  { time: "2026-08-12", value: 5810, lower: 5700, upper: 5910 },
  { time: "2026-08-13", value: 5875, lower: 5730, upper: 6000 },
  { time: "2026-08-14", value: 5940, lower: 5770, upper: 6080 },
  { time: "2026-08-15", value: 6005, lower: 5800, upper: 6160 },
  { time: "2026-08-16", value: 6080, lower: 5840, upper: 6240 },
  { time: "2026-08-17", value: 6145, lower: 5880, upper: 6320 },
  { time: "2026-08-18", value: 6210, lower: 5940, upper: 6380 }
];
