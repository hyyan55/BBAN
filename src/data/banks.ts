export interface BankConfig {
  id: string;
  name: string;
  englishName: string;
  prefix: string;
  suffix: string;
  /**
   * إذا كان للبنك طول رقم حساب ثابت ومؤكد رسمياً يمكن تحديده هنا (مثلاً: 7).
   * القيمة null تعني عدم فرض طول واحد ثابت والاكتفاء بالتحقق من النطاق المسموح (minAccountLength - maxAccountLength)
   * حتى لا يتم افتراض قاعدة غير موجودة في المرجع.
   */
  accountLength: number | null;
  minAccountLength: number;
  maxAccountLength: number;
  formatPattern: string;
}

export const DEFAULT_MIN_ACCOUNT_LENGTH = 5;
export const DEFAULT_MAX_ACCOUNT_LENGTH = 16;

export const banks: BankConfig[] = [
  {
    id: 'bok',
    name: 'بنك الخرطوم',
    englishName: 'Bank of Khartoum',
    prefix: '040',
    suffix: '0001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '040 + ACCOUNT + 0001',
  },
  {
    id: 'onb',
    name: 'بنك أم درمان الوطني',
    englishName: 'Omdurman National Bank',
    prefix: '240',
    suffix: '00001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '240 + ACCOUNT + 00001',
  },
  {
    id: 'fib',
    name: 'بنك فيصل الإسلامي',
    englishName: 'Faisal Islamic Bank',
    prefix: '02',
    suffix: '0001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '02 + ACCOUNT + 0001',
  },
  {
    id: 'bnmb',
    name: 'بنك النيل الأزرق',
    englishName: 'Blue Nile Mashreg Bank',
    prefix: '150000',
    suffix: '',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '150000 + ACCOUNT',
  },
  {
    id: 'sib',
    name: 'البنك الإسلامي السوداني',
    englishName: 'Sudanese Islamic Bank',
    prefix: '14000',
    suffix: '00001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '14000 + ACCOUNT + 00001',
  },
  {
    id: 'fcb',
    name: 'بنك المزارع التجاري',
    englishName: 'Farmer Commercial Bank',
    prefix: '222',
    suffix: '',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '222 + ACCOUNT',
  },
  {
    id: 'sfb',
    name: 'البنك الفرنسي السوداني',
    englishName: 'Sudanese French Bank',
    prefix: '110',
    suffix: '00001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '110 + ACCOUNT + 00001',
  },
  {
    id: 'abs',
    name: 'البنك الزراعي السوداني',
    englishName: 'Agricultural Bank of Sudan',
    prefix: '03',
    suffix: '01001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '03 + ACCOUNT + 01001',
  },
  {
    id: 'alsalam',
    name: 'بنك السلام السوداني',
    englishName: 'Al Salam Bank Sudan',
    prefix: '180',
    suffix: '00001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '180 + ACCOUNT + 00001',
  },
  {
    id: 'albaraka',
    name: 'بنك البركة السوداني',
    englishName: 'Al Baraka Bank Sudan',
    prefix: '070',
    suffix: '00001',
    accountLength: null,
    minAccountLength: DEFAULT_MIN_ACCOUNT_LENGTH,
    maxAccountLength: DEFAULT_MAX_ACCOUNT_LENGTH,
    formatPattern: '070 + ACCOUNT + 00001',
  },
];

export function getBankById(bankId: string | null | undefined): BankConfig | null {
  if (!bankId) return null;
  return banks.find((b) => b.id === bankId) ?? null;
}
