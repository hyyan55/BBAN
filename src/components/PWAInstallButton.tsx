import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="min-h-[44px] flex items-center gap-2 rounded-xl bg-blue-900 dark:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-600 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label="تثبيت التطبيق للعمل بدون إنترنت"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        className="min-h-[44px] flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label="طريقة تثبيت التطبيق على الهاتف"
      >
        <Download className="w-3.5 h-3.5 shrink-0 text-blue-800 dark:text-blue-400" aria-hidden="true" />
        <span>{isIOS ? 'تثبيت على iPhone' : 'تثبيت التطبيق'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3
                id="pwa-install-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                تثبيت تطبيق BBAN السودان
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-h-[44px] min-w-[44px] -m-2 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                يعمل هذا التطبيق بالكامل بدون إنترنت بعد تثبيته على شاشة هاتفك الرئيسية:
              </p>
              {isIOS ? (
                <ol className="list-decimal list-inside space-y-2 text-slate-800 dark:text-slate-200 font-medium">
                  <li>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari.</li>
                  <li>اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</li>
                  <li>اضغط <strong>إضافة (Add)</strong> في أعلى الشاشة.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-2 text-slate-800 dark:text-slate-200 font-medium">
                  <li>افتح قائمة المتصفح (النقاط الثلاث <strong>⋮</strong> في أعلى المتصفح).</li>
                  <li>اختر <strong>تثبيت التطبيق (Install app)</strong> أو <strong>الإضافة إلى الشاشة الرئيسية</strong>.</li>
                  <li>سيظهر التطبيق على هاتفك ويعمل في أي وقت حتى في وضع الطيران.</li>
                </ol>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full min-h-[44px] rounded-xl bg-blue-950 dark:bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 dark:hover:bg-blue-600 transition-colors cursor-pointer"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
