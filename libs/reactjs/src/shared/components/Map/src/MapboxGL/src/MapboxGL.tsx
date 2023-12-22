import classNames from 'classnames';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { keys } from 'ramda';
import {
  CSSProperties,
  MouseEventHandler,
  MutableRefObject,
  ReactElement,
  Ref,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { Cluster, Coordinate, Point, PointExtendProps, Viewport, isCluster } from 'utilities';
import { useDeepCompareEffect, useMapClustering, useMount } from '../../../../../hooks';
import { View } from '../../../../View';
import { Clustering } from '../../@types/Clustering';
import { Planning } from '../../@types/Planning';
import { TrackingMovement } from '../../@types/Tracking';
import './styles.css';
import { getLayerIdsOfPlanning } from './utils/getLayerIdsOfPlanning';
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

  /** Optional callback function that is called when the Mapbox GL API is loaded. */
  onMapboxGLApiLoaded?: () => void;

  /** Optional configuration for clustering behavior on the map. */
  clustering?: Clustering<P>;

  /** Optional array of tracking movements to be displayed on the map. */
  trackingMovements?: TrackingMovement[];

  /** Optional array of planning objects to be used in the map. */
  plannings?: Planning[];

  /** Optional configuration for the Mapbox GL API, such as API key. */
  mapboxGLApiConfig?: {
    accessToken: string;
    style: string;
  };
}

export interface Actions {
  /** Pans the map to a specified center coordinate. */
  panTo?: (center: Coordinate) => void;
  /** Sets the zoom level of the map. */
  zoom?: (zoom: number) => void;
}

/**
 * Renders a Mapbox GL with additional features such as clustering and tracking movements.
 *
 * @template P - PointExtendProps, a generic type parameter that extends PointExtendProps.
 * @param {Props<P>} props - The properties passed to the component.
 * @param {CSSProperties['width']} [props.width] - Width of the map component, using CSS property values. Optional.
 * @param {CSSProperties['height']} [props.height] - Height of the map component, using CSS property values. Optional.
 * @param {Coordinate} props.defaultCenter - Default center position for the map. Required.
 * @param {number} [props.defaultZoom] - Optional default zoom level for the map.
 * @param {() => void} [props.onMapboxGLApiLoaded] - Optional callback function that is called when the Mapbox GL API is loaded.
 * @param {Clustering<P>} [props.clustering] - Optional configuration for clustering behavior on the map.
 * @param {TrackingMovement[]} [props.trackingMovements] - Optional array of tracking movements to be displayed on the map.
 * @param {Planning[]} props.plannings - An optional array of planning objects for the map.
 * @param {{ accessToken: string; style: string; }} [props.mapboxGLApiConfig] - Optional configuration for the Mapbox GL API, such as API key.
 * @param {Ref<Actions>} ref - (Optional) Ref object for the component, enabling imperative handling of map actions.
 *
 * @returns {ReactElement} - The rendered MapboxGL component.
 */
const MapboxGLComponent = <P extends PointExtendProps>(props: Props<P>, ref?: Ref<Actions>): ReactElement => {
  const {
    height = '100vh',
    width = '100vw',
    defaultCenter,
    defaultZoom = 1,
    onMapboxGLApiLoaded,
    clustering,
    trackingMovements,
    plannings,
    mapboxGLApiConfig = {
      accessToken: 'pk.eyJ1IjoiYWxlcGhyaSIsImEiOiJjamdwbHpycjIyZm45Mndud3AzamRibHpqIn0.ejAHwSGT6dcGxiDOrPCFLg',
      style: 'mapbox://styles/mapbox/streets-v9',
    },
  } = props;

  /** Tracks if the Mapbox GL API has been loaded */
  const [isMapboxGLApiLoaded, setIsMapboxGLApiLoaded] = useState(false);

  /**
   * Reference to the div element that will serve as the container for the map.
   * This allows direct access to the DOM element in a React component.
   */
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Reference to the Mapbox GL map instance.
   * This is used to interact with the Mapbox map directly, for tasks like adding markers, changing the view, etc.
   */
  const mapboxGLRef = useRef<mapboxgl.Map | null>(null);

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
    if (mapboxGLRef.current) {
      const initViewport = getViewportOfMap(mapboxGLRef.current);
      setViewport(initViewport);
      clustering?.onViewportChange?.(initViewport);

      mapboxGLRef.current.on('moveend', () => {
        if (mapboxGLRef.current) {
          const newViewport = getViewportOfMap(mapboxGLRef.current);
          setViewport(newViewport);
          clustering?.onViewportChange?.(newViewport);
        }
      });
      mapboxGLRef.current.on('zoomend', () => {
        if (mapboxGLRef.current) {
          const newViewport = getViewportOfMap(mapboxGLRef.current);
          setViewport(newViewport);
          clustering?.onViewportChange?.(newViewport);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapboxGLApiLoaded]);

  /**
   * Returns a click event handler for a cluster.
   * On click, it zooms into the cluster and pans the map to the cluster's position.
   */
  const handleClickCluster =
    (cluster: Cluster<P>): MouseEventHandler<HTMLDivElement> =>
    event => {
      const { properties, geometry } = cluster;
      if (mapClusteringInstance && mapboxGLRef.current && geometry?.coordinate) {
        const expansionZoom = mapClusteringInstance?.getClusterExpansionZoom(properties.clusterId);
        clustering?.cluster.onClick?.({ cluster, event: event.nativeEvent });
        mapboxGLRef.current?.setZoom(expansionZoom);
        mapboxGLRef.current?.panTo({ lat: geometry?.coordinate?.lat, lng: geometry?.coordinate?.lng });
      }
    };

  /**
   * Renders a cluster on the map.
   * Each cluster is represented by a Marker component with custom rendering and click behavior.
   */
  const renderCluster = (cluster: Cluster<P>): CleanupPointsNClusters => {
    const cleanupPointsNClusters: CleanupPointsNClusters = {};
    const onClick: MouseEventHandler<HTMLDivElement> = !clustering?.disableExpansionZoomOnClickCluster
      ? handleClickCluster(cluster)
      : (event): void => clustering?.cluster.onClick?.({ cluster, event: event.nativeEvent });
    if (cluster.geometry?.coordinate) {
      const { lat, lng } = cluster.geometry.coordinate;
      const { clusterId } = cluster.properties;
      if (mapboxGLRef.current) {
        const ref = createRef<HTMLDivElement | null>() as MutableRefObject<HTMLDivElement>;
        ref.current = document.createElement('div');
        createRoot(ref.current).render(
          <View
            className={classNames('MapboxGL__standardizationMarker', 'MapboxGL__clickable')}
            style={{
              cursor: 'pointer',
            }}
            onClick={onClick}
            aria-hidden="true"
          >
            {clustering?.cluster.render(cluster)}
          </View>,
        );
        const marker = new mapboxgl.Marker({ element: ref.current }).setLngLat({ lat, lng }).addTo(mapboxGLRef.current);
        cleanupPointsNClusters[clusterId] = (): void => {
          marker.remove();
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
    const onClick: MouseEventHandler<HTMLDivElement> = (event): void => {
      clustering?.point.onClick?.({ event: event.nativeEvent, point });
    };
    if (point.geometry?.coordinate) {
      const { lat, lng } = point.geometry.coordinate;
      const { uid } = point.properties;
      if (mapboxGLRef.current) {
        const ref = createRef<HTMLDivElement | null>() as MutableRefObject<HTMLDivElement>;
        ref.current = document.createElement('div');
        createRoot(ref.current).render(
          <View
            className={classNames('MapboxGL__standardizationMarker', 'MapboxGL__clickable')}
            onClick={onClick}
            aria-hidden="true"
          >
            {clustering?.point.render(point)}
          </View>,
        );
        const marker = new mapboxgl.Marker(ref.current).setLngLat({ lat, lng }).addTo(mapboxGLRef.current);
        cleanupPointsNClusters[uid] = (): void => {
          marker.remove();
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
      if (isMapboxGLApiLoaded) {
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
   * Renders the path for tracking movements as a polyline on the map.
   * It takes the path details and creates a polyline using the Mapbox GL API.
   * The polyline is then added to the map.
   */
  const renderPathMovement = ({ points, strokeColor, strokeOpacity, strokeWeight, uid }: TrackingMovement): void => {
    mapboxGLRef.current?.addSource(uid, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: points.map(item => [item.lng, item.lat]),
            },
          },
        ],
      },
    });
    mapboxGLRef.current?.addLayer({
      id: uid,
      type: 'line',
      source: uid,
      paint: {
        'line-width': strokeWeight,
        'line-opacity': strokeOpacity,
        'line-color': strokeColor,
      },
    });
  };

  /**
   * Renders a single stop point as part of a tracking movement.
   * Each stop point is represented by a Marker component and can have custom rendering.
   */
  const renderStopPointsOfMovements = ({ stopPoints, renderPoint }: TrackingMovement): CleanupStopPointsOfMovements => {
    const cleanupStopPoints: CleanupStopPointsOfMovements = {};
    stopPoints.forEach(stopPoint => {
      const { lat, lng, uid } = stopPoint;
      if (mapboxGLRef.current) {
        const ref = createRef<HTMLDivElement | null>() as MutableRefObject<HTMLDivElement>;
        ref.current = document.createElement('div');
        createRoot(ref.current).render(
          <View className={classNames('MapboxGL__standardizationMarker')}>{renderPoint(stopPoint)}</View>,
        );
        const marker = new mapboxgl.Marker(ref.current).setLngLat({ lat, lng }).addTo(mapboxGLRef.current);
        cleanupStopPoints[uid] = (): void => {
          marker.remove();
        };
      }
    });
    return cleanupStopPoints;
  };

  /**
   * Maps over all tracking movements and renders their stop points.
   * This function aggregates all the stop points from each tracking movement and renders them on the map.
   * FIXME: Optimize performance
   */
  useEffect(() => {
    let cleanupStopPoints: CleanupStopPointsOfMovements;
    if (isMapboxGLApiLoaded) {
      trackingMovements?.forEach(movement => {
        renderPathMovement(movement);
        cleanupStopPoints = renderStopPointsOfMovements(movement);
      });
    }
    return () => {
      if (isMapboxGLApiLoaded) {
        trackingMovements?.forEach(movement => {
          mapboxGLRef.current?.removeLayer(movement.uid);
        });
        keys(cleanupStopPoints).forEach(item => cleanupStopPoints[item]?.());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapboxGLApiLoaded, trackingMovements]);
  //#endregion

  //#region Planning
  /** Function to render a polygon of planning on the map. */
  const renderPlanning = (planning: Planning): void => {
    const { points, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity, uid } = planning;
    if (mapboxGLRef.current) {
      mapboxGLRef.current?.addSource(uid, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [points.map(item => [item.lng, item.lat])],
              },
            },
          ],
        },
      });
      const { inner, outter } = getLayerIdsOfPlanning(planning);
      mapboxGLRef.current?.addLayer({
        id: inner,
        type: 'fill',
        source: uid, // reference the data source
        layout: {},
        paint: {
          'fill-color': fillColor, // blue color fill
          'fill-opacity': fillOpacity,
        },
      });
      mapboxGLRef.current?.addLayer({
        id: outter,
        type: 'line',
        source: uid,
        layout: {},
        paint: {
          'line-width': strokeWeight,
          'line-opacity': strokeOpacity,
          'line-color': strokeColor,
        },
      });
    }
  };

  /** Manages the rendering and cleanup of planning polygons on the map. */
  useEffect(() => {
    if (isMapboxGLApiLoaded) {
      plannings?.forEach(renderPlanning);
    }
    return () => {
      plannings?.forEach(planning => {
        const { inner, outter } = getLayerIdsOfPlanning(planning);
        mapboxGLRef.current?.removeLayer(inner);
        mapboxGLRef.current?.removeLayer(outter);
      });
    };
  }, [isMapboxGLApiLoaded, plannings]);
  //#endregion

  //#region MapboxGL
  /** Initialize map when component mounts */
  useMount(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = mapboxGLApiConfig.accessToken;
      mapboxGLRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapboxGLApiConfig.style,
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom: defaultZoom,
      });

      /** Add navigation control (the +/- zoom buttons) */
      mapboxGLRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      mapboxGLRef.current.on('load', () => {
        if (mapboxGLRef.current) {
          setIsMapboxGLApiLoaded(mapboxGLRef.current.loaded());
          onMapboxGLApiLoaded?.();
        }
      });
    }

    return () => mapboxGLRef.current?.remove();
  });

  /**
   * Creates imperative handles for the GoogleMap component. This allows parent components to
   * control the map's center and zoom level directly.
   */
  useImperativeHandle(ref, () => {
    return {
      panTo: (center): void => {
        mapboxGLRef.current?.panTo(center);
        return;
      },
      zoom: (zoom): void => {
        mapboxGLRef.current?.setZoom(zoom);
        return;
      },
    };
  });
  //#endregion

  return <View ref={mapContainerRef} style={{ width, height }} />;
};

export const MapboxGL = forwardRef(MapboxGLComponent) as <P extends PointExtendProps>(
  props: Props<P> & { ref?: Ref<Actions> },
) => ReactElement | null;
