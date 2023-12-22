/**
 * Converts an x-coordinate in spherical Mercator projection to longitude.
 * The spherical Mercator projection is a common format used in web mapping
 * and geographic information systems. This function specifically translates
 * the x-coordinate from the Mercator projection to a longitude value in degrees.
 *
 * @param {number} x - The x-coordinate in spherical Mercator projection.
 * @returns {number} The corresponding longitude in degrees.
 */
export const xLng = (x: number): number => {
  return (x - 0.5) * 360;
};
