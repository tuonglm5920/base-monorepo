/**
 * Converts a y-coordinate in spherical Mercator projection to latitude.
 * The spherical Mercator projection is commonly used in web mapping applications.
 *
 * @param {number} y - The y-coordinate in spherical Mercator projection.
 * @returns {number} The corresponding latitude in degrees.
 */
export const yLat = (y: number): number => {
  const y2 = ((180 - y * 360) * Math.PI) / 180;
  return (360 * Math.atan(Math.exp(y2))) / Math.PI - 90;
};
