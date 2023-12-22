import { Cluster } from '../types/Cluster';
import { PointExtendProps } from '../types/Point';
import { PointOrCluster } from '../types/PointOrCluster';

/**
 * Type guard function to check if the provided properties are of the ClusterProperties type.
 * It determines if the given properties object belongs to a cluster.
 *
 * @template P - A generic parameter that extends PointExtendPropss, representing additional properties.
 * @param {PointOrCluster<P>} leaf - The properties object to be checked.
 * @returns {boolean} - Returns `true` if `leaf` is of type ClusterProperties, otherwise `false`.
 */

export const isCluster = <P extends PointExtendProps>(
  leaf: PointOrCluster<P> | undefined | null,
): leaf is Cluster<P> => {
  return !!leaf && leaf.properties && 'cluster' in leaf.properties && leaf.properties.cluster;
};
