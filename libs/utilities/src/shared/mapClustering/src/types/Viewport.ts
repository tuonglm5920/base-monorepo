/**
 * Represents a geographical viewport defined by its minimum and maximum longitude and latitude values, along with a zoom level.
 *
 * @property {number} minLng - The minimum longitude of the viewport.
 * @property {number} minLat - The minimum latitude of the viewport.
 * @property {number} maxLng - The maximum longitude of the viewport.
 * @property {number} maxLat - The maximum latitude of the viewport.
 * @property {number} zoom - The zoom level of the viewport, defining how zoomed in or out the view is.
 */
export interface Viewport {
  /** The minimum longitude of the viewport. */
  minLng: number;
  /** The minimum latitude of the viewport. */
  minLat: number;
  /** The maximum longitude of the viewport. */
  maxLng: number;
  /** The maximum latitude of the viewport. */
  maxLat: number;
  /** The zoom level of the viewport. */
  zoom: number;
}
