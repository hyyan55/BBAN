import React from 'react';
import { AboutDeveloperSection } from './components/AboutDeveloperSection';
import { BanksReferenceSection } from './components/BanksReferenceSection';
import { ConverterCard } from './components/ConverterCard';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PrivacyAndDisclaimer } from './components/PrivacyAndDisclaimer';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150"
    >
      <Header isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-6 sm:pt-8">
        <div className="mb-6 flex items-center gap-4">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-950 dark:bg-blue-900 border border-blue-900/30 dark:border-blue-700/40 flex flex-col items-center justify-center shrink-0 shadow-xs select-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="flex items-center gap-1 mb-1">
              <span className="w-2.5 h-0.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-0.5 rounded-full bg-white" />
              <span className="w-2.5 h-0.5 rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono-bban text-xs sm:text-sm font-extrabold tracking-wider text-white leading-none">
              BBAN
            </span>
            <span className="w-7 h-0.5 rounded-full bg-amber-400 my-1" />
            <span className="text-[10px] font-bold text-slate-200 leading-none">
              السودان
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              BBAN السودان
            </h1>
            <p className="mt-1 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
              محول أرقام الحسابات البنكية السودانية
            </p>
          </div>
        </div>

        <ConverterCard />
        <PrivacyAndDisclaimer />
        <BanksReferenceSection />
        <AboutDeveloperSection />
      </main>

      <Footer />
      <OfflineIndicator />
    </div>
  );
}

export default App;
