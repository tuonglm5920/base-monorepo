# Overview

The `Leaflet` component is a versatile React component designed for displaying and interacting with Leaflet. It supports features like clustering, tracking movements, and handling of Leaflet API, making it suitable for applications that require detailed map interactions such as tracking deliveries, visualizing locations, or displaying large sets of geospatial data.

# Limitations

- Not support for server side

# Features

- **Clustering**: Efficiently groups a large number of points on the map into clusters based on zoom level and viewport, ideal for managing dense geospatial data.
- **Tracking Movements**: Enables visualization of paths and waypoints.
- **Planning Features**: Enables the incorporation of planning data, facilitating route planning, and event scheduling on the map.
- **Leaflet API Integration**: Provides seamless integration with the Leaflet API, allowing for extensive customization and control over map features.

# Props

| Prop                 | Type                             | Optional | Description                                                      |
| -------------------- | -------------------------------- | -------- | ---------------------------------------------------------------- |
| `width`              | `CSSProperties['width']`         | Yes      | The width of the map component, using CSS property values.       |
| `height`             | `CSSProperties['height']`        | Yes      | The height of the map component, using CSS property values.      |
| `defaultCenter`      | `Coordinate`                     | No       | The default center position for the map.                         |
| `defaultZoom`        | `number`                         | Yes      | Optional default zoom level for the map.                         |
| `onLeafletApiLoaded` | `() => void`                     | Yes      | Optional callback function when the Leaflet API is loaded.       |
| `clustering`         | `Clustering<P>`                  | Yes      | Optional configuration for clustering behavior on the map.       |
| `trackingMovements`  | `TrackingMovement[]`             | Yes      | Optional array of tracking movements to be displayed on the map. |
| `plannings`          | `Planning[]`                     | Yes      | Optional array of planning objects to be used in the map.        |
| `leafletApiConfig`   | `{ title: string; }`             | Yes      | Optional configuration for the Leaflet API, such as title.       |
| `renderLoading`      | `ReactNode \| (() => ReactNode)` | Yes      | Renders content while Leaflet API is loading.                    |
| `renderFailure`      | `ReactNode \| (() => ReactNode)` | Yes      | Renders content in case of failure to load the Leaflet module.   |

## Limitations and Considerations

This section outlines known limitations of the component and the reasons behind them. Understanding these limitations will help in effectively integrating and using the component in your projects.

### 1. Events on Clusters and Points

**Issue:** Events assigned to clusters and points (such as `onClick`, `onHover`, etc.) may not function as expected.

**Cause:** This limitation stems from the Leaflet component's requirement to use strings for creating custom markers. Our component leverages `renderToString` to address this requirement of Leaflet. However, this approach interferes with the normal functioning of events on clusters and points.

**Implications:** When events are passed to clusters or points, they may not trigger as intended. This is a significant consideration if your application relies on interactive map elements.

### 2. MouseEvent Propagation in Clusters and Points

**Issue:** The `onClick` property for clusters and points is implemented as a MouseEvent. However, the `currentTarget` attribute of this event corresponds to the HTML element of the Leaflet marker, not the container of cluster or point.

**Cause:** This behavior is a result of how Leaflet handles DOM elements for markers and clusters, which differs from typical React event handling.

**Implications:** Users should be aware that interacting with clusters and points will yield a MouseEvent where `currentTarget` is the underlying Leaflet HTML element. This could affect how event handling and state management are implemented in the parent application.

# Examples

#### Clustering

```jsx
<Leaflet
  {...args}
  defaultCenter={{ lat: 59.95, lng: 30.33 }}
  clustering={{
    points,
    cluster: {
      onClick: ({ cluster }) => {
        alert(JSON.stringify(cluster));
      },
      render: (cluster) => {
        return (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              background: "rgb(231, 76, 60)",
              color: "#fff",
            }}
          >
            {cluster.properties.pointsCount}
          </div>
        );
      },
    },
    point: {
      onClick: ({ point }) => alert(JSON.stringify(point)),
      render: (point) => {
        return (
          <div style={{ color: "#fff" }}>
            <img width={24} height={24} src="https://img.icons8.com/?size=48&id=13800&format=png" alt="Marker icon" />
            <p>{point.properties.name}</p>
          </div>
        );
      },
    },
  }}
/>
```

#### Tracking movements

```jsx
<Leaflet
  defaultCenter={{ lat: 12.9802347063322, lng: 77.5907760360903 }}
  defaultZoom={16}
  trackingMovements={[
    {
      uid: "1",
      strokeColor: "#0088FF",
      strokeWeight: 6,
      strokeOpacity: 0.6,
      renderPoint: () => <img style={{ transform: "translate(-50%, -100%)" }} width={36} height={36} src="https://img.icons8.com/?size=48&id=13800&format=png" alt="Marker icon" />,
      stopPoints: [
        { lat: 12.9802347063322, lng: 77.5907760360903, uid: "stop1" },
        { lat: 12.9787501361417, lng: 77.5917845466407, uid: "stop2" },
        { lat: 12.9771191896563, lng: 77.5857120256672, uid: "stop3" },
      ],
      path: [
        {
          lat: 12.9802347063322,
          lng: 77.5907760360903,
        },
        {
          lat: 12.9793774204024,
          lng: 77.5910979011596,
        },
        {
          lat: 12.9795865148043,
          lng: 77.5911622741734,
        },
        {
          lat: 12.9797746996155,
          lng: 77.5916987159555,
        },
        {
          lat: 12.9801301594259,
          lng: 77.5919776656823,
        },
        {
          lat: 12.9798374278543,
          lng: 77.5922780730802,
        },
        {
          lat: 12.9791683258247,
          lng: 77.5920849540387,
        },
        {
          lat: 12.9787501361417,
          lng: 77.5917845466407,
        },
        {
          lat: 12.9784155838887,
          lng: 77.5912481048586,
        },
        {
          lat: 12.9784783124705,
          lng: 77.5913768508863,
        },
        {
          lat: 12.9783319457552,
          lng: 77.5912266471873,
        },
        {
          lat: 12.978394674358,
          lng: 77.591054985817,
        },
        {
          lat: 12.9779555738058,
          lng: 77.5909262397893,
        },
        {
          lat: 12.9776210204837,
          lng: 77.5904541710211,
        },
        {
          lat: 12.9774746532636,
          lng: 77.5901537636231,
        },
        {
          lat: 12.9761573444059,
          lng: 77.5872569779997,
        },
        {
          lat: 12.9764291706147,
          lng: 77.5866347055324,
        },
        {
          lat: 12.9766382674962,
          lng: 77.5863986711483,
        },
        {
          lat: 12.9771191896563,
          lng: 77.5857120256672,
        },
      ],
    },
  ]}
/>
```

#### Plannings

```jsx
const Planning = () => (
  <Leaflet
    defaultCenter={{ lat: 55.3781, lng: -3.436 }} // Centered on UK
    defaultZoom={5}
    plannings={planningsData.map((planning) => {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);

      // Convert each color component to a hexadecimal string and concatenate them
      const color = "#" + red.toString(16).padStart(2, "0") + green.toString(16).padStart(2, "0") + blue.toString(16).padStart(2, "0");
      return {
        uid: planning.name,
        points: planning.polygonPoints,
        strokeColor: color,
        strokeWeight: 6,
        strokeOpacity: 0.6,
        fillColor: color,
        fillOpacity: 0.3,
      };
    })}
  />
);
```
