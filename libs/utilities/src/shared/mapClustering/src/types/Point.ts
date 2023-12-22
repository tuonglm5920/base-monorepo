import { Geometry } from './Geometry';

/**
 * Defines a base type for point extension properties.
 * Can either be an object with any structure, or null.
 */
export type PointExtendProps = object | null;

/**
 * Represents the properties of a point. This is a generic type that can extend any object structure.
 *
 * @template Other - A generic parameter that can be any object or null, allowing for custom properties.
 */
export type PointProperties<Other extends PointExtendProps> = Other & {
  uid: string;
};

/**
 * Represents a point, which includes properties and optional geometry.
 *
 * @template Other - A generic parameter for additional properties extending the basic point properties.
 */
export interface Point<Other extends PointExtendProps> {
  /** Properties of the point, which can include any additional properties as defined by the generic type `Other`. */
  properties: PointProperties<Other>;

  /** Optional geometry information for the point, representing its geographical location. */
  geometry?: Geometry;
}
