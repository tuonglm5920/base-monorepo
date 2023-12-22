import mapboxgl from 'mapbox-gl';
import { Viewport } from 'utilities';

/**
 * Retrieves the current viewport details from a Mapbox GL map instance.
 *
 * This function extracts the geographical boundaries (longitude and latitude)
 * and the current zoom level from the provided Mapbox GL map instance. It then
 * returns these details in a `Viewport` object.
 *
 * @param {mapboxgl.Map} map - The Mapbox GL map instance from which to retrieve the viewport details.
 * @return {Viewport} An object containing the minimum and maximum longitude and latitude bounds,
 *                    as well as the current zoom level of the map.
 */
export const getViewportOfMap = (map: mapboxgl.Map): Viewport => {
  const bounds = map.getBounds();
  return {
    minLng: bounds.getWest(),
    minLat: bounds.getSouth(),
    maxLng: bounds.getEast(),
    maxLat: bounds.getNorth(),
    zoom: map.getZoom(),
  };
};
