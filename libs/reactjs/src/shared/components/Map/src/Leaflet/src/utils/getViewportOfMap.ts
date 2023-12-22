import { Map } from 'leaflet';
import { Viewport } from 'utilities';

/**
 * Retrieves the current viewport details from a Leaflet map instance.
 *
 * This function extracts geographical boundary coordinates (longitude and latitude)
 * and the current zoom level from the provided Leaflet map instance. It then
 * constructs and returns these details as a `Viewport` object, which includes the
 * minimum and maximum longitude and latitude, as well as the current zoom level.
 *
 * @param {Map} map - The Leaflet map instance from which to retrieve the viewport details.
 * @return {Viewport} - An object containing the geographical boundary coordinates
 *                      (minLng, minLat, maxLng, maxLat) and the current zoom level of the map.
 */
export const getViewportOfMap = (map: Map): Viewport => {
  const bounds = map.getBounds();
  return {
    minLng: bounds.getWest(),
    minLat: bounds.getSouth(),
    maxLng: bounds.getEast(),
    maxLat: bounds.getNorth(),
    zoom: map.getZoom(),
  };
};
