import { banks, BankConfig } from '../data/banks';
import { convertToBBAN, VALIDATION_MESSAGES } from './bban';

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(`[Test Failed] ${message}: expected "${expected}", got "${actual}"`);
  }
}

export function runInternalBBANTests(): { passed: number; total: number } {
  let passed = 0;
  let total = 0;

  const check = (fn: () => void) => {
    total += 1;
    fn();
    passed += 1;
  };

  const bok = banks[0];
  const bnmb = banks[3];

  check(() => {
    const res = convertToBBAN(null, '1234567');
    assertEqual(res.success, false, 'Empty bank should fail');
    assertEqual(res.error, VALIDATION_MESSAGES.BANK_REQUIRED, 'Empty bank error message');
  });

  check(() => {
    const res = convertToBBAN(bok, '');
    assertEqual(res.success, false, 'Empty account should fail');
    assertEqual(res.error, VALIDATION_MESSAGES.ACCOUNT_REQUIRED, 'Empty account error message');
  });

  check(() => {
    const res = convertToBBAN(bok, '1234abc567');
    assertEqual(res.success, false, 'Letters should fail');
    assertEqual(res.error, VALIDATION_MESSAGES.DIGITS_ONLY, 'Letters error message');
  });

  check(() => {
    const res = convertToBBAN(bok, '     ');
    assertEqual(res.success, false, 'Only spaces should fail');
    assertEqual(res.error, VALIDATION_MESSAGES.ACCOUNT_REQUIRED, 'Only spaces error message');
  });

  check(() => {
    const res = convertToBBAN(bok, ' 1234 567 ');
    assertEqual(res.success, true, 'Pasted numbers with spaces should succeed');
    assertEqual(res.bban, '04012345670001', 'BOK BBAN with spaces removed');
  });

  check(() => {
    const customBank: BankConfig = {
      ...bok,
      accountLength: 7,
    };
    const res = convertToBBAN(customBank, '123456');
    assertEqual(res.success, false, 'Exact length mismatch should fail');
    assertEqual(
      res.error,
      VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
      'Exact length mismatch error message'
    );
  });

  check(() => {
    const expectedFormats = [
      { name: 'بنك الخرطوم', bban: '04012345670001' },
      { name: 'بنك أم درمان الوطني', bban: '240123456700001' },
      { name: 'بنك فيصل الإسلامي', bban: '0212345670001' },
      { name: 'بنك النيل الأزرق', bban: '1500001234567' },
      { name: 'البنك الإسلامي السوداني', bban: '14000123456700001' },
      { name: 'بنك المزارع التجاري', bban: '2221234567' },
      { name: 'البنك الفرنسي السوداني', bban: '110123456700001' },
      { name: 'البنك الزراعي السوداني', bban: '03123456701001' },
      { name: 'بنك السلام السوداني', bban: '180123456700001' },
      { name: 'بنك البركة السوداني', bban: '070123456700001' },
    ];

    assertEqual(banks.length, 10, 'Must have exactly 10 banks');
    expectedFormats.forEach((item, index) => {
      const bank = banks[index];
      assertEqual(bank.name, item.name, `Bank order at index ${index}`);
      const conv = convertToBBAN(bank, '1234567');
      assertEqual(conv.success, true, `Conversion for ${bank.name}`);
      assertEqual(conv.bban, item.bban, `BBAN output for ${bank.name}`);
    });
  });

  check(() => {
    const res = convertToBBAN(bok, '1234567890123456789012345');
    assertEqual(res.success, false, 'Very long input should fail');
    assertEqual(
      res.error,
      VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
      'Very long input error message'
    );
  });

  check(() => {
    const res = convertToBBAN(bnmb, '12');
    assertEqual(res.success, false, 'Very short input should fail');
    assertEqual(
      res.error,
      VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
      'Very short input error message'
    );
  });

  return { passed, total };
}
