import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 pb-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
      <div className="max-w-3xl mx-auto px-4 space-y-2">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          المبرمج حيان محمد
        </p>

        <p
          dir="ltr"
          className="text-xs text-slate-500 dark:text-slate-500 font-medium"
        >
          © 2026 Hayyan Mohamed
        </p>

        <a
          href="/privacy-policy/"
          className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Privacy Policy | سياسة الخصوصية
        </a>
      </div>
    </footer>
  );
};
