import { dequal } from 'dequal';
import { useRef, useState } from 'react';
import { MapClustering, MapClusteringOptions, Point, PointExtendProps, PointOrCluster, Viewport } from 'utilities';
import { useDeepCompareEffect } from '../../useDeepCompareEffect';
import { usePrevious } from '../../usePrevious';

/**
 * Interface for the parameters used in the `useMapClustering` hook.
 *
 * @template P - A generic type that extends `PointExtendProps`, representing the properties of a point.
 *
 * @property {Point<P>[]} points - Array of points to be clustered.
 * @property {Viewport} [viewport] - Optional geographic viewport to limit the clustering.
 * @property {number} zoom - Zoom level for the map, which can affect clustering.
 * @property {Partial<MapClusteringOptions>} [options] - Optional configuration options for map clustering.
 * @property {boolean} [disableRefresh] - If true, disables automatic re-clustering when points change.
 */

export interface UseMapClustering<P extends PointExtendProps> {
  /** An array of points (each point conforming to the generic type `P`) that are to be clustered. */
  points: Point<P>[];

  /**
   * Optional geographic viewport (defined by the `Viewport` interface) used to limit the scope of clustering.
   * If specified, only points within these viewport are considered for clustering.
   */
  viewport?: Viewport;

  /**
   * Optional configuration options for the clustering behavior. This is a partial set of `MapClusteringOptions`,
   * allowing partial customization of the clustering process.
   */
  options?: Partial<MapClusteringOptions>;

  /**
   * A flag to control the automatic re-clustering of points. When set to true, the clustering process
   * does not automatically re-run when the points data changes.
   */
  disableRefresh?: boolean;
}

/**
 * Custom React hook for clustering points on a map.
 *
 * @template P - A generic type that extends `PointExtendProps`, representing the properties of a point.
 *
 * @param {UseMapClustering<P>} params - Parameters for the map clustering, conforming to the `UseMapClustering` interface.
 * @returns {{ clusters: PointOrCluster<P>[]; mapClusteringInstance: MapClustering<P> | undefined }} An object containing the clustered points and an optional instance of the map clustering implementation.
 *
 * @example
 * ```
 * const { clusters, mapClusteringInstance } = useMapClustering({
 *   points,
 *   viewport,
 *   zoom,
 *   options,
 *   disableRefresh
 * });
 * ```
 */
export const useMapClustering = <P extends PointExtendProps>({
  points,
  viewport,
  options = {},
  disableRefresh,
}: UseMapClustering<P>): {
  pointsNClusters: PointOrCluster<P>[];
  mapClusteringInstance: MapClustering<P> | undefined;
} => {
  const mapClusteringRef = useRef<MapClustering<P>>();
  const pointsRef = useRef<Point<P>[]>();
  const [pointsNClusters, setPointsNClusters] = useState<PointOrCluster<P>[]>([]);
  const zoomInt = Math.round(viewport?.zoom ?? 1);
  const previousOptions = usePrevious(options);

  useDeepCompareEffect(() => {
    if (disableRefresh === true) {
      return;
    }

    if (!mapClusteringRef.current || !dequal(pointsRef.current, points) || !dequal(previousOptions, options)) {
      mapClusteringRef.current = new MapClustering(options);
      mapClusteringRef.current.load(points);
    }

    if (viewport) {
      setPointsNClusters(mapClusteringRef.current.getClusters({ ...viewport, zoom: zoomInt }));
    }

    pointsRef.current = points;
  }, [points, viewport, zoomInt, options, disableRefresh]);

  return { pointsNClusters, mapClusteringInstance: mapClusteringRef.current };
};
