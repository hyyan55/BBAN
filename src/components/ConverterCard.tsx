import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeftRight, X } from 'lucide-react';
import { BankConfig, getBankById } from '../data/banks';
import {
  ConversionResult,
  convertToBBAN,
  normalizeAccountNumber,
  VALIDATION_MESSAGES,
} from '../utils/bban';
import { BankSelector } from './BankSelector';
import { ResultCard } from './ResultCard';
import { trackBBANConversion } from '../services/analytics';

const LAST_BANK_STORAGE_KEY = 'sudan_bban_last_bank_id';

export const ConverterCard: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<BankConfig | null>(() => {
    try {
      const savedBankId = window.localStorage.getItem(LAST_BANK_STORAGE_KEY);
      return getBankById(savedBankId);
    } catch {
      return null;
    }
  });

  const [accountInput, setAccountInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (selectedBank) {
        window.localStorage.setItem(LAST_BANK_STORAGE_KEY, selectedBank.id);
      }
    } catch {
      // Ignore storage errors
    }
  }, [selectedBank]);

  const handleSelectBank = (bank: BankConfig | null) => {
    setSelectedBank(bank);
    setError(null);
    setHint(undefined);
    setResult(null);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const withoutSpaces = normalizeAccountNumber(rawValue);
    setAccountInput(withoutSpaces);

    if (result) {
      setResult(null);
    }

    if (withoutSpaces.length > 0 && !/^[0-9]+$/.test(withoutSpaces)) {
      setError(VALIDATION_MESSAGES.DIGITS_ONLY);
      setHint('يرجى إدخال الأرقام الإنجليزية (0-9) فقط بدون حروف أو رموز.');
    } else {
      setError(null);
      setHint(undefined);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && /\s/.test(pastedText)) {
      e.preventDefault();
      const cleaned = normalizeAccountNumber(pastedText);
      setAccountInput(cleaned);
      setResult(null);

      if (cleaned.length > 0 && !/^[0-9]+$/.test(cleaned)) {
        setError(VALIDATION_MESSAGES.DIGITS_ONLY);
        setHint('النص الملصق يحتوي على حروف أو رموز غير مسموحة.');
      } else {
        setError(null);
        setHint(undefined);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedAccount = normalizeAccountNumber(accountInput);
    if (cleanedAccount !== accountInput) {
      setAccountInput(cleanedAccount);
    }

    const conversion = convertToBBAN(selectedBank, cleanedAccount);

    if (!conversion.success) {
      setError(conversion.error);
      setHint(conversion.hint);
      setResult(null);
      return;
    }

    setError(null);
    setHint(undefined);
    setResult(conversion);

    if (selectedBank) {
      trackBBANConversion({
        bankId: selectedBank.id,
        bankName: selectedBank.name,
        accountLength: cleanedAccount.length,
        hasSuffix: Boolean(selectedBank.suffix),
      });
    }
  };

  const handleClear = () => {
    setAccountInput('');
    setResult(null);
    setError(null);
    setHint(undefined);
    inputRef.current?.focus();
  };

  const isBankError = error === VALIDATION_MESSAGES.BANK_REQUIRED;
  const isAccountError = Boolean(error && error !== VALIDATION_MESSAGES.BANK_REQUIRED);

  return (
    <section
      id="converter"
      aria-label="محول رقم الحساب إلى BBAN"
      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm"
    >
      <form onSubmit={handleSubmit} noValidate>
        <BankSelector
          selectedBank={selectedBank}
          onSelectBank={handleSelectBank}
          hasError={isBankError}
        />

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="account-number-input"
              className="block text-sm font-bold text-slate-800 dark:text-slate-100"
            >
              رقم الحساب
            </label>
            {selectedBank && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                أرقام فقط · إزالة تلقائية للمسافات
              </span>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              ref={inputRef}
              id="account-number-input"
              type="text"
              inputMode="numeric"
              dir="ltr"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={accountInput}
              onChange={handleAccountChange}
              onPaste={handlePaste}
              placeholder="أدخل رقم الحساب"
              aria-invalid={isAccountError}
              aria-describedby={error ? 'converter-validation-error' : undefined}
              className={`w-full min-h-[58px] pl-12 pr-4 py-3.5 rounded-xl border text-lg sm:text-xl font-mono-bban font-bold tracking-wide text-slate-900 dark:text-white placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-right placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isAccountError
                  ? 'border-red-500 dark:border-red-400 bg-red-50/40 dark:bg-red-950/20'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-800 dark:focus:border-blue-500'
              }`}
            />

            {accountInput.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute left-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="مسح رقم الحساب"
                title="مسح"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div
            id="converter-validation-error"
            role="alert"
            aria-live="assertive"
            className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 px-4 py-3 flex items-start gap-2.5 text-red-800 dark:text-red-300"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold">{error}</p>
              {hint && (
                <p className="mt-0.5 text-xs text-red-700/90 dark:text-red-300/90">
                  {hint}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            className="w-full min-h-[54px] px-6 py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ArrowLeftRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>تحويل إلى BBAN</span>
          </button>
        </div>
      </form>

      {result && result.success && (
        <ResultCard result={result} onClear={handleClear} />
      )}
    </section>
  );
};
