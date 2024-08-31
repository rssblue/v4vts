/**
 * Distributes satoshis (sats) to a list of recipients based on their splits.
 *
 * Tries to ensure that every recipient gets at least one sat. This makes it so that all the
 * recipients receive TLV records associated with the payment.
 *
 * If there aren't enough sats, the function will prioritize recipients with higher splits.
 *
 * If no recipients have 0 split and the total number of sats is a multiple of the sum of splits,
 * it distributes sats proportionally.
 *
 * @param splits - An array of numbers representing the splits for each recipient
 * @param totalSats - The total number of satoshis to distribute
 * @returns An array of numbers representing the number of satoshis for each recipient
 *
 * @example
 * // Example 1: Proportional distribution
 * const splits1 = [50, 40, 3, 2, 2, 1, 2];
 * const totalSats1 = 100;
 * console.log(computeSatRecipients(splits1, totalSats1)); // [50, 40, 3, 2, 2, 1, 2]
 *
 * @example
 * // Example 2: Regular distribution
 * const splits2 = [60, 40];
 * const totalSats2 = 1000;
 * console.log(computeSatRecipients(splits2, totalSats2)); // [600, 400]
 *
 * @example
 * // Example 3: Ensuring minimum distribution
 * const splits3 = [1, 99];
 * const totalSats3 = 10;
 * console.log(computeSatRecipients(splits3, totalSats3)); // [1, 9]
 */
export function computeSatRecipients(
  splits: number[],
  totalSats: number,
): number[] {
  // Sanitize totalSats: convert to a non-negative integer
  totalSats = Math.max(0, Math.floor(Number(totalSats) || 0));

  // Sanitize splits: convert each to a non-negative integer
  splits = splits.map((split) => Math.max(0, Math.floor(Number(split) || 0)));

  const numRecipients = splits.length;

  if (splits.length === 0 || totalSats === 0) {
    return new Array(numRecipients).fill(0);
  }

  // Use BigInt for calculations to avoid overflow
  const totalSplitBigInt = splits.reduce(
    (sum, split) => sum + BigInt(split),
    0n,
  );

  if (totalSplitBigInt === 0n) {
    // If all splits are zero, distribute evenly
    const baseAmount = Math.floor(totalSats / numRecipients);
    const remainder = totalSats % numRecipients;
    const result = new Array(numRecipients).fill(baseAmount);
    for (let i = 0; i < remainder; i++) {
      result[i]++;
    }
    return result;
  }

  // Distribute sats proportionally
  let satAmounts = splits.map((split) =>
    Number((BigInt(split) * BigInt(totalSats)) / totalSplitBigInt),
  );

  // Give one sat to everyone who doesn't have it
  satAmounts = satAmounts.map((amount) => (amount === 0 ? 1 : amount));

  let balance = totalSats - satAmounts.reduce((sum, amount) => sum + amount, 0);

  // Create an array of [index, split] pairs
  let indexedSplits = splits.map(
    (split, index) => [index, split] as [number, number],
  );

  if (balance < 0) {
    // Sort by increasing splits, then by decreasing index
    indexedSplits.sort(([i1, s1], [i2, s2]) => (s1 !== s2 ? s1 - s2 : i2 - i1));

    const initialBalance = balance;

    // First iteration: Remove from those that have at least two sats
    for (const [index, split] of indexedSplits) {
      const amountToRemove = Math.max(
        1,
        Math.floor(
          (split * Math.abs(initialBalance)) / Number(totalSplitBigInt),
        ),
      );
      if (balance < 0 && (satAmounts[index] as number) > amountToRemove) {
        // Remove amount proportional to the split
        (satAmounts[index] as number) -= amountToRemove;
        balance += amountToRemove;
      }
      if (balance === 0) break;
    }

    if (balance < 0) {
      let indexedSplitsWithAmounts = indexedSplits.map(
        ([index, split]) =>
          [index, split, satAmounts[index]] as [number, number, number],
      );

      // Sort based on the complex criteria
      indexedSplitsWithAmounts.sort(([i1, s1, a1], [i2, s2, a2]) => {
        if (a1 >= 2 && a2 >= 2) return s1 - s2;
        if (a1 >= 2) return -1;
        if (a2 >= 2) return 1;
        if (a1 >= 1 && a2 >= 1) return s1 - s2;
        if (a1 >= 1) return -1;
        if (a2 >= 1) return 1;
        return i2 - i1;
      });

      // Update indexedSplits with the new order
      indexedSplits = indexedSplitsWithAmounts.map(([i, s]) => [i, s]);

      for (const [index] of indexedSplits) {
        if (balance < 0 && (satAmounts[index] as number) > 0) {
          (satAmounts[index] as number)--;
          balance++;
        }
        if (balance === 0) break;
      }
    }
  } else if (balance > 0) {
    // Sort by decreasing splits for positive balance
    indexedSplits.sort(([, a], [, b]) => b - a);

    // Single iteration: add sats to recipients
    for (const [index] of indexedSplits) {
      if (balance > 0) {
        (satAmounts[index] as number)++;
        balance--;
      } else {
        break;
      }
    }
  }

  return satAmounts;
}

// Represents a share-based recipient.
export type ShareBasedRecipient = {
  numShares: number;
};

// Represents a percentage-based recipient.
export type PercentageBasedRecipient = {
  percentage: number;
};

export type Recipient = ShareBasedRecipient | PercentageBasedRecipient;

// Type guard function to determine the type of recipient
function isPercentageBased(
  recipient: Recipient,
): recipient is PercentageBasedRecipient {
  return "percentage" in recipient;
}

// Represents an error when converting a list of share- or percentage-based recipients into a list of share-like splits.
export enum RecipientsToSplitsError {
  TotalFeeExceeds100 = "Total fees exceeds 100%",
  FeeIs100ButNonFeeRecipientsExist = "Total fees equal 100%, but non-fee recipients exist",
}

// Calculates the greatest common divisor of two numbers.
function gcd(a: bigint, b: bigint): bigint {
  return b === 0n ? a : gcd(b, a % b);
}

/**
 * Converts a list of generic recipients into a list of share-like splits.
 *
 * Share-based recipients maintain the same ratios between themselves after percentage-based
 * recipients are included.
 *
 * @param recipients - An array of Recipients (either ShareBasedRecipient or PercentageBasedRecipient)
 * @returns An array of numbers representing the splits, or a RecipientsToSplitsError if an error occurs
 *
 * @example
 * ```typescript
 * const recipients: Recipient[] = [
 *     { numShares: 50 },
 *     { numShares: 50 },
 *     { percentage: 1 },
 * ];
 * // Share-based recipients still receive splits in the 50/50 ratio between them. But
 * // overall, they get 49.5% each, and the percentage-based recipient gets the required 1%.
 * // That's because 99/(99+99+2) = 49.5% and 2/(99+99+2) = 1%.
 * const result = feeRecipientsToSplits(recipients);
 * console.log(result); // [99, 99, 2]
 * ```
 */
export function feeRecipientsToSplits(
  recipients: Recipient[],
): number[] | RecipientsToSplitsError {
  const totalPercentage = recipients
    .filter(isPercentageBased)
    .reduce((sum, r) => sum + r.percentage, 0);

  if (totalPercentage > 100) {
    return RecipientsToSplitsError.TotalFeeExceeds100;
  }

  const shareRecipients = recipients.filter(
    (r): r is ShareBasedRecipient => !isPercentageBased(r),
  );

  if (totalPercentage === 100 && shareRecipients.length > 0) {
    return RecipientsToSplitsError.FeeIs100ButNonFeeRecipientsExist;
  }

  const remainingPercentage = BigInt(100 - totalPercentage);
  const totalShares = shareRecipients.reduce(
    (sum, r) => sum + BigInt(r.numShares),
    0n,
  );

  let result: bigint[] = recipients.map((recipient) => {
    if (!isPercentageBased(recipient)) {
      return BigInt(recipient.numShares) * remainingPercentage;
    } else {
      return shareRecipients.length === 0
        ? BigInt(recipient.percentage) * 100n
        : BigInt(recipient.percentage) * totalShares;
    }
  });

  // Find the GCD of all non-zero values to normalize the results
  const gcdValue = result.reduce(
    (acc, x) => (x !== 0n ? gcd(acc, x) : acc),
    0n,
  );

  if (gcdValue > 1n) {
    result = result.map((x) => (x === 0n ? 0n : x / gcdValue));
  }

  // Convert back to number[], scaling if necessary
  const maxBigInt = result.reduce((max, val) => (val > max ? val : max), 0n);
  if (maxBigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
    const scale =
      Number((BigInt(Number.MAX_SAFE_INTEGER) * 100n) / maxBigInt) / 100;
    return result.map((x) => Math.round(Number(x) * scale));
  } else {
    return result.map((x) => Number(x));
  }
}
