import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkyPulse — Live Weather Dashboard',
  description: 'A premium weather application with real-time forecasts, air quality data, interactive charts, and beautiful weather animations. Powered by Open-Meteo.',
  keywords: 'weather, forecast, weather app, air quality, temperature, rain, wind',
  openGraph: {
    title: 'SkyPulse — Live Weather Dashboard',
    description: 'Real-time weather with hourly forecasts, 7-day outlook, air quality, and stunning weather animations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛅</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
