import { Cluster } from './Cluster';
import { Point, PointExtendProps } from './Point';

/**
 * Represents either a single point or a cluster of points.
 * This type is a union of `Point<P>` and `Cluster<P>`, allowing it to handle
 * data structures that can be either an individual point or a collection of points grouped as a cluster.
 */
export type PointOrCluster<P extends PointExtendProps> = Point<P> | Cluster<P>;
