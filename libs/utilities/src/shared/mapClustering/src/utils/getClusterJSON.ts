import { OFFSET_X, OFFSET_Y } from '../constants';
import { Cluster } from '../types/Cluster';
import { Point, PointExtendProps } from '../types/Point';
import { getClusterProperties } from './getClusterProperties';
import { KDBush } from './kdbush';
import { xLng } from './xLng';
import { yLat } from './yLat';

interface GetClusterJSON<P extends PointExtendProps> {
  /**
   * Array of points data managed by the KDBush algorithm.
   * Each element in the array represents a point in the spatial index.
   */
  kdBushData: KDBush['data'];
  /**
   * The index of the current cluster in the spatial index.
   * This index is used to identify the specific cluster for processing.
   */
  index: number;
  /**
   * The points of clusters.
   * This is an array of clusters, where each cluster is represented by an object holding an array of points.
   */
  pointsOfClusters: Array<{ points: Point<P>[] }>;
}

/**
 * Constructs a cluster JSON object for a specific cluster identified by its index.
 * This function utilizes the provided data to assemble a comprehensive JSON representation of a cluster,
 * including its location, size, and constituent points.
 *
 * @template P - The type parameter extends PointExtendProps, representing the type of data associated with points in the cluster.
 * @param {GetClusterJSON<P>} params - An object containing `kdBushData`, `index`, and other parameters necessary for generating the cluster's JSON.
 * @return {Cluster<P>} Returns a `Cluster<P>` object representing the cluster's detailed data and structure.
 */
export const getClusterJSON = <P extends PointExtendProps>({
  kdBushData,
  index,
  ...params
}: GetClusterJSON<P>): Cluster<P> => {
  return {
    properties: {
      ...getClusterProperties({
        kdBushData,
        index,
        ...params,
      }),
    },
    geometry: {
      coordinate: {
        lng: xLng(kdBushData[index + OFFSET_X]),
        lat: yLat(kdBushData[index + OFFSET_Y]),
      },
    },
  };
};
