import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { NavigationProvider } from '@/context/NavigationContext';

export const metadata: Metadata = {
  title: 'GameOps AI — Data Pipelines',
  description: 'Enterprise Game Data Engineering & Pipeline Orchestration Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-600 selection:text-white">
        <AppProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
