/**
 * Converts a longitude value to its corresponding x-coordinate in the spherical Mercator projection.
 * The spherical Mercator projection is widely used in web mapping and GIS applications.
 * This function maps longitude values to a [0..1] range suitable for spherical Mercator.
 *
 * @param {number} lng - The longitude value to be converted, in degrees.
 * @returns {number} The x-coordinate in the spherical Mercator projection, in the [0..1] range.
 */
export const lngX = (lng: number): number => {
  return lng / 360 + 0.5;
};
