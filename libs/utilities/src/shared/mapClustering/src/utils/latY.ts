/**
 * Converts a latitude value to its corresponding y-coordinate in the spherical Mercator projection.
 * The spherical Mercator projection is extensively used in web mapping and GIS (Geographic Information Systems).
 * This function maps latitude values to a [0..1] range, suitable for spherical Mercator.
 * Latitude values are clamped to the range [0, 1] to ensure they fit within the Mercator projection bounds.
 *
 * @param {number} lat - The latitude value to be converted, in degrees.
 * @returns {number} The y-coordinate in the spherical Mercator projection, in the [0..1] range.
 */
export const latY = (lat: number): number => {
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
  return y < 0 ? 0 : y > 1 ? 1 : y;
};
