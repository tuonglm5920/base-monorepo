/**
 * Swaps two elements in an array.
 *
 * This function directly modifies the array passed as an argument by swapping the elements
 * at the specified indices. It's a generic function that can work with arrays of any type.
 * Note: The function does not return a value since it performs the operation in-place.
 *
 * @param {T} arr - The array in which elements need to be swapped. It should be an array of any type.
 * @param {number} i - The index of the first element to swap.
 * @param {number} j - The index of the second element to swap.
 * @template T - A generic type extending an array to ensure type safety.
 * @returns {void}
 */
export const swap = <T extends any[]>(arr: T, i: number, j: number): void => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};
