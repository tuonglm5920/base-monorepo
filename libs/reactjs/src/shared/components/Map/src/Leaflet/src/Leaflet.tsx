import classNames from 'classnames';
import * as OriginLeafletModule from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { keys } from 'ramda';
import {
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { renderToString } from 'react-dom/server';
import { Cluster, Coordinate, Point, PointExtendProps, Viewport, isCluster } from 'utilities';
import {
  createGlobalState,
  useDeepCompareEffect,
  useGlobalState,
  useMapClustering,
  useMount,
} from '../../../../../hooks';
import { AsyncComponent } from '../../../../AsyncComponent';
import { View } from '../../../../View';
import { Clustering } from '../../@types/Clustering';
import { Planning } from '../../@types/Planning';
import { TrackingMovement } from '../../@types/Tracking';
import './styles.css';
import { getViewportOfMap } from './utils/getViewportOfMap';

export interface Props<P extends PointExtendProps> {
  /** Width of the map component, using CSS property values. */
  width?: CSSProperties['width'];

  /** Height of the map component, using CSS property values. */
  height?: CSSProperties['height'];

  /** Default center position for the map. */
  defaultCenter: Coordinate;

  /** Optional default zoom level for the map. */
  defaultZoom?: number;

  /** Optional callback function that is called when the Leaflet API is loaded. */
  onLeafletApiLoaded?: () => void;

  /** Optional configuration for clustering behavior on the map. */
  clustering?: Clustering<P>;

  /** Optional array of tracking movements to be displayed on the map. */
  trackingMovements?: TrackingMovement[];

  /** Optional array of planning objects to be used in the map. */
  plannings?: Planning[];

  /** Optional configuration for the Leaflet API, such as API key. */
  leafletApiConfig?: {
    title: string;
  };

  /** Renders content while Leaflet API is loading. */
  renderLoading?: ReactNode | (() => ReactNode);

  /** Renders content in case of failure to load the Leaflet module. */
  renderFailure?: ReactNode | (() => ReactNode);
}

export interface Actions {
  /** Pans the map to a specified center coordinate. */
  panTo?: (center: Coordinate) => void;
  /** Sets the zoom level of the map. */
  zoom?: (zoom: number) => void;
}

const LeafletModuleGlobalState = createGlobalState<{
  statusImportLeafletModule: 'idle' | 'loading' | 'success' | 'failure';
  module: typeof OriginLeafletModule | undefined;
}>({
  statusImportLeafletModule: 'idle',
  module: undefined,
});

/**
 * Renders a Leaflet with additional features such as clustering and tracking movements.
 *
 * @template P - A generic type that extends PointExtendProps, providing additional flexibility in prop types.
 * @param {Props<P>} props - The properties passed to the Leaflet component.
 * @param {CSSProperties['width']} [props.width] - Width of the map component, using CSS property values. Optional.
 * @param {CSSProperties['height']} [props.height] - Height of the map component, using CSS property values. Optional.
 * @param {Coordinate} props.defaultCenter - Default center position for the map. Required.
 * @param {number} [props.defaultZoom] - Optional default zoom level for the map.
 * @param {() => void} [props.onLeafletApiLoaded] - Optional callback function that is called when the Leaflet API is loaded.
 * @param {Clustering<P>} [props.clustering] - Optional configuration for clustering behavior on the map.
 * @param {TrackingMovement[]} [props.trackingMovements] - Optional array of tracking movements to be displayed on the map.
 * @param {Planning[]} props.plannings - An optional array of planning objects for the map.
 * @param {{ title: string; }} [props.leafletApiConfig] - Optional configuration for the Leaflet API, such as title.
 * @param {ReactNode | (() => ReactNode)} [props.renderLoading] - Renders content while Leaflet API is loading.
 * @param {ReactNode | (() => ReactNode)} [props.renderFailure] - Renders content in case of failure to load the Leaflet module.
 * @param {Ref<Actions>} ref - (Optional) Ref object for the component, enabling imperative handling of map actions.
 *
 * @returns {ReactElement} - The rendered Leaflet component.
 */
const LeafletComponent = <P extends PointExtendProps>(props: Props<P>, ref?: Ref<Actions>): ReactElement => {
  const {
    height = '100vh',
    width = '100vw',
    defaultCenter,
    defaultZoom = 1,
    onLeafletApiLoaded,
    clustering,
    trackingMovements,
    plannings,
    leafletApiConfig = {
      title: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    renderLoading,
    renderFailure,
  } = props;

  const { setState: setLeafletModuleState, state: leafletModuleState } = useGlobalState(LeafletModuleGlobalState);

  /** State to track whether the Leaflet API has been loaded. */
  const [isLeafletApiLoaded, setIsLeafletApiLoaded] = useState(false);

  /** Ref for the map container HTMLDivElement. */
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  /** Ref to store the instance of the Leaflet map. */
  const leafletRef = useRef<OriginLeafletModule.Map | null>(null);

  //#region Clustering
  /**
   * This is a Record type mapping string identifiers to optional cleanup functions.
   * Each cleanup function is intended to invoke the .remove() method on a Marker instance.
   */
  type CleanupPointsNClusters = Record<string, undefined | (() => void)>;

  /** State for managing the current viewport */
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);

  /**
   * Use the custom hook useMapClustering to manage clustering on the map.
   * It calculates clusters and individual points based on the given points and current viewport.
   */
  const { pointsNClusters, mapClusteringInstance } = useMapClustering({
    points: clustering?.points ?? [],
    viewport,
  });

  /**
   * Handles changes in the map's viewport such as zoom level and bounds.
   * Updates the viewport state and triggers any external viewport change handlers.
   */
  useEffect(() => {
    if (leafletRef.current) {
      const initViewport = getViewportOfMap(leafletRef.current);
      setViewport(initViewport);
      clustering?.onViewportChange?.(initViewport);

      leafletRef.current.on('moveend', () => {
        if (leafletRef.current) {
          const newViewport = getViewportOfMap(leafletRef.current);
          setViewport(newViewport);
          clustering?.onViewportChange?.(newViewport);
        }
      });

      leafletRef.current.on('zoomend', () => {
        if (leafletRef.current) {
          const newViewport = getViewportOfMap(leafletRef.current);
          setViewport(newViewport);
          clustering?.onViewportChange?.(newViewport);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeafletApiLoaded]);

  /**
   * Returns a click event handler for a cluster.
   * On click, it zooms into the cluster and pans the map to the cluster's position.
   */
  const handleClickCluster =
    (cluster: Cluster<P>): ((event: MouseEvent) => void) =>
    (event: MouseEvent): void => {
      const { properties, geometry } = cluster;
      if (mapClusteringInstance && leafletRef.current && geometry?.coordinate) {
        const expansionZoom = mapClusteringInstance?.getClusterExpansionZoom(properties.clusterId);
        clustering?.cluster.onClick?.({ cluster, event });
        leafletRef.current?.setZoom(expansionZoom);
        leafletRef.current?.panTo({
          lat: geometry?.coordinate?.lat,
          lng: geometry?.coordinate?.lng,
        });
      }
    };

  /**
   * Renders a cluster on the map.
   * Each cluster is represented by a Marker component with custom rendering and click behavior.
   */
  const renderCluster = (cluster: Cluster<P>): CleanupPointsNClusters => {
    const cleanupPointsNClusters: CleanupPointsNClusters = {};
    const onClick = !clustering?.disableExpansionZoomOnClickCluster
      ? handleClickCluster(cluster)
      : (event: MouseEvent): void => clustering?.cluster.onClick?.({ cluster, event });
    if (cluster.geometry?.coordinate) {
      const { lat, lng } = cluster.geometry.coordinate;
      const { clusterId } = cluster.properties;
      if (leafletModuleState.module && leafletRef.current) {
        const marerkEl = leafletModuleState.module
          .marker(
            { lat, lng },
            {
              icon: leafletModuleState.module.divIcon({
                className: classNames('Leaflet__divIcon'),
                html: renderToString(
                  <View
                    className={classNames('Leaflet__clickable', 'Leaflet__standardizationMarker')}
                    aria-hidden="true"
                  >
                    {clustering?.cluster.render(cluster)}
                  </View>,
                ),
              }),
            },
          )
          .addTo(leafletRef.current)
          .on('click', ({ originalEvent }) => onClick(originalEvent));

        cleanupPointsNClusters[clusterId] = (): void => {
          marerkEl.remove();
        };
      }
    }
    return cleanupPointsNClusters;
  };

  /**
   * Renders an individual point on the map.
   * Similar to renderCluster, but for individual points with their specific rendering and click behavior.
   */
  const renderPoint = (point: Point<P>): CleanupPointsNClusters => {
    const cleanupPointsNClusters: CleanupPointsNClusters = {};
    const onClick = (event: MouseEvent): void => clustering?.point.onClick?.({ event, point });
    if (point.geometry?.coordinate) {
      const { lat, lng } = point.geometry.coordinate;
      const { uid } = point.properties;
      if (leafletModuleState.module && leafletRef.current) {
        const markerEl = leafletModuleState.module
          .marker(
            { lat, lng },
            {
              icon: leafletModuleState.module.divIcon({
                className: classNames('Leaflet__divIcon'),
                html: renderToString(
                  <View
                    className={classNames('Leaflet__clickable', 'Leaflet__standardizationMarker')}
                    aria-hidden="true"
                  >
                    {clustering?.point.render(point)}
                  </View>,
                ),
              }),
            },
          )
          .addTo(leafletRef.current)
          .on('click', ({ originalEvent }) => onClick(originalEvent));
        cleanupPointsNClusters[uid] = (): void => {
          markerEl.remove();
        };
      }
    }
    return cleanupPointsNClusters;
  };

  /**
   * Maps over the pointsNClusters array to render either a cluster or a point.
   * This function decides if a map element is a cluster or a point and calls the respective render function.
   */
  const renderPointsNCluster = (): CleanupPointsNClusters => {
    let cleanupPointsNClusters: CleanupPointsNClusters = {};
    pointsNClusters.forEach(pointOrCluster => {
      cleanupPointsNClusters = {
        ...cleanupPointsNClusters,
        ...(isCluster(pointOrCluster) ? renderCluster(pointOrCluster) : renderPoint(pointOrCluster)),
      };
    });
    return cleanupPointsNClusters;
  };

  /**
   * Maps over the pointsNClusters array to render either a cluster or a point.
   * FIXME: Optimize performance
   */
  useDeepCompareEffect(() => {
    const cleanup = renderPointsNCluster();
    return () => {
      if (isLeafletApiLoaded) {
        keys(cleanup).forEach(item => cleanup[item]?.());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsNClusters]);
  //#endregion

  //#region Tracking
  /**
   * This is a Record type mapping string identifiers to optional cleanup functions.
   * Each cleanup function is intended to invoke the .remove() method on stop points of movements instance.
   */
  type CleanupStopPointsOfMovements = Record<string, undefined | (() => void)>;

  /**
   * This is a Record type mapping string identifiers to optional cleanup functions.
   * Each cleanup function is intended to invoke the .remove() method on paths of movements instance.
   */
  type CleanupPathsMovements = Record<string, undefined | (() => void)>;

  /**
   * Renders a single stop point as part of a tracking movement.
   * Each stop point is represented by a Marker component and can have custom rendering.
   */
  const renderStopPointsOfMovements = ({ stopPoints, renderPoint }: TrackingMovement): CleanupStopPointsOfMovements => {
    const cleanupStopPoints: CleanupStopPointsOfMovements = {};
    stopPoints.forEach(stopPoint => {
      const { lat, lng, uid } = stopPoint;
      if (leafletModuleState.module && leafletRef.current) {
        const markerEl = leafletModuleState.module
          .marker(
            { lat, lng },
            {
              icon: leafletModuleState.module.divIcon({
                className: classNames('Leaflet__divIcon'),
                html: renderToString(
                  <View className={classNames('Leaflet__standardizationMarker')}>{renderPoint(stopPoint)}</View>,
                ),
              }),
            },
          )
          .addTo(leafletRef.current);
        cleanupStopPoints[uid] = (): void => {
          markerEl.remove();
        };
      }
    });
    return cleanupStopPoints;
  };

  /**
   * Renders the path for tracking movements as a polyline on the map.
   * It takes the path details and creates a polyline using the Mapbox GL API.
   * The polyline is then added to the map.
   */
  const renderPathOfMovement = ({
    points,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    uid,
  }: TrackingMovement): CleanupPathsMovements => {
    const cleanupPaths: CleanupPathsMovements = {};
    if (leafletModuleState.module && leafletRef.current) {
      const LeafletModule = leafletModuleState.module;
      const pathEl = new LeafletModule.Polyline(
        points.map(({ lat, lng }) => new LeafletModule.LatLng(lat, lng)),
        {
          color: strokeColor,
          weight: strokeWeight,
          opacity: strokeOpacity,
        },
      ).addTo(leafletRef.current);
      cleanupPaths[uid] = (): void => {
        pathEl.remove();
      };
    }
    return cleanupPaths;
  };

  /**
   * Maps over all tracking movements and renders their stop points.
   * This function aggregates all the stop points from each tracking movement and renders them on the map.
   * FIXME: Optimize performance
   */
  useEffect(() => {
    let cleanupStopPoints: CleanupStopPointsOfMovements;
    let cleanupPaths: CleanupPathsMovements;
    if (isLeafletApiLoaded) {
      trackingMovements?.forEach(movement => {
        cleanupPaths = {
          ...cleanupPaths,
          ...renderPathOfMovement(movement),
        };
        cleanupStopPoints = {
          ...cleanupStopPoints,
          ...renderStopPointsOfMovements(movement),
        };
      });
    }
    return () => {
      if (isLeafletApiLoaded) {
        keys(cleanupStopPoints).forEach(item => cleanupStopPoints[item]?.());
        keys(cleanupPaths).forEach(item => cleanupPaths[item]?.());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeafletApiLoaded, trackingMovements]);
  //#endregion

  //#region Planning
  /**
   * Type definition for CleanupPlannings.
   * Represents a record where each key is a string corresponding to the unique identifier
   * of a planning polygon, and the value is either `undefined` or a function.
   * This function, when called, will perform cleanup operations, typically removing the
   * associated polygon from the map. This type is used to manage the cleanup of
   * multiple planning polygons efficiently.
   */
  type CleanupPlannings = Record<string, undefined | (() => void)>;

  /** Function to render a polygon of planning on the map. */
  const renderPlanning = ({
    fillColor,
    fillOpacity,
    points,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    uid,
  }: Planning): CleanupPlannings => {
    const cleanupPolygons: CleanupPlannings = {};
    if (leafletModuleState.module && leafletRef.current) {
      const polygon = new leafletModuleState.module.Polygon(points, {
        fillColor,
        fillOpacity,
        color: strokeColor,
        weight: strokeWeight,
        opacity: strokeOpacity,
      });
      polygon.addTo(leafletRef.current);
      cleanupPolygons[uid] = (): void => {
        polygon.remove();
      };
    }
    return cleanupPolygons;
  };

  /**
   * Manages the rendering and cleanup of planning polygons on the map.
   */
  useEffect(() => {
    let cleanupPlannings: CleanupPlannings;
    if (isLeafletApiLoaded) {
      plannings?.forEach(planning => {
        cleanupPlannings = {
          ...cleanupPlannings,
          ...renderPlanning(planning),
        };
      });
    }
    return () => {
      if (isLeafletApiLoaded) {
        keys(cleanupPlannings).forEach(item => cleanupPlannings[item]?.());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannings, isLeafletApiLoaded]);
  //#endregion

  //#region Leaflet
  /** Handles the successful import of the Leaflet module. */
  const handleImportLeafletModuleSuccess = (module: typeof OriginLeafletModule): void => {
    setLeafletModuleState({
      statusImportLeafletModule: 'success',
      module,
    });
  };

  /** Handles the failure during the import of the Leaflet module. */
  const handleImportLeafletModuleFailure = (): void => {
    setLeafletModuleState(state => ({
      ...state,
      statusImportLeafletModule: 'failure',
    }));
  };

  /** Initiates the import process for the Leaflet module. */
  const handleImportLeafletModule = (): void => {
    if (
      leafletModuleState.statusImportLeafletModule !== 'loading' &&
      leafletModuleState.statusImportLeafletModule !== 'success'
    ) {
      import('leaflet')
        .then(response => handleImportLeafletModuleSuccess(response.default))
        .catch(handleImportLeafletModuleFailure);
    }
  };

  /** Initialize module leaflet */
  useMount(handleImportLeafletModule);

  /** Initialize map when module leaflet loaded */
  useEffect(() => {
    if (leafletModuleState.module && mapContainerRef.current && !('_leaflet_id' in mapContainerRef.current)) {
      leafletRef.current = leafletModuleState.module.map(mapContainerRef.current);
      leafletModuleState.module.tileLayer(leafletApiConfig.title).addTo(leafletRef.current);
      leafletRef.current?.setView({ lat: defaultCenter.lat, lng: defaultCenter.lng }, defaultZoom);
      setIsLeafletApiLoaded(true);
      onLeafletApiLoaded?.();
    }

    return () => {
      leafletRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletModuleState.module]);

  /**
   * Creates imperative handles for the GoogleMap component. This allows parent components to
   * control the map's center and zoom level directly.
   */
  useImperativeHandle(
    ref,
    () => {
      return {
        panTo: (center): void => {
          leafletRef.current?.panTo(center);
          return;
        },
        zoom: (zoom): void => {
          leafletRef.current?.setZoom(zoom);
          return;
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  //#endregion

  return (
    <View disableStrict ref={mapContainerRef} style={{ width, height }}>
      <AsyncComponent
        isLoading={leafletModuleState.statusImportLeafletModule === 'loading'}
        isFailure={leafletModuleState.statusImportLeafletModule === 'failure'}
        Loading={renderLoading}
        Failure={renderFailure}
        Success={<View hidden />}
      />
    </View>
  );
};

export const Leaflet = forwardRef(LeafletComponent) as <P extends PointExtendProps>(
  props: Props<P> & { ref?: Ref<Actions> },
) => ReactElement | null;
