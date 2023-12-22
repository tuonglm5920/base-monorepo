import { select } from './select';

/**
 * Recursively sorts elements in the 'ids' and 'coords' arrays using a kd-tree inspired approach.
 *
 * This function sorts elements based on their coordinates, alternating between axes.
 * It's designed for multidimensional data, such as points in a 2D space. The function
 * performs a sort akin to QuickSort around the median element and then recursively
 * applies the same logic to the left and right halves, switching the axis each time.
 * The recursion stops when the size of the segment to be sorted is less than or equal to 'nodeSize'.
 *
 * @param {number[]} ids - Array of numeric identifiers.
 * @param {number[]} coords - Array of numeric coordinates, where each pair of numbers represents a single coordinate (x, y).
 * @param {number} nodeSize - The size threshold below which no further recursive sorting is done.
 * @param {number} left - The starting index of the segment of the array to be sorted.
 * @param {number} right - The ending index of the segment of the array to be sorted.
 * @param {number} axis - The axis (0 for x, 1 for y) used for sorting.
 */
export const sort = (
  ids: number[],
  coords: number[],
  nodeSize: number,
  left: number,
  right: number,
  axis: number,
): void => {
  if (right - left <= nodeSize) {
    return;
  }

  const m = (left + right) >> 1; // middle index

  select(ids, coords, m, left, right, axis);

  sort(ids, coords, nodeSize, left, m - 1, 1 - axis);
  sort(ids, coords, nodeSize, m + 1, right, 1 - axis);
};
