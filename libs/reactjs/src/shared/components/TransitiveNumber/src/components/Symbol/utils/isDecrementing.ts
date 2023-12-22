/**
 * Checks whether the numeric value of string `a` is greater than string `b`.
 * Both parameters are expected to be strings that can be converted to numbers.
 *
 * @param {string | number} a - The first string or number to compare, expected to represent a number.
 * @param {string | number} b - The second string or number to compare, expected to represent a number.
 * @returns {boolean} Returns `true` if the numeric value of `a` is less than `b`, otherwise `false`.
 */
export const isDecrementing = (a: string | number, b: string | number): boolean => {
  const numberA = Number(a);
  const numberB = Number(b);

  // Special case when going from 9 or 6 to 0 (and back).
  if (Math.abs(numberB - numberA) !== 1) {
    return numberA === 0;
  } else {
    return numberB < numberA;
  }
};
