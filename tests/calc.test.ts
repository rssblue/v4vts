import {
  computeSatRecipients,
  feeRecipientsToSplits,
  RecipientsToSplitsError,
} from "v4vts/calc";

import { test, expect, describe } from "vitest";

describe("computeSatRecipients", () => {
  test("case-1", () => {
    const splits = [100];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([100]);
  });

  test("case-2", () => {
    const splits = [50, 50];
    const totalSats = 1000;
    expect(computeSatRecipients(splits, totalSats)).toEqual([500, 500]);
  });

  test("case-3", () => {
    const splits = [50, 50];
    const totalSats = 1;
    expect(computeSatRecipients(splits, totalSats)).toEqual([1, 0]);
  });

  test("case-4", () => {
    const splits = [0, 0];
    const totalSats = 1;
    expect(computeSatRecipients(splits, totalSats)).toEqual([1, 0]);
  });

  test("case-5", () => {
    const splits = [50, 50, 1];
    const totalSats = 1;
    expect(computeSatRecipients(splits, totalSats)).toEqual([1, 0, 0]);
  });

  test("case-6", () => {
    const splits = [50, 50, 1];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([50, 49, 1]);
  });

  test("case-7", () => {
    const splits = [1, 50, 50];
    const totalSats = 1;
    expect(computeSatRecipients(splits, totalSats)).toEqual([0, 1, 0]);
  });

  test("case-8", () => {
    const splits = [99, 1, 1];
    const totalSats = 10;
    expect(computeSatRecipients(splits, totalSats)).toEqual([8, 1, 1]);
  });

  test("case-9", () => {
    const splits = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const totalSats = 10;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-10", () => {
    const splits = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const totalSats = 9;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    ]);
  });

  test("case-11", () => {
    const splits = [2, 2, 2, 2, 1, 2, 2, 2, 2, 2];
    const totalSats = 9;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-12", () => {
    const splits = [
      1000000, 1000000, 1000000, 1000000, 1, 1000000, 1000000, 1000000, 1000000,
      1000000,
    ];
    const totalSats = 9;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-13", () => {
    const splits = [
      1000000, 1000000, 1000000, 1000000, 0, 1000000, 1000000, 1000000, 1000000,
      1000000,
    ];
    const totalSats = 9;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-14", () => {
    const splits = [
      1000000, 1000000, 1000000, 1000000, 0, 1000000, 1000000, 1000000, 1000000,
      1000000,
    ];
    const totalSats = 11;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-15", () => {
    const splits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const totalSats = 55;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  test("case-16", () => {
    const splits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const totalSats = 56;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  test("case-17", () => {
    const splits = [0, 0, 0, 0, 0];
    const totalSats = 6;
    expect(computeSatRecipients(splits, totalSats)).toEqual([2, 1, 1, 1, 1]);
  });

  test("case-18", () => {
    const splits = [Number.MAX_SAFE_INTEGER];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([100]);
  });

  test("case-19", () => {
    const splits = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([50, 50]);
  });

  test("case-20", () => {
    const splits = [Number.MAX_SAFE_INTEGER, 1, Number.MAX_SAFE_INTEGER];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([50, 1, 49]);
  });

  test("case-21", () => {
    const splits = [Number.MAX_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([50, 1, 49]);
  });

  test("case-22", () => {
    const splits: number[] = [];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([]);
  });

  test("case-23", () => {
    const splits: number[] = [];
    const totalSats = 0;
    expect(computeSatRecipients(splits, totalSats)).toEqual([]);
  });

  test("case-24", () => {
    const splits = [1];
    const totalSats = 0;
    expect(computeSatRecipients(splits, totalSats)).toEqual([0]);
  });

  test("case-25", () => {
    const splits = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    const totalSats = 0;
    expect(computeSatRecipients(splits, totalSats)).toEqual([0, 0]);
  });

  test("case-26", () => {
    const splits = [50, 40, 3, 2, 2, 1, 2];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      50, 40, 3, 2, 2, 1, 2,
    ]);
  });

  test("case-27", () => {
    const splits = [50, 40, 3, 2, 2, 1, 2];
    const totalSats = 1000;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      500, 400, 30, 20, 20, 10, 20,
    ]);
  });

  test("case-28", () => {
    const splits = [50, 40, 3, 2, 2, 1, 2];
    const totalSats = 10;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      3, 2, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-29", () => {
    const splits = [50, 40, 3, 2, 2, 1, 2];
    const totalSats = 101;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      51, 40, 3, 2, 2, 1, 2,
    ]);
  });

  test("case-30", () => {
    const splits = [50, 40, 3, 2, 2, 1, 2];
    const totalSats = 99;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      50, 40, 3, 2, 2, 1, 1,
    ]);
  });

  test("case-31", () => {
    const splits = [0];
    const totalSats = Number.MAX_SAFE_INTEGER;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      Number.MAX_SAFE_INTEGER,
    ]);
  });

  test("case-32", () => {
    const splits = [50, 40, 3, 2, 2, 0, 2];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      50, 40, 3, 2, 2, 1, 2,
    ]);
  });

  test("case-33", () => {
    const splits = [50, 50, 0, 0, 0, 0, 0];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      48, 47, 1, 1, 1, 1, 1,
    ]);
  });

  test("case-34", () => {
    const splits = [50, 50, 0, 0, 0, 0, 0];
    const totalSats = 101;
    expect(computeSatRecipients(splits, totalSats)).toEqual([
      48, 48, 1, 1, 1, 1, 1,
    ]);
  });

  // TypeScript could allow negative/NaN values:
  test("case-35", () => {
    const splits = [50, -50];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([99, 1]);
  });
  test("case-36", () => {
    const splits = [50, 50];
    const totalSats = -100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([0, 0]);
  });
  test("case-37", () => {
    const splits = [50, NaN];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([99, 1]);
  });
  test("case-38", () => {
    const splits = [50, 50];
    const totalSats = NaN;
    expect(computeSatRecipients(splits, totalSats)).toEqual([0, 0]);
  });
});

describe("feeRecipientsToSplits", () => {
  test("case_1", () => {
    const recipients: Recipient[] = [{ numShares: 50 }, { numShares: 50 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([1, 1]);
  });

  test("case_2", () => {
    const recipients: Recipient[] = [
      { numShares: 50 },
      { numShares: 50 },
      { percentage: 2 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([49, 49, 2]);
  });

  test("case_3", () => {
    const recipients: Recipient[] = [
      { numShares: 50 },
      { numShares: 50 },
      { percentage: 1 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([99, 99, 2]);
  });

  test("case_4", () => {
    const recipients: Recipient[] = [
      { numShares: 50 },
      { numShares: 50 },
      { percentage: 1 },
      { percentage: 1 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([49, 49, 1, 1]);
  });

  test("case_5", () => {
    const recipients: Recipient[] = [
      { numShares: 1 },
      { numShares: 1 },
      { percentage: 2 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([49, 49, 2]);
  });

  test("case_6", () => {
    const recipients: Recipient[] = [{ percentage: 100 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([1]);
  });

  test("case_7", () => {
    const recipients: Recipient[] = [{ percentage: 2 }, { percentage: 1 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([2, 1]);
  });

  test("case_8", () => {
    const recipients: Recipient[] = [
      { numShares: 10 },
      { numShares: 20 },
      { numShares: 30 },
      { numShares: 40 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([1, 2, 3, 4]);
  });

  test("case_9", () => {
    const recipients: Recipient[] = [
      { numShares: 10 },
      { numShares: 20 },
      { numShares: 30 },
      { numShares: 40 },
      { percentage: 1 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([99, 198, 297, 396, 10]);
  });

  test("case_10", () => {
    const recipients: Recipient[] = [
      { numShares: 10 },
      { numShares: 20 },
      { numShares: 30 },
      { numShares: 40 },
      { percentage: 1 },
      { percentage: 1 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([49, 98, 147, 196, 5, 5]);
  });

  test("case_11", () => {
    const recipients: Recipient[] = [
      { percentage: 1 },
      { numShares: 10 },
      { numShares: 20 },
      { numShares: 30 },
      { percentage: 1 },
      { numShares: 40 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([5, 49, 98, 147, 5, 196]);
  });

  test("case_12", () => {
    const recipients: Recipient[] = [{ percentage: 100 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([1]);
  });

  test("case_13", () => {
    const recipients: Recipient[] = [{ percentage: 1 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([1]);
  });

  test("case_14", () => {
    const recipients: Recipient[] = [{ percentage: 101 }];
    expect(feeRecipientsToSplits(recipients)).toBe(
      RecipientsToSplitsError.TotalFeeExceeds100,
    );
  });

  test("case_15", () => {
    const recipients: Recipient[] = [{ percentage: 100 }, { numShares: 1 }];
    expect(feeRecipientsToSplits(recipients)).toBe(
      RecipientsToSplitsError.FeeIs100ButNonFeeRecipientsExist,
    );
  });

  test("case_16", () => {
    const recipients: Recipient[] = [
      { numShares: 50 },
      { numShares: 40 },
      { numShares: 3 },
      { numShares: 2 },
      { numShares: 2 },
      { numShares: 1 },
      { percentage: 2 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([50, 40, 3, 2, 2, 1, 2]);
  });

  test("case_17", () => {
    const recipients: Recipient[] = [{ numShares: 99999 }, { numShares: 1 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([99999, 1]);
  });

  test("case_18", () => {
    const recipients: Recipient[] = [{ numShares: 0 }, { percentage: 0 }];
    expect(feeRecipientsToSplits(recipients)).toEqual([0, 0]);
  });

  test("case_19", () => {
    const recipients: Recipient[] = [
      { numShares: Number.MAX_SAFE_INTEGER },
      { numShares: Number.MAX_SAFE_INTEGER },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([1, 1]);
  });

  test("case_20", () => {
    const recipients: Recipient[] = [
      { numShares: Number.MAX_SAFE_INTEGER },
      { numShares: 1 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([
      Number.MAX_SAFE_INTEGER,
      1,
    ]);
  });

  test("case_21", () => {
    const recipients: Recipient[] = [
      { numShares: Number.MAX_SAFE_INTEGER },
      { percentage: 1 },
    ];
    expect(feeRecipientsToSplits(recipients)).toEqual([99, 1]);
  });
});
