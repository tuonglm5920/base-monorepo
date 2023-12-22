import { clone } from 'ramda';
import {
  OFFSET_ID,
  OFFSET_NUM_POINTS,
  OFFSET_PARENT_CLUSTER_ID,
  OFFSET_PROP,
  OFFSET_X,
  OFFSET_Y,
  OFFSET_ZOOM,
  STRIDE,
} from './constants';
import { Point, PointExtendProps } from './types/Point';
import { PointOrCluster } from './types/PointOrCluster';
import { Viewport } from './types/Viewport';
import { fround } from './utils/fround';
import { getClusterJSON } from './utils/getClusterJSON';
import { isCluster } from './utils/isCluster';
import { KDBush } from './utils/kdbush/src/kdbush';
import { latY } from './utils/latY';
import { lngX } from './utils/lngX';

export interface Options {
  /** Minimum zoom level at which clusters are generated. */
  minZoom: number;
  /** Maximum zoom level at which clusters are generated. */
  maxZoom: number;
  /** Minimum number of points to form a cluster. */
  minPoints: number;
  /** Cluster radius, in pixels. */
  radius: number;
  /** (Tiles) Tile extent. Radius is calculated relative to this value. */
  extent: number;
  /** Size of the KD-tree leaf node. Affects performance. */
  nodeSize: number;
  /** Whether timing info should be logged. */
  debug: boolean;
}

export class MapClustering<P extends PointExtendProps> {
  /** Options used to configure the behavior. */
  private _options: Options;
  /** An array of KDBush instances, each representing a tree used for spatial indexing of points. */
  private _trees: KDBush[];
  /** An array of points, where each point represents a location and optional properties. */
  private _points: Point<P>[];

  /**
   * The points of clusters.
   * This is an array of clusters, where each cluster is represented by an object holding an array of points.
   */
  private _pointsOfClusters: Array<{ points: Point<P>[] }>;

  constructor(options: Partial<Options>) {
    this._options = {
      ...options,
      minZoom: options.minZoom ?? 0,
      maxZoom: options.maxZoom ?? 16,
      minPoints: options.minPoints ?? 2,
      radius: options.radius ?? 40,
      extent: options.extent ?? 512,
      nodeSize: options.nodeSize ?? 64,
      debug: options.debug ?? false,
    };
    this._trees = new Array(this._options.maxZoom + 1);
    this._points = [];
    this._pointsOfClusters = [];
  }

  /**
   * A private method that limits the zoom level to within the specified range.
   * The method ensures that the zoom level is not lower than `minZoom` and not higher than `maxZoom + 1`.
   * It rounds down any fractional zoom levels.
   *
   * @private
   * @param {number} zoomLevel - The zoom level to be limited.
   * @return {number} The limited zoom level, constrained within the allowed range.
   */
  private _limitZoom = (zoomLevel: number): number => {
    return Math.max(this._options.minZoom, Math.min(Math.floor(+zoomLevel), this._options.maxZoom + 1));
  };

  /**
   * Creates a KDBush instance for spatial indexing of points. This private method
   * is used internally to organize the points into a spatial index, allowing for
   * efficient queries and clustering operations.
   *
   * @private
   * @param {number[]} data - An array of numeric data representing the points to be indexed.
   * @return {KDBush} A new instance of KDBush, which is a very fast static spatial index
   *                  for 2D points based on a flat KD-tree.
   */
  private _createTree = (data: number[]): KDBush => {
    const tree = new KDBush((data.length / STRIDE) | 0, this._options.nodeSize);
    for (let i = 0; i < data.length; i += STRIDE) {
      tree.add(data[i + OFFSET_X], data[i + OFFSET_Y]);
    }
    tree.finish();
    tree.data = data;
    return tree;
  };

  /**
   * Retrieves a specific cluster from the points of clusters based on the provided criteria.
   *
   * @param {number[]} data - An array of numbers used to determine which cluster to retrieve.
   *                          This could be based on some criteria relevant to the cluster's data.
   * @param {number} i - The index which, in combination with the data, helps determine the cluster to retrieve.
   *
   * @returns {typeof this._pointsOfClusters[number]} - Returns a cluster object from the pointsOfClusters array.
   *                                                   The cluster object contains an array of points (`Point<P>[]`).
   *                                                   The method's return type is dynamically determined by the type of points in the `pointsOfClusters` array.
   */
  private _getPointsOfCluster = (
    data: number[],
    i: number,
    shouldClone = false,
  ): (typeof this._pointsOfClusters)[number] => {
    // If is cluster ==> return props of cluster
    if (data[i + OFFSET_NUM_POINTS] > 1) {
      const props = this._pointsOfClusters[data[i + OFFSET_PROP]];
      return shouldClone ? clone(props) : props;
    }
    // If is point ==> Append itself to a group
    const result = {
      points: [this._points[data[i + OFFSET_ID]]],
    };
    return shouldClone ? clone(result) : result;
  };

  /**
   * Performs clustering on the points at a given zoom level using a KDBush spatial index.
   * This private method is used internally to cluster points based on their spatial
   * proximity and the specified zoom level. The method returns an array of indices
   * or identifiers for the clusters formed.
   *
   * @private
   * @param {KDBush} tree - A KDBush instance representing the spatial index of points.
   * @param {number} zoom - The zoom level at which clustering is performed.
   * @return {number[]} An array of indices or identifiers for the clusters. These indices
   *                    correspond to the clusters formed at the given zoom level.
   */
  private _cluster = (tree: KDBush, zoom: number): number[] => {
    const { radius, extent, minPoints } = this._options;
    const r = radius / (extent * Math.pow(2, zoom));
    const data = tree.data;
    const nextData: typeof data = [];

    // loop through each point
    for (let i = 0; i < data.length; i += STRIDE) {
      // if we've already visited the point at this zoom level, skip it
      if (data[i + OFFSET_ZOOM] <= zoom) {
        continue;
      }
      data[i + OFFSET_ZOOM] = zoom;

      // find all nearby points
      const x = data[i + OFFSET_X];
      const y = data[i + OFFSET_Y];
      const neighborIds = tree.within(data[i + OFFSET_X], data[i + OFFSET_Y], r);

      const numPointsOrigin = data[i + OFFSET_NUM_POINTS];
      let numPoints = numPointsOrigin;

      // count the number of points in a potential cluster
      for (const neighborId of neighborIds) {
        const k = neighborId * STRIDE;
        // filter out neighbors that are already processed
        if (data[k + OFFSET_ZOOM] > zoom) {
          numPoints += data[k + OFFSET_NUM_POINTS];
        }
      }

      // if there were neighbors to merge, and there are enough points to form a cluster
      if (numPoints > numPointsOrigin && numPoints >= minPoints) {
        let wx = x * numPointsOrigin;
        let wy = y * numPointsOrigin;

        let pointsOfClusterOrigin: (typeof this._pointsOfClusters)[number] | undefined;
        let clusterIndexInPointsOfClustersObject = -1;

        // encode both zoom and point index on which the cluster originated -- offset by total length of features
        const id = (((i / STRIDE) | 0) << 5) + (zoom + 1) + this._points.length;

        for (const neighborId of neighborIds) {
          const k = neighborId * STRIDE;

          if (data[k + OFFSET_ZOOM] <= zoom) {
            continue;
          }
          data[k + OFFSET_ZOOM] = zoom; // save the zoom (so it doesn't get processed twice)

          const numPoints2 = data[k + OFFSET_NUM_POINTS];
          wx += data[k] * numPoints2; // accumulate coordinates for calculating weighted center
          wy += data[k + 1] * numPoints2;

          data[k + OFFSET_PARENT_CLUSTER_ID] = id;

          // Setup points of clusters & fill "offset props to get clusterProps in pointsOfClusters" to point
          if (!pointsOfClusterOrigin) {
            pointsOfClusterOrigin = this._getPointsOfCluster(data, i, true);
            clusterIndexInPointsOfClustersObject = this._pointsOfClusters.length;
            this._pointsOfClusters.push(pointsOfClusterOrigin);
          }
          pointsOfClusterOrigin.points.push(...this._getPointsOfCluster(data, k).points);
        }

        data[i + OFFSET_PARENT_CLUSTER_ID] = id;
        nextData.push(
          wx / numPoints,
          wy / numPoints,
          Infinity,
          id,
          -1,
          numPoints,
          clusterIndexInPointsOfClustersObject,
        );
      } else {
        // left points as unclustered
        for (let j = 0; j < STRIDE; j++) {
          nextData.push(data[i + j]);
        }

        if (numPoints > 1) {
          for (const neighborId of neighborIds) {
            const k = neighborId * STRIDE;
            if (data[k + OFFSET_ZOOM] <= zoom) {
              continue;
            }
            data[k + OFFSET_ZOOM] = zoom;
            for (let j = 0; j < STRIDE; j++) {
              nextData.push(data[k + j]);
            }
          }
        }
      }
    }

    return nextData;
  };

  /**
   * get zoom of the point from which the cluster originated
   * @private
   * @param clusterId The unique identifier of the cluster. This ID is used to find the originating point of the cluster.
   * @return Returns the zoom level as a number, indicating the scale at which the cluster's originating point was determined.
   */
  private _getOriginZoom = (clusterId: number): number => {
    return (clusterId - this._points.length) % 32;
  };

  /**
   * get index of the point from which the cluster originated
   * @private
   * @param clusterId The unique identifier of the cluster. This ID is utilized to locate the originating point of the cluster.
   * @return Returns the index of the originating point as a number. This index corresponds to the position
   *         of the point in the original array of points from which the cluster was formed.
   */
  private _getOriginId = (clusterId: number): number => {
    return (clusterId - this._points.length) >> 5;
  };

  /**
   * Loads an array of points into the MapClustering, initializing the clustering process.
   * This method takes an array of `Point<P>` objects, processes them.
   * After processing, it returns an instance of `MapClustering<P>` representing the clustered data.
   *
   * @param points An array of `Point<P>` objects representing the points to be clustered.
   * @return Returns an instance of `MapClustering<P>`, which contains the processed and clustered points.
   */
  public load = (points: Point<P>[]): MapClustering<P> => {
    const { debug, minZoom, maxZoom } = this._options;

    if (debug) {
      console.time('total time');
    }

    const timerId = `prepare ${points.length} points`;
    if (debug) {
      console.time(timerId);
    }

    this._points = points;

    // generate a cluster object for each point and index input points into a KD-tree
    const data: number[] = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!p.geometry?.coordinate) {
        continue;
      }

      const { lng, lat } = p.geometry.coordinate;
      const x = fround(lngX(lng));
      const y = fround(latY(lat));
      // store internal point/cluster data in flat numeric arrays for performance
      data.push(
        x, // projected point X coordinate
        y, // projected point Y coordinates
        Infinity, // the last zoom the point was processed at
        i, // index of the source feature in the original input array
        -1, // parent cluster id
        1, // number of points in a cluster
        0, // offset props to get clusterProps in pointsOfClusters. Value will be fill when it was clustered
      );
    }
    let tree = (this._trees[maxZoom + 1] = this._createTree(data));

    if (debug) {
      console.timeEnd(timerId);
    }

    // cluster points on max zoom, then cluster the results on previous zoom, etc.;
    // results in a cluster hierarchy across zoom levels
    for (let z = maxZoom; z >= minZoom; z--) {
      const now = +Date.now();

      // create a new set of clusters for the zoom and index them with a KD-tree
      tree = this._trees[z] = this._createTree(this._cluster(tree, z));

      if (debug) {
        console.log('z%d: %d clusters in %dms', z, tree.numItems, +Date.now() - now);
      }
    }

    if (debug) {
      console.timeEnd('total time');
    }

    return this;
  };

  /**
   * Retrieves clusters and points within a specified bounding box at a given zoom level.
   * This method is used to fetch clusters or individual points that fall within the boundaries defined by the `bbox` parameter,
   * considering the specified `zoom` level.
   *
   * @param bbox An array representing the bounding box [minLng, minLat, maxLng, maxLat] within which clusters or points are to be retrieved.
   * @param zoom The zoom level at which the clusters or points are to be calculated.
   * @return Returns an array of `PointOrCluster<P>[]`, where each element can either be a point or a cluster, depending on the zoom level and spatial distribution within the `bbox`.
   */
  public getClusters = (viewport: Viewport): PointOrCluster<P>[] => {
    let minLng = ((((viewport.minLng + 180) % 360) + 360) % 360) - 180;
    const minLat = Math.max(-90, Math.min(90, viewport.minLat));
    let maxLng = viewport.maxLng === 180 ? 180 : ((((viewport.maxLng + 180) % 360) + 360) % 360) - 180;
    const maxLat = Math.max(-90, Math.min(90, viewport.maxLat));

    if (viewport.maxLng - viewport.minLng >= 360) {
      minLng = -180;
      maxLng = 180;
    } else if (minLng > maxLng) {
      const easternHem = this.getClusters({ ...viewport, minLng, minLat, maxLng: 180, maxLat });
      const westernHem = this.getClusters({ ...viewport, minLng: -180, minLat, maxLng, maxLat });
      return easternHem.concat(westernHem);
    }

    const tree = this._trees[this._limitZoom(viewport.zoom)];
    const ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
    const data = tree.data;
    const clusters: PointOrCluster<P>[] = [];
    for (const id of ids) {
      const k = STRIDE * id;
      clusters.push(
        data[k + OFFSET_NUM_POINTS] > 1
          ? getClusterJSON<P>({
              index: k,
              kdBushData: data,
              pointsOfClusters: this._pointsOfClusters,
            })
          : this._points[data[k + OFFSET_ID]],
      );
    }

    return clusters;
  };

  /**
   * Retrieves the child elements (points or smaller clusters) of a specified cluster.
   * This method is used to drill down into a cluster, providing more detailed information about the points or sub-clusters
   * that make up the given cluster identified by `clusterId`.
   *
   * @param clusterId The unique identifier of the cluster whose children are to be retrieved.
   *                  This ID is used to locate the specific cluster within the larger clustering structure.
   * @return Returns an array of `PointOrCluster<P>[]`, where each element represents either a point or a smaller cluster
   *         that is part of the larger cluster identified by the provided `clusterId`.
   */
  public getChildren = (clusterId: number): PointOrCluster<P>[] => {
    const originId = this._getOriginId(clusterId);
    const originZoom = this._getOriginZoom(clusterId);
    const errorMsg = 'No cluster with the specified id.';

    const tree = this._trees[originZoom];
    if (!tree) {
      throw new Error(errorMsg);
    }

    const data = tree.data;
    if (originId * STRIDE >= data.length) {
      throw new Error(errorMsg);
    }

    const r = this._options.radius / (this._options.extent * Math.pow(2, originZoom - 1));
    const x = data[originId * STRIDE];
    const y = data[originId * STRIDE + 1];
    const ids = tree.within(x, y, r);
    const children: PointOrCluster<P>[] = [];
    for (const id of ids) {
      const k = id * STRIDE;
      if (data[k + OFFSET_PARENT_CLUSTER_ID] === clusterId) {
        children.push(
          data[k + OFFSET_NUM_POINTS] > 1
            ? getClusterJSON({
                index: k,
                kdBushData: data,
                pointsOfClusters: this._pointsOfClusters,
              })
            : this._points[data[k + OFFSET_ID]],
        );
      }
    }

    if (children.length === 0) {
      throw new Error(errorMsg);
    }

    return children;
  };

  /**
   * Determines the minimum zoom level at which a given cluster expands.
   * This method calculates the zoom level where the specified cluster, identified by `clusterId`, breaks down into smaller clusters or individual points.
   *
   * @param clusterId The unique identifier of the cluster for which the expansion zoom level is to be determined.
   *                  This ID is utilized to identify and perform calculations on the specific cluster within the clustering structure.
   * @return Returns the zoom level as a number. This level is the minimum zoom at which the cluster starts to expand into its constituent elements.
   */
  public getClusterExpansionZoom = (clusterId: number): number => {
    let expansionZoom = this._getOriginZoom(clusterId) - 1;
    while (expansionZoom <= this._options.maxZoom) {
      const children = this.getChildren(clusterId);
      expansionZoom++;
      if (children.length !== 1) {
        break;
      }
      if (isCluster<P>(children[0])) {
        clusterId = children[0].properties.clusterId;
      }
    }
    return expansionZoom;
  };

  //#region For testing
  public getTreeForTesting = (): typeof this._trees => {
    return this._trees;
  };
  //#endregion
}
