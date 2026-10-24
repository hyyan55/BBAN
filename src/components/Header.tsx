import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-3xl mx-auto h-full px-4 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#converter"
          className="text-base sm:text-lg font-extrabold tracking-tight text-blue-950 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md"
        >
          BBAN السودان
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <a
            href="#converter"
            className="hover:text-blue-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            المحول
          </a>
          <a
            href="#banks-guide"
            className="hover:text-blue-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            البنوك المعتمدة
          </a>
          <a
            href="#privacy"
            className="hover:text-blue-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            الخصوصية
          </a>
          <a
            href="#about"
            className="hover:text-blue-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            حول التطبيق
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 text-blue-950" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
