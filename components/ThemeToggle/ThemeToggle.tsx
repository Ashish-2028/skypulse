'use client';

import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      className={styles.toggle}
      onClick={onToggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      <div className={`${styles.slider} ${theme === 'dark' ? styles.dark : ''}`}>
        <span className={styles.icon}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </div>
    </button>
  );
}
