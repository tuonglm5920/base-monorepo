import { ReactElement } from 'react';
import { Coordinate } from 'utilities';

/**
 * Represents a geographical stop point of tracking movement
 */
export interface StopPoint {
  /** Latitude of the stop point. */
  lat: number;

  /** Longitude of the stop point. */
  lng: number;

  /** Unique identifier for the stop point, can be a string or a number. */
  uid: string;
}

/**
 * Describes the movement of a tracking entity, including its path and stop points.
 */
export interface TrackingMovement {
  /** Unique identifier for the tracking entity. */
  uid: string;

  /**
   * An array of Coordinate objects representing the sequential points
   * along the entity's path. Each point defines a specific location in
   * geographical coordinates (latitude and longitude).
   */
  points: Coordinate[];

  /** Array of StopPoint objects representing places where the entity stops. */
  stopPoints: StopPoint[];

  /** Color of the stroke line representing the entity's path. */
  strokeColor: string;

  /** Opacity of the stroke line, ranging from 0 (completely transparent) to 1 (completely opaque). */
  strokeOpacity: number;

  /** Thickness of the stroke line in pixels. */
  strokeWeight: number;

  /** Function to render a React element for each stop point. */
  renderPoint: (stopPoint: StopPoint) => ReactElement;
}
