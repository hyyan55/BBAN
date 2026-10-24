import React from 'react';

export const AboutDeveloperSection: React.FC = () => {
  return (
    <section
      id="about"
      aria-label="حول التطبيق والمبرمج"
      className="mt-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400">
            حول التطبيق
          </h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            تطوير وبرمجة
          </p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            المبرمج حيان محمد
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            حيان محمد · Developed by Hayyan Mohamed
          </p>
        </div>

        <div className="shrink-0">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 sm:text-left">
            تواصل مع المبرمج
          </p>
          <a
            href="https://wa.me/249927309195"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل مع المبرمج حيان محمد عبر واتساب"
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xs active:scale-[0.98] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <svg
              className="w-5 h-5 shrink-0 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.031 2c-5.516 0-9.999 4.486-9.999 10.001 0 1.766.461 3.489 1.337 5.012L2 22l5.125-1.344c1.474.805 3.133 1.23 4.835 1.23h.004c5.515 0 9.999-4.486 9.999-10.001 0-2.672-1.04-5.184-2.929-7.073C17.145 2.923 14.633 2 12.031 2zm5.822 14.299c-.246.693-1.431 1.326-1.988 1.41-.508.076-1.151.108-1.858-.116-.429-.136-.979-.318-1.685-.623-2.966-1.281-4.903-4.267-5.051-4.465-.148-.198-1.207-1.606-1.207-3.063 0-1.457.763-2.173 1.034-2.47.271-.296.591-.371.788-.371.197 0 .394.002.566.01.182.009.426-.069.666.509.246.593.837 2.049.911 2.197.074.148.123.321.025.519-.098.198-.148.321-.296.494-.148.173-.311.386-.444.519-.148.148-.302.309-.13.605.172.296.766 1.264 1.645 2.048 1.131 1.008 2.083 1.321 2.379 1.469.296.148.468.123.641-.074.173-.198.739-.864.936-1.161.197-.296.394-.247.665-.148.271.099 1.724.815 2.02.963.296.148.493.222.567.346.074.123.074.716-.172 1.409z" />
            </svg>
            <span>تواصل عبر واتساب</span>
          </a>
        </div>
      </div>
    </section>
  );
};
