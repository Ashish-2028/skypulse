'use client';

import { HourlyForecast, TemperatureUnit } from '@/types/weather';
import styles from './TemperatureChart.module.css';

interface TemperatureChartProps {
  hourly: HourlyForecast;
  unit: TemperatureUnit;
}

export default function TemperatureChart({ hourly, unit }: TemperatureChartProps) {
  // Get next 24 hours
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(
    (t) => new Date(t).getHours() === now.getHours() && new Date(t).getDate() === now.getDate()
  );
  const startIndex = Math.max(0, currentHourIndex);
  const count = 24;
  const indices = Array.from({ length: count }, (_, i) => startIndex + i).filter(
    (i) => i < hourly.time.length
  );

  const temps = indices.map((i) => {
    const t = hourly.temperature[i];
    return unit === 'fahrenheit' ? (t * 9) / 5 + 32 : t;
  });

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  // SVG dimensions
  const width = 800;
  const height = 200;
  const padding = { top: 30, bottom: 40, left: 10, right: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Build points
  const points = temps.map((temp, i) => ({
    x: padding.left + (i / (temps.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((temp - minTemp) / range) * chartHeight,
    temp,
    time: indices[i] < hourly.time.length ? hourly.time[indices[i]] : '',
  }));

  // Build SVG path (smooth curve)
  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) / 3;
      const cpx2 = p.x - (p.x - prev.x) / 3;
      return `C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
    })
    .join(' ');

  // Area fill path
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        Temperature Trend
      </h2>
      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = padding.top + chartHeight * (1 - frac);
            const temp = minTemp + range * frac;
            return (
              <g key={frac}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--card-border)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={width - 5}
                  y={y - 4}
                  fill="var(--text-tertiary)"
                  fontSize="11"
                  textAnchor="end"
                >
                  {Math.round(temp)}°
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#tempGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots at key times */}
          {points
            .filter((_, i) => i % 3 === 0)
            .map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill="var(--accent)"
                />
                <text
                  x={p.x}
                  y={height - padding.bottom + 18}
                  fill="var(--text-tertiary)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {new Date(p.time).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                </text>
              </g>
            ))}
        </svg>
      </div>
    </div>
  );
}
