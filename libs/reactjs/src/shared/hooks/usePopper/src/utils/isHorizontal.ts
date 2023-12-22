/**
 * Determines if a given position string refers to a horizontal direction.
 *
 * This function checks if the provided position string contains either 'left' or 'right',
 * indicating a horizontal direction. It uses a regular expression to test for these values.
 *
 * @param {string} pos - The position string to test. This should be a string that potentially
 * contains 'left' or 'right'.
 * @returns {boolean} True if the position string contains 'left' or 'right', indicating
 * a horizontal direction; false otherwise.
 *
 * @example
 * // Testing for a horizontal position
 * isHorizontal('left'); // returns true
 * isHorizontal('right'); // returns true
 * isHorizontal('top'); // returns false
 */
export const isHorizontal = (pos: string): boolean => /(left|right)/.test(pos);
