'use client';

import { getSunProgress, formatTime } from '@/utils/formatters';
import styles from './SunriseSunset.module.css';

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
}

export default function SunriseSunset({ sunrise, sunset }: SunriseSunsetProps) {
  const progress = getSunProgress(sunrise, sunset);
  const angle = progress * 180; // 0° = sunrise, 180° = sunset
  const isDaytime = progress > 0 && progress < 1;

  // SVG arc coordinates
  const cx = 150;
  const cy = 120;
  const r = 100;
  const startAngle = 180; // left
  const endAngle = 0; // right

  // Sun position on arc
  const sunAngle = startAngle - angle;
  const sunRad = (sunAngle * Math.PI) / 180;
  const sunX = cx + r * Math.cos(sunRad);
  const sunY = cy - r * Math.sin(sunRad);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        Sunrise & Sunset
      </h2>

      <div className={styles.arcContainer}>
        <svg viewBox="0 0 300 160" className={styles.arc}>
          {/* Horizon line */}
          <line x1="30" y1={cy} x2="270" y2={cy} stroke="var(--card-border)" strokeWidth="1" strokeDasharray="4,4" />
          
          {/* Arc path */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="2"
            strokeDasharray="6,4"
            opacity="0.4"
          />
          
          {/* Traveled arc */}
          {isDaytime && (
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
              fill="none"
              stroke="var(--color-sun)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          
          {/* Sun indicator */}
          {isDaytime && (
            <g>
              <circle cx={sunX} cy={sunY} r="16" fill="var(--color-sun)" opacity="0.2" />
              <circle cx={sunX} cy={sunY} r="8" fill="var(--color-sun)" />
              <circle cx={sunX} cy={sunY} r="4" fill="#FFF8E1" />
            </g>
          )}
        </svg>
      </div>

      <div className={styles.times}>
        <div className={styles.timeBlock}>
          <span className={styles.timeLabel}>Sunrise</span>
          <span className={styles.timeValue}>{formatTime(sunrise)}</span>
        </div>
        <div className={styles.timeBlock}>
          <span className={styles.timeLabel}>Sunset</span>
          <span className={styles.timeValue}>{formatTime(sunset)}</span>
        </div>
      </div>
    </div>
  );
}
