/**
 * Determines if a given value is outside the horizontal bounds of a window.
 *
 * This function checks if the provided numerical value exceeds the width of a window. It's
 * typically used in graphical user interfaces or animations to determine if an element
 * has moved outside the visible horizontal area of the window.
 *
 * @param {number} val - The value to be checked, typically representing an x-coordinate.
 * @param {number} windowWidth - The width of the window against which the value is compared.
 * @returns {boolean} True if the value is greater than the window width (i.e., outside the
 * horizontal bounds of the window); false otherwise.
 *
 * @example
 * // Checking if a value is outside the horizontal bounds of a window
 * isOutsideX(1024, 800); // returns true
 * isOutsideX(600, 800); // returns false
 */
export const isOutsideX = (val: number, windowWidth: number): boolean => {
  return val > windowWidth;
};

/**
 * Determines if a given value is outside the vertical bounds of a window.
 *
 * This function checks if the provided numerical value exceeds the height of a window. It's
 * typically used in graphical user interfaces or animations to determine if an element
 * has moved outside the visible vertical area of the window.
 *
 * @param {number} val - The value to be checked, typically representing a y-coordinate.
 * @param {number} windowHeight - The height of the window against which the value is compared.
 * @returns {boolean} True if the value is greater than the window height (i.e., outside the
 * vertical bounds of the window); false otherwise.
 *
 * @example
 * // Checking if a value is outside the vertical bounds of a window
 * isOutsideY(600, 400); // returns true
 * isOutsideY(300, 400); // returns false
 */
export const isOutsideY = (val: number, windowHeight: number): boolean => {
  return val > windowHeight;
};
