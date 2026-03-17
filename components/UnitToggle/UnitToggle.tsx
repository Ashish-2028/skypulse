'use client';

import { TemperatureUnit } from '@/types/weather';
import styles from './UnitToggle.module.css';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button
      id="unit-toggle"
      className={styles.toggle}
      onClick={onToggle}
      title="Toggle temperature unit"
      aria-label="Toggle temperature unit"
    >
      <span className={`${styles.option} ${unit === 'celsius' ? styles.active : ''}`}>°C</span>
      <span className={styles.divider}>/</span>
      <span className={`${styles.option} ${unit === 'fahrenheit' ? styles.active : ''}`}>°F</span>
    </button>
  );
}
