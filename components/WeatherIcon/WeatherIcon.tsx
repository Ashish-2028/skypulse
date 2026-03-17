'use client';

import styles from './WeatherIcon.module.css';

interface WeatherIconProps {
  code: number;
  isDay?: boolean | number;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ code, isDay = true, size = 64, className = '' }: WeatherIconProps) {
  const day = isDay === true || isDay === 1;
  const iconClass = `${styles.icon} ${className}`;

  return (
    <div className={iconClass} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {renderWeatherSVG(code, day)}
      </svg>
    </div>
  );
}

function renderWeatherSVG(code: number, isDay: boolean) {
  // Clear sky
  if (code === 0) {
    return isDay ? <Sun /> : <Moon />;
  }
  // Mainly clear
  if (code === 1) {
    return isDay ? <SunPartial /> : <MoonPartial />;
  }
  // Partly cloudy
  if (code === 2) {
    return isDay ? <SunCloudy /> : <MoonCloudy />;
  }
  // Overcast
  if (code === 3) {
    return <Overcast />;
  }
  // Fog
  if (code === 45 || code === 48) {
    return <Fog />;
  }
  // Drizzle
  if (code >= 51 && code <= 57) {
    return <Drizzle />;
  }
  // Rain
  if (code >= 61 && code <= 67) {
    return code === 65 || code === 67 ? <HeavyRain /> : <Rain />;
  }
  // Snow
  if (code >= 71 && code <= 77) {
    return code === 75 ? <HeavySnow /> : <Snow />;
  }
  // Rain showers
  if (code >= 80 && code <= 82) {
    return code === 82 ? <HeavyRain /> : <RainShower isDay={isDay} />;
  }
  // Snow showers
  if (code === 85 || code === 86) {
    return <Snow />;
  }
  // Thunderstorm
  if (code >= 95) {
    return <Thunderstorm />;
  }
  return <Sun />;
}

// ============== SVG Icon Components ==============

function Sun() {
  return (
    <g>
      {/* Outer glow */}
      <circle cx="50" cy="50" r="32" fill="url(#sunGlow)" opacity="0.3">
        <animate attributeName="r" values="32;35;32" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="50" y1="50"
          x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
          stroke="#FFD93D"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" begin={`${angle / 360}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* Sun body */}
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunBody" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="50%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="#F4A623" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="22" fill="url(#sunBody)" />
      <circle cx="44" cy="42" r="6" fill="#FFF9C4" opacity="0.5" />
    </g>
  );
}

function Moon() {
  return (
    <g>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8EAF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E8EAF6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonBody" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#F5F5F5" />
          <stop offset="50%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#BDBDBD" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill="url(#moonGlow)">
        <animate attributeName="r" values="34;37;34" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="22" fill="url(#moonBody)" />
      <circle cx="54" cy="44" r="14" fill="#0f172a" opacity="0.15" />
      {/* Craters */}
      <circle cx="42" cy="54" r="3" fill="#BDBDBD" opacity="0.4" />
      <circle cx="55" cy="58" r="2" fill="#BDBDBD" opacity="0.3" />
      {/* Stars */}
      {[{x:15,y:20,s:2},{x:82,y:15,s:1.5},{x:78,y:70,s:2},{x:20,y:75,s:1.5},{x:88,y:40,s:1}].map((star, i) => (
        <circle key={i} cx={star.x} cy={star.y} r={star.s} fill="#E8EAF6" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

function CloudShape({ x = 0, y = 0, scale = 1, color = '#E0E8F0', highlight = '#F5F8FC' }: { x?: number; y?: number; scale?: number; color?: string; highlight?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`cloudGrad-${x}-${y}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="62" rx="32" ry="14" fill={`url(#cloudGrad-${x}-${y})`} />
      <circle cx="36" cy="52" r="16" fill={highlight} />
      <circle cx="54" cy="46" r="20" fill={highlight} />
      <circle cx="68" cy="56" r="12" fill={color} />
      {/* Highlight */}
      <ellipse cx="44" cy="44" rx="8" ry="5" fill="white" opacity="0.3" />
    </g>
  );
}

function SunPartial() {
  return (
    <g>
      <g transform="translate(-8, -8) scale(0.7)">
        <Sun />
      </g>
      <g transform="translate(6, 10) scale(0.65)">
        <CloudShape color="#D6E4F0" highlight="#EDF2F7" />
      </g>
    </g>
  );
}

function MoonPartial() {
  return (
    <g>
      <g transform="translate(-8, -8) scale(0.7)">
        <Moon />
      </g>
      <g transform="translate(6, 10) scale(0.65)">
        <CloudShape color="#94A3B8" highlight="#CBD5E1" />
      </g>
    </g>
  );
}

function SunCloudy() {
  return (
    <g>
      <g transform="translate(-5, -12) scale(0.55)">
        <defs>
          <radialGradient id="sunSmall" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="50%" stopColor="#FFD93D" />
            <stop offset="100%" stopColor="#F4A623" />
          </radialGradient>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50" y1="50"
            x2={50 + 36 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 36 * Math.sin((angle * Math.PI) / 180)}
            stroke="#FFD93D"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}
        <circle cx="50" cy="50" r="20" fill="url(#sunSmall)" />
      </g>
      <g transform="translate(4, 14) scale(0.7)">
        <CloudShape color="#D6E4F0" highlight="#EDF2F7" />
      </g>
    </g>
  );
}

function MoonCloudy() {
  return (
    <g>
      <g transform="translate(0, -10) scale(0.5)">
        <Moon />
      </g>
      <g transform="translate(4, 14) scale(0.7)">
        <CloudShape color="#64748B" highlight="#94A3B8" />
      </g>
    </g>
  );
}

function Overcast() {
  return (
    <g>
      <g transform="translate(-4, 2) scale(0.55)">
        <CloudShape x={0} y={0} color="#B0BEC5" highlight="#CFD8DC" />
      </g>
      <g transform="translate(8, 14) scale(0.7)">
        <CloudShape x={0} y={0} color="#90A4AE" highlight="#B0BEC5" />
      </g>
    </g>
  );
}

function Fog() {
  return (
    <g>
      <g transform="translate(4, -2) scale(0.6)">
        <CloudShape color="#B0BEC5" highlight="#CFD8DC" />
      </g>
      {[38,50,62,74].map((y, i) => (
        <line key={y} x1="18" y1={y} x2="82" y2={y} stroke="#90A4AE" strokeWidth="3" strokeLinecap="round" opacity={0.4 - i * 0.06}>
          <animate attributeName="x1" values="18;22;18" dur="3s" begin={`${i*0.3}s`} repeatCount="indefinite" />
          <animate attributeName="x2" values="82;78;82" dur="3s" begin={`${i*0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
    </g>
  );
}

function RainDrop({ x, delay, heavy }: { x: number; delay: number; heavy?: boolean }) {
  const len = heavy ? 10 : 7;
  return (
    <line
      x1={x} y1={68} x2={x - 2} y2={68 + len}
      stroke="#60A5FA" strokeWidth={heavy ? 2.5 : 2} strokeLinecap="round" opacity="0.7"
    >
      <animate attributeName="y1" values="68;90" dur={heavy ? "0.6s" : "0.8s"} begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="y2" values={`${68 + len};${90 + len}`} dur={heavy ? "0.6s" : "0.8s"} begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;0" dur={heavy ? "0.6s" : "0.8s"} begin={`${delay}s`} repeatCount="indefinite" />
    </line>
  );
}

function Drizzle() {
  return (
    <g>
      <g transform="translate(4, 0) scale(0.7)">
        <CloudShape color="#78909C" highlight="#90A4AE" />
      </g>
      <RainDrop x={35} delay={0} />
      <RainDrop x={50} delay={0.3} />
      <RainDrop x={65} delay={0.6} />
    </g>
  );
}

function Rain() {
  return (
    <g>
      <g transform="translate(4, -2) scale(0.7)">
        <CloudShape color="#607D8B" highlight="#78909C" />
      </g>
      <RainDrop x={30} delay={0} />
      <RainDrop x={40} delay={0.2} />
      <RainDrop x={50} delay={0.4} />
      <RainDrop x={60} delay={0.15} />
      <RainDrop x={70} delay={0.35} />
    </g>
  );
}

function HeavyRain() {
  return (
    <g>
      <g transform="translate(4, -4) scale(0.7)">
        <CloudShape color="#455A64" highlight="#607D8B" />
      </g>
      <RainDrop x={25} delay={0} heavy />
      <RainDrop x={35} delay={0.1} heavy />
      <RainDrop x={45} delay={0.2} heavy />
      <RainDrop x={55} delay={0.05} heavy />
      <RainDrop x={65} delay={0.25} heavy />
      <RainDrop x={75} delay={0.15} heavy />
    </g>
  );
}

function RainShower({ isDay }: { isDay: boolean }) {
  return (
    <g>
      {isDay ? (
        <g transform="translate(-6, -10) scale(0.45)">
          <defs>
            <radialGradient id="sunShower" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="100%" stopColor="#F4A623" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="18" fill="url(#sunShower)" />
        </g>
      ) : (
        <g transform="translate(-4, -8) scale(0.4)">
          <Moon />
        </g>
      )}
      <g transform="translate(6, 6) scale(0.65)">
        <CloudShape color="#78909C" highlight="#90A4AE" />
      </g>
      <RainDrop x={38} delay={0} />
      <RainDrop x={50} delay={0.25} />
      <RainDrop x={62} delay={0.5} />
    </g>
  );
}

function SnowFlake({ x, delay }: { x: number; delay: number }) {
  return (
    <circle cx={x} cy={72} r="3" fill="#E3F2FD" opacity="0.8">
      <animate attributeName="cy" values="72;92" dur="1.5s" begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0" dur="1.5s" begin={`${delay}s`} repeatCount="indefinite" />
      <animate attributeName="cx" values={`${x};${x+4};${x-2};${x+2}`} dur="1.5s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

function Snow() {
  return (
    <g>
      <g transform="translate(4, -2) scale(0.7)">
        <CloudShape color="#90A4AE" highlight="#B0BEC5" />
      </g>
      <SnowFlake x={32} delay={0} />
      <SnowFlake x={44} delay={0.3} />
      <SnowFlake x={56} delay={0.6} />
      <SnowFlake x={68} delay={0.2} />
    </g>
  );
}

function HeavySnow() {
  return (
    <g>
      <g transform="translate(4, -4) scale(0.7)">
        <CloudShape color="#78909C" highlight="#90A4AE" />
      </g>
      <SnowFlake x={28} delay={0} />
      <SnowFlake x={38} delay={0.15} />
      <SnowFlake x={48} delay={0.3} />
      <SnowFlake x={58} delay={0.1} />
      <SnowFlake x={68} delay={0.4} />
      <SnowFlake x={76} delay={0.25} />
    </g>
  );
}

function Thunderstorm() {
  return (
    <g>
      <g transform="translate(4, -6) scale(0.7)">
        <CloudShape color="#37474F" highlight="#546E7A" />
      </g>
      {/* Lightning bolt */}
      <polygon
        points="48,58 42,72 50,72 44,88 58,68 50,68 56,58"
        fill="#FFD93D"
        opacity="0.9"
      >
        <animate attributeName="opacity" values="0.9;0.3;0.9;0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
      </polygon>
      <RainDrop x={30} delay={0} heavy />
      <RainDrop x={70} delay={0.2} heavy />
    </g>
  );
}
