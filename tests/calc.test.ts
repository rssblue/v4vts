import { computeSatRecipients } from "v4vts/calc";

import { test, expect, describe } from "vitest";

describe("computeSatRecipients", () => {
  test("case-1", () => {
    const splits = [100];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([100]);
  });

  test("case-2", () => {
    const splits = [50, 50];
    const totalSats = 100;
    expect(computeSatRecipients(splits, totalSats)).toEqual([50, 50]);
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
});
