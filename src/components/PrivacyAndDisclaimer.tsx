import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const PrivacyAndDisclaimer: React.FC = () => {
  return (
    <section
      id="privacy"
      aria-label="الخصوصية وإخلاء المسؤولية"
      className="mt-6 space-y-3"
    >
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-4 py-3.5 flex items-start gap-3">
        <ShieldCheck
          className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="font-bold text-slate-900 dark:text-white">
            الخصوصية:{' '}
          </strong>
          تتم عملية التحويل داخل الهاتف ولا يتم إرسال رقم الحساب إلى أي خادم.
        </p>
      </div>

      <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/60 px-4 py-3.5 flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-200/90 leading-relaxed space-y-1">
          <p>
            <strong className="font-bold">تنبيه: </strong>
            قد تختلف صيغة BBAN حسب البنك ونوع الحساب. يرجى التأكد من صحة الرقم مع البنك قبل إجراء أي تحويل مالي.
          </p>
          <p className="text-xs text-amber-800/85 dark:text-amber-300/75">
            هذا التطبيق أداة مساعدة مستقلة وغير تابع رسمياً لأي بنك سوداني.
          </p>
        </div>
      </div>
    </section>
  );
};
