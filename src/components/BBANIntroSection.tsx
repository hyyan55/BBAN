import React from 'react';

export const BBANIntroSection: React.FC = () => {
  return (
    <section
      aria-labelledby="bban-intro-heading"
      className="mt-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6"
    >
      <h2
        id="bban-intro-heading"
        className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white"
      >
        ما هو BBAN في السودان؟
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-7">
        BBAN هو تنسيق رقم الحساب البنكي الأساسي، وقد تطلب بعض التطبيقات والخدمات
        المصرفية إدخال الحساب بهذه الصيغة بدلاً من رقم الحساب المعتاد. اختر البنك
        الصحيح وأدخل رقم حسابك للحصول على الصيغة المتاحة له.
      </p>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-7">
        BBAN ليس هو IBAN؛ فإذا كانت الخدمة تطلب رقم IBAN تحديداً، فلا تستخدم BBAN
        بديلاً عنه. تأكد دائماً من الصيغة المطلوبة لدى البنك أو التطبيق المستقبِل.
      </p>

      <a
        href="https://bban-sd.pages.dev/what-is-bban/"
        className="mt-3 inline-flex text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4"
      >
        اقرأ دليل BBAN في السودان والفرق بين BBAN وIBAN ←
      </a>
    </section>
  );
};
