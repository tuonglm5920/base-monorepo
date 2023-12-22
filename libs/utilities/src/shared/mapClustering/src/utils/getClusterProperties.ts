import { clone, nth } from 'ramda';
import { OFFSET_ID, OFFSET_NUM_POINTS, OFFSET_PROP } from '../constants';
import { ClusterProperties } from '../types/Cluster';
import { Point, PointExtendProps } from '../types/Point';
import { KDBush } from './kdbush';

interface GetClusterProperties<P extends PointExtendProps> {
  /**
   * The array of points data managed by the KDBush algorithm.
   * Each element in the array represents a point in the spatial index.
   */
  kdBushData: KDBush['data'];
  /** The index of the specific cluster in the spatial index. */
  index: number;

  /**
   * The points of clusters.
   * This is an array of clusters, where each cluster is represented by an object holding an array of points.
   */
  pointsOfClusters: Array<{ points: Point<P>[] }>;
}

/**
 * Retrieves the properties of a specific cluster based on its index and related data.
 * This function is used to extract detailed information about a cluster, such as its size, constituent points,
 * and the array of points that it encompasses. It leverages the cluster's metadata to construct a complete picture of the cluster's characteristics.
 *
 * @template P - The type parameter extends PointExtendProps, representing the type of data associated with points in the cluster.
 * @param {GetClusterProperties<P>} params An object containing `kdBushData`, `index`, and `clusterProps` which are
 *                                         necessary for calculating the cluster's properties.
 * @return {ClusterProperties<P>} Returns the properties of the cluster, including its ID, point count, and the points it contains.
 */
export const getClusterProperties = <P extends PointExtendProps>({
  index,
  kdBushData,
  pointsOfClusters,
}: GetClusterProperties<P>): ClusterProperties<P> => {
  const count = kdBushData[index + OFFSET_NUM_POINTS];
  const propIndex = kdBushData[index + OFFSET_PROP];
  const properties = nth(propIndex, pointsOfClusters);
  return {
    points: clone(properties?.points ?? []),
    cluster: true,
    clusterId: kdBushData[index + OFFSET_ID],
    pointsCount: count,
  };
};
