/**
 * Calculates the squared distance between two points in a 2D space.
 *
 * This function computes the squared distance between two points (ax, ay) and (bx, by)
 * on a 2D plane.
 *
 * @param {number} ax - The x-coordinate of the first point.
 * @param {number} ay - The y-coordinate of the first point.
 * @param {number} bx - The x-coordinate of the second point.
 * @param {number} by - The y-coordinate of the second point.
 * @returns {number} The squared distance between the two points.
 */
export const sqDist = (ax: number, ay: number, bx: number, by: number): number => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};
