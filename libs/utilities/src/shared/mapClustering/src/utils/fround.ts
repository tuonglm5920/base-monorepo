/**
 * Provides a polyfill for `Math.fround`. It rounds a number to the nearest 32-bit single precision float.
 * If `Math.fround` is available, it uses that, otherwise it uses a custom implementation.
 *
 * @param {number} x - The number to round.
 * @returns {number} The number rounded to the nearest 32-bit single precision float.
 */
export const fround: (x: number) => number =
  Math.fround ||
  (
    (tmp: Float32Array) =>
    (x: number): number => {
      tmp[0] = +x;
      return tmp[0];
    }
  )(new Float32Array(1));
