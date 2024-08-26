/**
 * Distributes satoshis (sats) to a list of recipients based on their splits.
 *
 * Tries to ensure that every recipient gets at least one sat. This makes it so that all the
 * recipients receive TLV records associated with the payment.
 *
 * If there aren't enough sats, the function will prioritize recipients with higher splits.
 *
 * @param splits - An array of numbers representing the splits for each recipient
 * @param totalSats - The total number of satoshis to distribute
 * @returns An array of numbers representing the number of satoshis for each recipient
 *
 * @example
 * // Example 1
 * const splits1 = [60, 40];
 * const totalSats1 = 1000;
 * console.log(computeSatRecipients(splits1, totalSats1)); // [600, 400]
 *
 * @example
 * // Example 2
 * const splits2 = [1, 99];
 * const totalSats2 = 10;
 * // It's ensured that the recipient with 1% split still gets at least 1 sat:
 * console.log(computeSatRecipients(splits2, totalSats2)); // [1, 9]
 *
 * @example
 * // Example 3
 * const splits3 = [1, 99];
 * const totalSats3 = 1;
 * // There is only 1 sat available to distribute, so the recipient with the larger split gets it:
 * console.log(computeSatRecipients(splits3, totalSats3)); // [0, 1]
 */
export function computeSatRecipients(
  splits: number[],
  totalSats: number,
): number[] {
  const numRecipients = splits.length;
  const totalSplit = splits.reduce((sum, split) => sum + split, 0);

  if (splits.length === 0) {
    return [];
  }

  // Create an array of [index, split] pairs and sort it by split in descending order
  const indexedSplits: [number, number][] = splits
    .map((split, index) => [index, split] as [number, number])
    .sort((a, b) => b[1] - a[1]);

  const satAmounts: number[] = new Array(numRecipients).fill(0);
  let remainingSats = totalSats;

  // First, give one sat to as many recipients as possible, prioritizing higher splits
  for (const [index] of indexedSplits) {
    if (remainingSats === 0) {
      break;
    }
    satAmounts[index] = 1;
    remainingSats--;
  }

  if (remainingSats > 0) {
    // Distribute remaining sats based on split ratios
    if (totalSplit > 0) {
      for (const [index, split] of indexedSplits) {
        const share = Math.floor((split * remainingSats) / totalSplit);
        (satAmounts[index] as number) += share;
      }
    }

    // Distribute any leftover sats to recipients with the highest splits
    const distributedSats = satAmounts.reduce((sum, amount) => sum + amount, 0);
    remainingSats = totalSats - distributedSats;

    if (remainingSats > 0) {
      for (const [index] of indexedSplits) {
        if (remainingSats === 0) {
          break;
        }
        (satAmounts[index] as number)++;
        remainingSats--;
      }
    }
  }

  return satAmounts;
}
