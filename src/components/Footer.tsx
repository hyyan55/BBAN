import React from 'react';
import { Browser } from '@capacitor/browser';

export const Footer: React.FC = () => {
  const openPrivacyPolicy = async () => {
    try {
      await Browser.open({
        url: 'https://bban-sd.pages.dev/privacy-policy/',
      });
    } catch (error) {
      window.open(
        'https://bban-sd.pages.dev/privacy-policy/',
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

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

        <button
          type="button"
          onClick={openPrivacyPolicy}
          className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Privacy Policy | سياسة الخصوصية
        </button>
      </div>
    </footer>
  );
};
