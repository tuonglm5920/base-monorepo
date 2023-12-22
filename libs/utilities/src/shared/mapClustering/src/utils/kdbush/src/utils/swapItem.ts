import { swap } from './swap';

/**
 * Swaps elements in two arrays, 'ids' and 'coords', at specified indices.
 *
 * This function swaps elements in the 'ids' array and corresponding coordinate pairs in the 'coords' array.
 * Each pair of elements in the 'coords' array represents a 2D coordinate, so this function effectively
 * swaps both the ID and its associated coordinate between the two indices.
 *
 * @param {number[]} ids - Array of numeric identifiers.
 * @param {number[]} coords - Array of numeric coordinates, where each pair of numbers represents a single coordinate (x, y).
 * @param {number} i - The first index for swapping.
 * @param {number} j - The second index for swapping.
 */
export const swapItem = (ids: number[], coords: number[], i: number, j: number): void => {
  swap<number[]>(ids, i, j);
  swap<number[]>(coords, 2 * i, 2 * j);
  swap<number[]>(coords, 2 * i + 1, 2 * j + 1);
};
