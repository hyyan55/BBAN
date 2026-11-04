import { banks } from '../data/banks';
import { convertToBBAN, VALIDATION_MESSAGES } from './bban';

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(
      `[Test Failed] ${message}: expected "${expected}", got "${actual}"`
    );
  }
}

function assertTrue(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Test Failed] ${message}`);
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

  const expectedBanks = [
    { id: 'bok', prefix: '040', length: 7, suffix: '0001' },
    { id: 'onb', prefix: '240', length: 6, suffix: '00001' },
    { id: 'fib', prefix: '02', length: 8, suffix: '0001' },
    { id: 'bnmb', prefix: '150000', length: 8, suffix: '' },
    { id: 'sib', prefix: '14000', length: 4, suffix: '00001' },
    { id: 'fcb', prefix: '222', length: 11, suffix: '' },
    { id: 'sfb', prefix: '110', length: 6, suffix: '00001' },
    { id: 'abs', prefix: '03', length: 7, suffix: '01001' },
    { id: 'alsalam', prefix: '180', length: 6, suffix: '00001' },
    { id: 'albaraka', prefix: '070', length: 6, suffix: '00001' },
  ];

  check(() => {
    assertEqual(banks.length, 10, 'Exactly 10 banks must exist');
  });

  expectedBanks.forEach((expected) => {
    const bank = banks.find((item) => item.id === expected.id);

    check(() => {
      assertTrue(!!bank, `Bank ${expected.id} must exist`);
      assertEqual(bank!.prefix, expected.prefix, `${expected.id} prefix`);
      assertEqual(bank!.suffix, expected.suffix, `${expected.id} suffix`);
      assertEqual(bank!.accountLength, expected.length, `${expected.id} account length`);
      assertEqual(bank!.minAccountLength, expected.length, `${expected.id} minimum length`);
      assertEqual(bank!.maxAccountLength, expected.length, `${expected.id} maximum length`);
    });

    const account = '12345678901'.slice(0, expected.length);
    const expectedBBAN = `${expected.prefix}${account}${expected.suffix}`;

    check(() => {
      const result = convertToBBAN(bank!, account);

      assertEqual(result.success, true, `${expected.id} valid conversion`);
      assertEqual(result.bban, expectedBBAN, `${expected.id} BBAN output`);
      assertEqual(result.bban.length, 14, `${expected.id} BBAN must have 14 digits`);
      assertTrue(/^[0-9]{14}$/.test(result.bban), `${expected.id} BBAN digits`);
    });

    check(() => {
      const result = convertToBBAN(bank!, account.slice(1));

      assertEqual(result.success, false, `${expected.id} shorter account must fail`);
      assertEqual(
        result.error,
        VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
        `${expected.id} shorter account error`
      );
    });

    check(() => {
      const result = convertToBBAN(bank!, account + '1');

      assertEqual(result.success, false, `${expected.id} longer account must fail`);
      assertEqual(
        result.error,
        VALIDATION_MESSAGES.INVALID_ACCOUNT_FOR_BANK,
        `${expected.id} longer account error`
      );
    });
  });

  const bok = banks.find((bank) => bank.id === 'bok')!;

  check(() => {
    const result = convertToBBAN(null, '1234567');
    assertEqual(result.success, false, 'Missing bank must fail');
    assertEqual(result.error, VALIDATION_MESSAGES.BANK_REQUIRED, 'Missing bank error');
  });

  check(() => {
    const result = convertToBBAN(bok, '');
    assertEqual(result.success, false, 'Empty account must fail');
    assertEqual(result.error, VALIDATION_MESSAGES.ACCOUNT_REQUIRED, 'Empty account error');
  });

  check(() => {
    const result = convertToBBAN(bok, '1234abc');
    assertEqual(result.success, false, 'Letters must fail');
    assertEqual(result.error, VALIDATION_MESSAGES.DIGITS_ONLY, 'Letters error');
  });

  check(() => {
    const result = convertToBBAN(bok, '١٢٣٤٥٦٧');
    assertEqual(result.success, false, 'Arabic digits must fail');
    assertEqual(result.error, VALIDATION_MESSAGES.DIGITS_ONLY, 'Arabic digits error');
  });

  check(() => {
    const result = convertToBBAN(bok, '0000000');
    assertEqual(result.success, false, 'All-zero account must fail');
  });

  check(() => {
    const result = convertToBBAN(bok, ' 1234 567 ');
    assertEqual(result.success, true, 'Spaces should be removed');
    assertEqual(result.bban, '04012345670001', 'BOK conversion with spaces');
  });

  check(() => {
    const result = convertToBBAN(bok, '       ');
    assertEqual(result.success, false, 'Spaces only must fail');
    assertEqual(result.error, VALIDATION_MESSAGES.ACCOUNT_REQUIRED, 'Spaces-only error');
  });

  return { passed, total };
}
