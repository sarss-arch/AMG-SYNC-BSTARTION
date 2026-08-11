"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  createSeriesMarkers,
  HistogramSeries,
  LineSeries,
  LineStyle,
  type Time
} from "lightweight-charts";
import type { Candle, ForecastPoint } from "@/types";

const COLORS = {
  olive: "#3D5300",
  oliveSoft: "#71863F",
  sage: "#ABB97C",
  orange: "#F0931A",
  terracotta: "#A9543A",
  muted: "#7D856E",
  grid: "rgba(61,83,0,.075)"
};

function movingAverage(data: Candle[], length: number) {
  return data
    .map((point, i) => {
      if (i < length - 1) return null;
      const chunk = data.slice(i - length + 1, i + 1);
      return {
        time: point.time as Time,
        value: Math.round(chunk.reduce((sum, item) => sum + item.close, 0) / length)
      };
    })
    .filter(Boolean) as { time: Time; value: number }[];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

const RANGE_DAYS: Record<string, number> = {
  "7H": 7,
  "30H": 30,
  "3B": 90,
  "6B": 180,
  "1T": 365
};

export function CandlestickChart({
  candles,
  forecast,
  compact = false
}: {
  candles: Candle[];
  forecast: ForecastPoint[];
  compact?: boolean;
}) {
  const el = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [range, setRange] = useState(compact ? "30H" : "3B");

  const visibleCandles = useMemo(() => {
    const days = RANGE_DAYS[range] ?? 90;
    return candles.slice(-days);
  }, [candles, range]);

  useEffect(() => {
    if (!el.current) return;
    const container = el.current;

    const chart = createChart(container, {
      autoSize: true,
      height: compact ? 330 : 430,
      layout: {
        background: { type: ColorType.Solid, color: "#FFFDF7" },
        textColor: "#6A735F",
        fontFamily: '"Plus Jakarta Sans","Segoe UI",sans-serif',
        fontSize: 10
      },
      grid: {
        vertLines: { color: COLORS.grid },
        horzLines: { color: COLORS.grid }
      },
      rightPriceScale: {
        borderColor: "rgba(61,83,0,.13)",
        scaleMargins: { top: 0.08, bottom: 0.24 }
      },
      timeScale: {
        borderColor: "rgba(61,83,0,.13)",
        timeVisible: false,
        rightOffset: 6,
        barSpacing: compact ? 9 : 11,
        minBarSpacing: 4,
        fixLeftEdge: false,
        fixRightEdge: false
      },
      crosshair: {
        vertLine: { color: "rgba(61,83,0,.27)", labelBackgroundColor: COLORS.olive },
        horzLine: { color: "rgba(61,83,0,.27)", labelBackgroundColor: COLORS.olive }
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true }
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: COLORS.olive,
      downColor: COLORS.terracotta,
      borderVisible: false,
      wickUpColor: COLORS.olive,
      wickDownColor: COLORS.terracotta,
      priceLineVisible: true,
      priceLineColor: COLORS.olive,
      lastValueVisible: true
    });

    const candleData = visibleCandles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    }));
    candleSeries.setData(candleData);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.84, bottom: 0 } });
    volumeSeries.setData(
      visibleCandles.map((c) => ({
        time: c.time as Time,
        value: c.volume,
        color: c.close >= c.open ? "rgba(61,83,0,.24)" : "rgba(169,84,58,.20)"
      }))
    );

    const ma7 = chart.addSeries(LineSeries, {
      color: COLORS.orange, lineWidth: 2, priceLineVisible: false, lastValueVisible: false
    });
    ma7.setData(movingAverage(visibleCandles, Math.min(7, visibleCandles.length)));

    if (visibleCandles.length >= 14) {
      const ma14 = chart.addSeries(LineSeries, {
        color: COLORS.oliveSoft, lineWidth: 1, priceLineVisible: false, lastValueVisible: false
      });
      ma14.setData(movingAverage(visibleCandles, 14));
    }

    if (visibleCandles.length >= 30) {
      const ma30 = chart.addSeries(LineSeries, {
        color: COLORS.muted, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false
      });
      ma30.setData(movingAverage(visibleCandles, 30));
    }

    const forecastArea = chart.addSeries(AreaSeries, {
      lineColor: COLORS.orange,
      topColor: "rgba(240,147,26,.17)",
      bottomColor: "rgba(240,147,26,.025)",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      priceLineVisible: false,
      lastValueVisible: true
    });
    forecastArea.setData(forecast.map((p) => ({ time: p.time as Time, value: p.value })));

    const upperBand = chart.addSeries(LineSeries, {
      color: "rgba(240,147,26,.42)", lineWidth: 1, lineStyle: LineStyle.Dashed,
      priceLineVisible: false, lastValueVisible: false
    });
    upperBand.setData(forecast.map((p) => ({ time: p.time as Time, value: p.upper })));

    const lowerBand = chart.addSeries(LineSeries, {
      color: "rgba(171,185,124,.88)", lineWidth: 1, lineStyle: LineStyle.Dashed,
      priceLineVisible: false, lastValueVisible: false
    });
    lowerBand.setData(forecast.map((p) => ({ time: p.time as Time, value: p.lower })));

    const markerSource = visibleCandles;
    const markers = [];
    if (markerSource.length >= 20) {
      markers.push({
        time: markerSource[Math.floor(markerSource.length * 0.35)].time as Time,
        position: "aboveBar" as const,
        color: COLORS.orange,
        shape: "circle" as const,
        text: "Puncak lokal"
      });
      markers.push({
        time: markerSource[Math.floor(markerSource.length * 0.68)].time as Time,
        position: "belowBar" as const,
        color: COLORS.terracotta,
        shape: "arrowUp" as const,
        text: "Area harga rendah"
      });
    }
    markers.push({
      time: markerSource[markerSource.length - 1].time as Time,
      position: "aboveBar" as const,
      color: COLORS.olive,
      shape: "circle" as const,
      text: "Hari ini"
    });
    createSeriesMarkers(candleSeries, markers);

    chart.subscribeCrosshairMove((param) => {
      const tooltip = tooltipRef.current;
      if (!tooltip || !param.point || !param.time) {
        if (tooltip) tooltip.style.display = "none";
        return;
      }

      const data = param.seriesData.get(candleSeries) as
        | { open: number; high: number; low: number; close: number }
        | undefined;

      if (!data) {
        tooltip.style.display = "none";
        return;
      }

      const x = Math.min(param.point.x + 16, container.clientWidth - 188);
      const y = Math.max(10, Math.min(param.point.y - 26, container.clientHeight - 112));
      tooltip.style.display = "block";
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.innerHTML = `
        <strong>${String(param.time)}</strong>
        <div class="chart-tooltip-grid">
          <span>Open</span><b>Rp${formatNumber(data.open)}</b>
          <span>High</span><b>Rp${formatNumber(data.high)}</b>
          <span>Low</span><b>Rp${formatNumber(data.low)}</b>
          <span>Close</span><b>Rp${formatNumber(data.close)}</b>
        </div>
      `;
    });

    chart.timeScale().fitContent();

    const resize = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth });
    });
    resize.observe(container);

    return () => {
      resize.disconnect();
      chart.remove();
    };
  }, [visibleCandles, forecast, compact]);

  return (
    <section className="chart-panel">
      <div className="chart-head">
        <div>
          <h2 className="panel-title">Candlestick harga jagung</h2>
          <div className="panel-sub">OHLC • volume • MA7/14/30 • proyeksi H+7 • rentang prediksi</div>
        </div>
        <div className="time-tabs" aria-label="Rentang waktu chart">
          {Object.keys(RANGE_DAYS).map((item) => (
            <button
              type="button"
              key={item}
              className={`time-tab ${range === item ? "active" : ""}`}
              onClick={() => setRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {!compact ? (
        <>
          <div className="chart-summary">
            <div><div className="metric-label">Harga hari ini</div><div className="metric-value" style={{fontSize:15}}>Rp5.750/kg</div></div>
            <div><div className="metric-label">Perkiraan 7 hari</div><div className="metric-value" style={{fontSize:15}}>Rp6.210/kg</div></div>
            <div><div className="metric-label">Volatilitas</div><div className="metric-value metric-positive" style={{fontSize:15}}>Rendah</div></div>
            <div><div className="metric-label">Waktu beli disarankan</div><div className="metric-value" style={{fontSize:15}}>9–12 Agustus</div></div>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><i className="legend-line" style={{background:"#3D5300"}}/> Candle naik</span>
            <span className="legend-item"><i className="legend-line" style={{background:"#A9543A"}}/> Candle turun</span>
            <span className="legend-item"><i className="legend-line" style={{background:"#F0931A"}}/> MA7 / proyeksi</span>
            <span className="legend-item"><i className="legend-line" style={{background:"#ABB97C"}}/> Rentang bawah</span>
          </div>
        </>
      ) : null}

      <div className="chart-box" style={compact ? {height:350} : undefined}>
        <div ref={el} style={{width:"100%",height:"100%"}} />
        <div ref={tooltipRef} className="chart-tooltip" />
      </div>

      <div className="chart-attribution">
        Visualisasi menggunakan <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">TradingView Lightweight Charts™</a>.
        Data pada prototype adalah DEMO / MOCK DATA.
      </div>
    </section>
  );
}
