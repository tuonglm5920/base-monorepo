import { Coordinate } from 'utilities';

/** Represents a planning entity with specific attributes for rendering on a map. */
export interface Planning {
  /** Unique identifier for the planning entity. */
  uid: string;

  /** Array of coordinates representing points on the map. */
  points: Coordinate[];

  /** Color of the stroke (border) when rendering the planning entity on the map. */
  strokeColor: string;

  /**
   * Opacity of the stroke (border) when rendering the planning entity on the map.
   * Value ranges from 0 (completely transparent) to 1 (completely opaque).
   */
  strokeOpacity: number;

  /** Weight or thickness of the stroke (border) when rendering the planning entity on the map. */
  strokeWeight: number;

  /** Color to fill the interior of the planning entity when rendering on the map. */
  fillColor: string;

  /**
   * Opacity of the fill when rendering the interior of the planning entity on the map.
   * Value ranges from 0 (completely transparent) to 1 (completely opaque).
   */
  fillOpacity: number;
}
