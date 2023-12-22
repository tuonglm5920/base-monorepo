/**
 * Performs linear interpolation between two values.
 *
 * @param {number} p1 - The first value.
 * @param {number} p2 - The second value.
 * @param {number} t - The interpolation factor between 0 and 1.
 * @returns {number} The interpolated value. When t=0, returns p1; when t=1, returns p2.
 */
export const lerp = (p1: number, p2: number, t: number): number => {
  return p1 + (p2 - p1) * t;
};
