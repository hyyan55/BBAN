import React from 'react';
import { Landmark } from 'lucide-react';
import { banks } from '../data/banks';

export const BanksReferenceSection: React.FC = () => {
  return (
    <section
      id="banks-guide"
      aria-label="دليل صيغ البنوك السودانية والتطبيقات المرتبطة بها"
      className="mt-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
    >
      <div className="px-5 py-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          صيغ BBAN للبنوك السودانية ({banks.length} بنوك)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          اسم البنك والتطبيق أو الخدمة المرتبطة به، مع صيغة رقم BBAN
        </p>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        {banks.map((bank, idx) => (
          <div
            key={bank.id}
            className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
          >
            <div className="flex items-center gap-2.5">
              <Landmark
                className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {idx + 1}. {bank.name}
                </span>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  — {bank.appName}
                </span>
              </div>
            </div>
            <div
              dir="ltr"
              className="text-xs sm:text-sm font-mono-bban font-semibold text-slate-600 dark:text-slate-300 text-right sm:text-left"
            >
              {bank.formatPattern}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
