import React, { useState } from 'react';
import { Check, Copy, RotateCcw, AlertCircle } from 'lucide-react';
import { ConversionResult, VALIDATION_MESSAGES } from '../utils/bban';

interface ResultCardProps {
  result: ConversionResult;
  onClear: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onClear }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  if (!result.success || !result.bban) {
    return null;
  }

  const copyFallback = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    setCopyError(null);
    const exactBBAN = result.bban;

    let success = false;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(exactBBAN);
        success = true;
      } catch {
        success = copyFallback(exactBBAN);
      }
    } else {
      success = copyFallback(exactBBAN);
    }

    if (success) {
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2800);
    } else {
      setCopyError(VALIDATION_MESSAGES.COPY_FAILED);
    }
  };

  return (
    <div
      role="region"
      aria-label="نتيجة التحويل إلى BBAN"
      className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 transition-opacity duration-150"
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          رقم BBAN
        </h2>
        {result.bank && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {result.bank.name} · {result.bban.length} رقماً
          </span>
        )}
      </div>

      <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 px-4 py-5 text-center">
        <div
          dir="ltr"
          data-testid="bban-result-value"
          className="font-mono-bban text-2xl sm:text-3xl font-bold tracking-wider text-white select-all break-all"
        >
          {result.bban}
        </div>

        {result.breakdown && (
          <div
            dir="ltr"
            className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5 text-xs font-mono-bban text-slate-400"
          >
            <span title="بادئة البنك" className="text-amber-400 font-semibold">
              {result.breakdown.prefix}
            </span>
            <span aria-hidden="true">+</span>
            <span title="رقم الحساب" className="text-sky-300 font-semibold">
              {result.breakdown.account}
            </span>
            {result.breakdown.suffix ? (
              <>
                <span aria-hidden="true">+</span>
                <span title="لاحقة البنك" className="text-emerald-400 font-semibold">
                  {result.breakdown.suffix}
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>

      <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 text-center">
        اضغط نسخ لاستخدام الرقم
      </p>

      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300"
        >
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{VALIDATION_MESSAGES.COPY_SUCCESS}</span>
        </div>
      )}

      {copyError && (
        <div
          role="alert"
          className="mt-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-red-700 dark:text-red-300"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{copyError}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={`col-span-2 min-h-[50px] px-5 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            copied
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-blue-950 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>تم النسخ ✓</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>نسخ</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClear}
          className="col-span-1 min-h-[50px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>مسح</span>
        </button>
      </div>
    </div>
  );
};
