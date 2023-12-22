/**
 * Represents geographical coordinates.
 */
export interface Coordinate {
  /** Latitude value of the coordinate. */
  lat: number;

  /** Longitude value of the coordinate. */
  lng: number;
}

/**
 * Describes the geometry of an object, specifically its location.
 */
export interface Geometry {
  /**
   * An optional Coordinate object representing the geographical location.
   * This property is optional and can be omitted.
   */
  coordinate?: Coordinate;
}
