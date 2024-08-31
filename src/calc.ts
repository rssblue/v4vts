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
  const numRecipients = splits.length;
  const totalSplit = splits.reduce((sum, split) => sum + split, 0);

  if (splits.length === 0) {
    return [];
  }

  // Check if all splits are non-zero and totalSats is a multiple of totalSplit
  if (!splits.includes(0) && totalSats % totalSplit === 0) {
    // Distribute sats proportionally
    return splits.map((split) => Math.floor((split * totalSats) / totalSplit));
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
