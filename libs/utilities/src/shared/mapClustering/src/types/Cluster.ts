import { Geometry } from './Geometry';
import { Point, PointExtendProps } from './Point';

export interface ClusterProperties<P extends PointExtendProps> {
  /** Always `true` to indicate that is a Cluster and not an individual point. */
  cluster: true;
  /** Cluster ID */
  clusterId: number;
  /** Number of points in the cluster. */
  pointsCount: number;
  /**
   * An array of points that are included in the cluster. Each point is of type `Point<P>`,
   * where `P` represents the type of the object or can be null.
   */
  points: Point<P>[];
}

/**
 * Represents a cluster, including its properties and optional geometry.
 */
export interface Cluster<P extends PointExtendProps> {
  /** The properties that define the cluster. */
  properties: ClusterProperties<P>;

  /** Optional geometry information for the cluster, representing its geographical location. */
  geometry?: Geometry;
}
