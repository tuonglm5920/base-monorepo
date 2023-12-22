import classNames from 'classnames';
import GoogleMapReact, { Props as GoogleMapReactProps } from 'google-map-react';
import {
  CSSProperties,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Cluster, Coordinate, Point, PointExtendProps, Viewport, isCluster } from 'utilities';
import { useMapClustering } from '../../../../../hooks';
import { View } from '../../../../View';
import { Clustering } from '../../@types/Clustering';
import { Planning } from '../../@types/Planning';
import { TrackingMovement } from '../../@types/Tracking';
import { Marker } from './components/Marker';
import './styles.css';

export interface Props<P extends PointExtendProps> {
  /** Width of the map component, using CSS property values. */
  width?: CSSProperties['width'];

  /** Height of the map component, using CSS property values. */
  height?: CSSProperties['height'];

  /** Optional configuration for the Google Maps API, such as API key. */
  googleApiConfig?: GoogleMapReactProps['bootstrapURLKeys'];

  /** Default center position for the map. */
  defaultCenter: Coordinate;

  /** Optional default zoom level for the map. */
  defaultZoom?: number;

  /** Optional callback function that is called when the Google Maps API is loaded. */
  onGoogleApiLoaded?: () => void;

  /** Optional configuration for clustering behavior on the map. */
  clustering?: Clustering<P>;

  /** Optional array of tracking movements to be displayed on the map. */
  trackingMovements?: TrackingMovement[];

  /** Optional array of planning objects to be used in the map. */
  plannings?: Planning[];
}

export interface Actions {
  /** Pans the map to a specified center coordinate. */
  panTo?: (center: Coordinate) => void;
  /** Sets the zoom level of the map. */
  zoom?: (zoom: number) => void;
}

/**
 * Renders a Google Map with additional features such as clustering and tracking movements.
 *
 * @template P - Type parameter extending PointExtendProps to define the shape of point data.
 *
 * @param {Props<P>} props - The props for the GoogleMap component.
 * @param {CSSProperties['width']} props.width - The width of the map.
 * @param {CSSProperties['height']} props.height - The height of the map.
 * @param {GoogleMapReactProps['bootstrapURLKeys']} props.googleApiConfig - (Optional) Configurations for the Google Maps API.
 * @param {Coordinate} props.defaultCenter - The default center position of the map.
 * @param {number} [props.defaultZoom=1] - (Optional) Default zoom level of the map.
 * @param {Function} props.onGoogleApiLoaded - (Optional) Callback for when the Google API is loaded.
 * @param {Clustering<P>} props.clustering - (Optional) Configurations for clustering behavior.
 * @param {TrackingMovement[]} props.trackingMovements - (Optional) Array of tracking movements to display.
 * @param {Planning[]} props.plannings - An optional array of planning objects for the map.
 * @param {Ref<Actions>} ref - (Optional) Ref object for the component, enabling imperative handling of map actions.
 *
 * @returns {ReactElement} - The rendered Google Map component.
 */
const GoogleMapComponent = <P extends PointExtendProps>(props: Props<P>, ref?: Ref<Actions>): ReactElement => {
  const {
    defaultCenter,
    defaultZoom = 1,
    googleApiConfig,
    onGoogleApiLoaded,
    clustering,
    trackingMovements,
    plannings,
    width = '100vw',
    height = '100vh',
  } = props;

  /** Tracks if the Google Maps API has been loaded */
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);

  /** Ref to the Google map instance */
  const mapRef = useRef<google.maps.Map | null>(null);

  /** Ref to the Google maps object */
  const mapsRef = useRef<typeof google.maps | null>(null);

  //#region Clustering
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
  const handleChangeViewport: GoogleMapReactProps['onChange'] = ({ zoom, bounds }) => {
    const newViewport = {
      maxLat: Math.max(bounds.nw.lat, bounds.ne.lat, bounds.sw.lat, bounds.se.lat),
      maxLng: Math.max(bounds.nw.lng, bounds.ne.lng, bounds.sw.lng, bounds.se.lng),
      minLat: Math.min(bounds.nw.lat, bounds.ne.lat, bounds.sw.lat, bounds.se.lat),
      minLng: Math.max(bounds.nw.lat, bounds.ne.lat, bounds.sw.lat, bounds.se.lat),
      zoom,
    };
    setViewport(newViewport);
    clustering?.onViewportChange?.(newViewport);
  };

  /**
   * Returns a click event handler for a cluster.
   * On click, it zooms into the cluster and pans the map to the cluster's position.
   */
  const handleClickCluster =
    (cluster: Cluster<P>): MouseEventHandler<HTMLDivElement> =>
    (event): void => {
      const { properties, geometry } = cluster;
      if (mapClusteringInstance && mapRef.current && geometry?.coordinate) {
        const expansionZoom = mapClusteringInstance?.getClusterExpansionZoom(properties.clusterId);
        clustering?.cluster.onClick?.({ cluster, event: event.nativeEvent });
        mapRef.current?.setZoom(expansionZoom);
        mapRef.current?.panTo({ lat: geometry?.coordinate?.lat, lng: geometry?.coordinate?.lng });
      }
    };

  /**
   * Renders a cluster on the map.
   * Each cluster is represented by a Marker component with custom rendering and click behavior.
   */
  const renderCluster = (cluster: Cluster<P>): ReactElement => {
    const { properties, geometry } = cluster;
    const onClick: MouseEventHandler<HTMLDivElement> = !clustering?.disableExpansionZoomOnClickCluster
      ? handleClickCluster(cluster)
      : (event): void => clustering?.cluster.onClick?.({ cluster, event: event.nativeEvent });
    return (
      <Marker lat={geometry?.coordinate?.lat} lng={geometry?.coordinate?.lng} key={properties.clusterId}>
        <View className={classNames('GoogleMap__clickable')} onClick={onClick} aria-hidden="true">
          {clustering?.cluster.render(cluster)}
        </View>
      </Marker>
    );
  };

  /**
   * Renders an individual point on the map.
   * Similar to renderCluster, but for individual points with their specific rendering and click behavior.
   */
  const renderPoint = (point: Point<P>): ReactElement => {
    const onClick: MouseEventHandler<HTMLDivElement> = (event): void => {
      clustering?.point.onClick?.({ point, event: event.nativeEvent });
    };
    return (
      <Marker key={point.properties.uid} lat={point.geometry?.coordinate?.lat} lng={point.geometry?.coordinate?.lng}>
        <View className={classNames('GoogleMap__clickable')} onClick={onClick} aria-hidden="true">
          {clustering?.point.render(point)}
        </View>
      </Marker>
    );
  };

  /**
   * Maps over the pointsNClusters array to render either a cluster or a point.
   * This function decides if a map element is a cluster or a point and calls the respective render function.
   */
  const renderPointsNCluster = (): ReactNode => {
    return pointsNClusters.map(pointOrCluster => {
      if (isCluster(pointOrCluster)) {
        return renderCluster(pointOrCluster);
      }
      return renderPoint(pointOrCluster);
    });
  };
  //#endregion

  //#region Tracking
  /**
   * Renders the path for tracking movements as a polyline on the map.
   * It takes the path details and creates a polyline using the Google Maps API.
   * The polyline is then added to the map.
   */
  const renderPathMovement = ({
    path,
    strokeColor,
    strokeOpacity,
    strokeWeight,
  }: Pick<google.maps.PolylineOptions, 'path' | 'strokeColor' | 'strokeOpacity' | 'strokeWeight'>):
    | google.maps.Polyline
    | undefined => {
    if (mapRef.current && mapsRef.current) {
      const polyline = new mapsRef.current.Polyline({
        path,
        strokeColor,
        strokeOpacity,
        strokeWeight,
      });
      polyline.setMap(mapRef.current);
      return polyline;
    }
    return;
  };

  /**
   * Renders a single stop point as part of a tracking movement.
   * Each stop point is represented by a Marker component and can have custom rendering.
   */
  const renderStopPointMovement = (movement: TrackingMovement): ReactNode => {
    return movement.stopPoints?.map(stopPoint => {
      return (
        <Marker key={stopPoint.uid} lat={stopPoint?.lat} lng={stopPoint?.lng}>
          <View>{movement.renderPoint(stopPoint)}</View>
        </Marker>
      );
    });
  };

  /**
   * Maps over all tracking movements and renders their stop points.
   * This function aggregates all the stop points from each tracking movement and renders them on the map.
   */
  const renderStopPointsOfMovements = (): ReactNode => {
    return trackingMovements?.map(renderStopPointMovement);
  };

  /** Render path movements */
  useEffect(() => {
    const polylinesCleanup: Record<string, google.maps.Polyline | undefined> = {};
    if (isGoogleApiLoaded) {
      trackingMovements?.forEach(({ points, strokeColor, strokeOpacity, strokeWeight, uid }) => {
        const polylineOfPath = renderPathMovement({
          path: points,
          strokeColor,
          strokeOpacity,
          strokeWeight,
        });
        polylinesCleanup[uid] = polylineOfPath;
      });
    }
    return () => {
      Object.keys(polylinesCleanup).forEach(uid => {
        polylinesCleanup[uid]?.setMap(null);
      });
    };
  }, [trackingMovements, isGoogleApiLoaded]);
  //#endregion

  //#region Planing
  /** Function to render a polygon of planning on the map. */
  const renderPlanning = ({
    fillColor,
    fillOpacity,
    points,
    strokeColor,
    strokeOpacity,
    strokeWeight,
  }: Planning): google.maps.Polygon | undefined => {
    if (mapsRef.current && mapRef.current) {
      const polygon = new mapsRef.current.Polygon({
        paths: points,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity,
      });
      polygon.setMap(mapRef.current);
      return polygon;
    }
    return;
  };

  /** Render polygon of plannings */
  useEffect(() => {
    const polygonsCleanup: Record<string, google.maps.Polyline | undefined> = {};
    if (isGoogleApiLoaded) {
      plannings?.forEach(({ points, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity, uid }) => {
        const polygon = renderPlanning({
          points,
          strokeColor,
          strokeOpacity,
          strokeWeight,
          fillColor,
          fillOpacity,
          uid,
        });
        polygonsCleanup[uid] = polygon;
      });
    }
    return () => {
      Object.keys(polygonsCleanup).forEach(uid => {
        polygonsCleanup[uid]?.setMap(null);
      });
    };
  }, [plannings, isGoogleApiLoaded]);
  //#endregion

  //#region Google map
  /**
   * Handles the event when the Google Maps API is loaded.
   * It sets the map and maps references, updates the state to indicate the API is loaded,
   * and triggers any provided `onGoogleApiLoaded` callback with the map details.
   */
  const handleGoogleApiLoaded: GoogleMapReactProps['onGoogleApiLoaded'] = ({ map, maps }) => {
    mapRef.current = map;
    mapsRef.current = maps;
    setIsGoogleApiLoaded(true);
    onGoogleApiLoaded?.();
  };

  /**
   * Handles changes in the map's state, such as zoom level and center position.
   * Delegates to `handleChangeViewport` to manage the viewport state and handle any additional logic.
   */
  const handleChange: GoogleMapReactProps['onChange'] = value => {
    handleChangeViewport(value);
  };

  /**
   * Creates imperative handles for the GoogleMap component. This allows parent components to
   * control the map's center and zoom level directly.
   */
  useImperativeHandle(ref, () => {
    return {
      panTo: (center): void => mapRef.current?.panTo(center),
      zoom: (zoom): void => mapRef.current?.setZoom(zoom),
    };
  });
  //#endregion

  return (
    <GoogleMapReact
      style={{ height, width }}
      bootstrapURLKeys={googleApiConfig}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={handleGoogleApiLoaded}
      onChange={handleChange}
    >
      {renderPointsNCluster()}
      {renderStopPointsOfMovements()}
    </GoogleMapReact>
  );
};

export const GoogleMap = forwardRef(GoogleMapComponent) as <P extends PointExtendProps>(
  props: Props<P> & { ref?: Ref<Actions> },
) => ReactElement | null;
