import React, { useState } from 'react';
import { ChevronDown, Landmark } from 'lucide-react';
import { banks } from '../data/banks';

export const BanksReferenceSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id="banks-guide"
      aria-label="دليل صيغ البنوك السودانية المعتمدة"
      className="mt-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="w-full min-h-[56px] px-5 py-4 flex items-center justify-between gap-3 text-right hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            صيغ BBAN للبنوك السودانية ({banks.length} بنوك)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            عرض القواعد المحلية المستخدمة في احتساب رقم BBAN لكل بنك
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-150 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
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
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {idx + 1}. {bank.name}
                </span>
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
      )}
    </section>
  );
};
