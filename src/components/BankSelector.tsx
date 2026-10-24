import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Landmark } from 'lucide-react';
import { BankConfig, banks } from '../data/banks';

interface BankSelectorProps {
  selectedBank: BankConfig | null;
  onSelectBank: (bank: BankConfig | null) => void;
  hasError?: boolean;
}

export const BankSelector: React.FC<BankSelectorProps> = ({
  selectedBank,
  onSelectBank,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (bank: BankConfig) => {
    onSelectBank(bank);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor="bank-selector-trigger"
        className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2"
      >
        اختر البنك
      </label>

      <button
        id="bank-selector-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="اختر البنك"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[56px] px-4 py-3 rounded-xl border text-right flex items-center justify-between gap-3 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          hasError
            ? 'border-red-500 dark:border-red-400 bg-red-50/40 dark:bg-red-950/20'
            : isOpen
            ? 'border-blue-800 dark:border-blue-500 bg-white dark:bg-slate-800 ring-2 ring-blue-900/10 dark:ring-blue-400/20'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              selectedBank
                ? 'bg-blue-950 text-white dark:bg-blue-700'
                : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }`}
            aria-hidden="true"
          >
            <Landmark className="w-5 h-5" />
          </div>

          {selectedBank ? (
            <div className="min-w-0">
              <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                {selectedBank.name}
              </div>
              <div
                dir="ltr"
                className="text-xs font-mono-bban text-slate-500 dark:text-slate-400 truncate text-right"
              >
                {selectedBank.formatPattern}
              </div>
            </div>
          ) : (
            <span className="text-base text-slate-500 dark:text-slate-400 font-medium truncate">
              اختر البنك من القائمة...
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-blue-900 dark:text-blue-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="قائمة البنوك السودانية المدعومة"
          className="absolute z-30 left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl divide-y divide-slate-100 dark:divide-slate-800"
        >
          {banks.map((bank, index) => {
            const isSelected = selectedBank?.id === bank.id;
            return (
              <button
                key={bank.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(bank)}
                className={`w-full min-h-[60px] px-4 py-3 text-right flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/50'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-950 text-white dark:bg-blue-600'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                    aria-hidden="true"
                  >
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      <span className="text-slate-400 dark:text-slate-500 font-normal ml-1.5 text-xs">
                        {index + 1}.
                      </span>
                      {bank.name}
                    </div>
                    <div
                      dir="ltr"
                      className="text-xs font-mono-bban text-slate-500 dark:text-slate-400 text-right mt-0.5"
                    >
                      {bank.formatPattern}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check
                    className="w-5 h-5 text-blue-900 dark:text-blue-400 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
