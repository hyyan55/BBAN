import { BankConfig } from '../data/banks';

export const VALIDATION_MESSAGES = {
  BANK_REQUIRED: 'يرجى اختيار البنك.',
  ACCOUNT_REQUIRED: 'يرجى إدخال رقم الحساب.',
  DIGITS_ONLY: 'رقم الحساب يجب أن يحتوي على أرقام فقط.',
  INVALID_ACCOUNT_FOR_BANK: 'رقم الحساب غير صحيح لهذا البنك.',
  COPY_FAILED: 'تعذر نسخ الرقم، حاول مرة أخرى.',
  COPY_SUCCESS: 'تم نسخ BBAN إلى الحافظة ✓',
} as const;

export interface ValidationResult {
  isValid: boolean;
  normalizedAccount: string;
  error: string | null;
  hint?: string;
}

export interface BBANBreakdown {
  prefix: string;
  account: string;
  suffix: string;
}

export interface ConversionResult {
  success: boolean;
  bban: string;
  normalizedAccount: string;
  error: string | null;
  hint?: string;
  breakdown?: BBANBreakdown;
  bank?: BankConfig;
}

/**
 * يزيل المسافات فقط من رقم الحساب المدخل أو الملصق دون تعديل أي حروف أو رموز أخرى
 * لضمان عدم تعديل أرقام الحسابات غير الصحيحة بشكل صامت.
 */
export function normalizeAccountNumber(rawInput: string): string {
  if (typeof rawInput !== 'string') {
    return '';
  }
  return rawInput.replace(/\s+/g, '');
}

/**
 * يتحقق من صحة البنك المختار ورقم الحساب وفق القواعد المحددة للبنك.
 */
export function validateAccountInput(
  bank: BankConfig | null | undefined,
  rawAccountNumber: string
): ValidationResult {
  if (!bank) {
    return {
      isValid: false,
      normalizedAccount: '',
      error: VALIDATION_MESSAGES.BANK_REQUIRED,
    };
  }

  const normalized = normalizeAccountNumber(rawAccountNumber);

  if (!normalized || normalized.length === 0) {
    return {
      isValid: false,
      normalizedAccount: '',
      error: VALIDATION_MESSAGES.ACCOUNT_REQUIRED,
    };
  }

  // التحقق من أن النص يحتوي على أرقام إنجليزية (0-9) فقط بعد إزالة المسافات
  if (!/^[0-9]+$/.test(normalized)) {
    return {
      isValid: false,
      normalizedAccount: normalized,
      error: VALIDATION_MESSAGES.DIGITS_ONLY,
    };
  }

  // إذا كان للبنك طول ثابت محدد في الإعدادات يتم التحقق منه بدقة
  if (bank.accountLength !== null && normalized.length !== bank.accountLength) {
    return {
      isValid: false,
      normalizedAccount: normalized,
      error: VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
      hint: `الطول المتوقع لرقم الحساب في ${bank.name} هو ${bank.accountLength} أرقام.`,
    };
  }

  // التحقق من الحدود الدنيا والقصوى المنطقية لرقم الحساب المصرفي
  if (
    normalized.length < bank.minAccountLength ||
    normalized.length > bank.maxAccountLength
  ) {
    return {
      isValid: false,
      normalizedAccount: normalized,
      error: VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
      hint: `يجب أن يتراوح طول رقم الحساب بين ${bank.minAccountLength} و ${bank.maxAccountLength} رقماً.`,
    };
  }

  // رفض الأرقام المكونة من أصفار فقط (مثل 0000000)
  if (/^0+$/.test(normalized)) {
    return {
      isValid: false,
      normalizedAccount: normalized,
      error: VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
      hint: 'لا يمكن أن يتكون رقم الحساب من أصفار فقط.',
    };
  }

  return {
    isValid: true,
    normalizedAccount: normalized,
    error: null,
  };
}

/**
 * الدالة الرئيسية لتحويل رقم الحساب إلى صيغة BBAN
 * 1. تطبيع رقم الحساب (إزالة المسافات)
 * 2. التحقق من صحة المدخلات
 * 3. إضافة بادئة البنك (prefix)
 * 4. إضافة رقم الحساب (account)
 * 5. إضافة لاحقة البنك (suffix)
 * 6. إرجاع رقم BBAN النهائي المتصل بدون مسافات
 */
export function convertToBBAN(
  bank: BankConfig | null | undefined,
  accountNumber: string
): ConversionResult {
  const validation = validateAccountInput(bank, accountNumber);

  if (!validation.isValid || !bank) {
    return {
      success: false,
      bban: '',
      normalizedAccount: validation.normalizedAccount,
      error: validation.error,
      hint: validation.hint,
    };
  }

  const prefix = bank.prefix ?? '';
  const account = validation.normalizedAccount;
  const suffix = bank.suffix ?? '';
  const finalBBAN = `${prefix}${account}${suffix}`;

  return {
    success: true,
    bban: finalBBAN,
    normalizedAccount: account,
    error: null,
    bank,
    breakdown: {
      prefix,
      account,
      suffix,
    },
  };
}
