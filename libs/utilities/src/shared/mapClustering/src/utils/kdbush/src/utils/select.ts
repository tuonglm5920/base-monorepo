import { swapItem } from './swapItem';

/**
 * Performs a partial quicksort to partition elements based on a selected axis.
 *
 * This function is designed to reorder elements in the 'ids' and 'coords' arrays so that the element
 * at the 'k'-th position is in the place it would be in a sorted array. Other elements are partitioned
 * around this 'k'-th element.
 *
 * @param {number[]} ids - Array of numeric identifiers.
 * @param {number[]} coords - Array of numeric coordinates, where each pair of numbers represents a single coordinate (x, y).
 * @param {number} k - The index of the element to partition around.
 * @param {number} left - The starting index of the segment of the array to be partitioned.
 * @param {number} right - The ending index of the segment of the array to be partitioned.
 * @param {number} axis - The axis (0 for x, 1 for y) used for comparing coordinates.
 */
export const select = (ids: number[], coords: number[], k: number, left: number, right: number, axis: number): void => {
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp((2 * z) / 3);
      const sd = 0.5 * Math.sqrt((z * s * (n - s)) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - (m * s) / n + sd));
      const newRight = Math.min(right, Math.floor(k + ((n - m) * s) / n + sd));
      select(ids, coords, k, newLeft, newRight, axis);
    }

    const t = coords[2 * k + axis];
    let i = left;
    let j = right;

    swapItem(ids, coords, left, k);
    if (coords[2 * right + axis] > t) {
      swapItem(ids, coords, left, right);
    }

    while (i < j) {
      swapItem(ids, coords, i, j);
      i++;
      j--;
      while (coords[2 * i + axis] < t) {
        i++;
      }
      while (coords[2 * j + axis] > t) {
        j--;
      }
    }

    if (coords[2 * left + axis] === t) {
      swapItem(ids, coords, left, j);
    } else {
      j++;
      swapItem(ids, coords, j, right);
    }

    if (j <= k) {
      left = j + 1;
    }
    if (k <= j) {
      right = j - 1;
    }
  }
};
