# Overview

The `MapboxGL` component is a versatile React component designed for displaying and interacting with Mapbox GL. It supports features like clustering, tracking movements, and handling of Mapbox GL API, making it suitable for applications that require detailed map interactions such as tracking deliveries, visualizing locations, or displaying large sets of geospatial data.

# Features

- **Clustering**: Effectively groups a large number of points on the map, organizing them into clusters based on zoom level and viewport. This feature is crucial for handling dense geospatial data.
- **Tracking Movements**: Offers capabilities to visualize paths and waypoints, which is beneficial for tracking movements such as logistic routes, user travel paths, or other dynamic geospatial data.
- **Planning Features**: Enables the incorporation of planning data, facilitating route planning, and event scheduling on the map.
- **Mapbox GL API Integration**: Seamlessly integrates with Mapbox GL API, providing extensive customization options and control over map functionalities.

# Props

| Prop                  | Type                                      | Optional | Description                                                      |
| --------------------- | ----------------------------------------- | -------- | ---------------------------------------------------------------- |
| `width`               | `CSSProperties['width']`                  | Yes      | The width of the map component, using CSS property values.       |
| `height`              | `CSSProperties['height']`                 | Yes      | The height of the map component, using CSS property values.      |
| `defaultCenter`       | `Coordinate`                              | No       | The default center position of the map.                          |
| `defaultZoom`         | `number`                                  | Yes      | Optional default zoom level for the map.                         |
| `onMapboxGLApiLoaded` | `() => void`                              | Yes      | Optional callback function when the Mapbox GL API is loaded.     |
| `clustering`          | `Clustering<P>`                           | Yes      | Optional configuration for clustering behavior on the map.       |
| `trackingMovements`   | `TrackingMovement[]`                      | Yes      | Optional array of tracking movements to be displayed on the map. |
| `plannings`           | `Planning[]`                              | Yes      | Optional array of planning objects to be used in the map.        |
| `mapboxGLApiConfig`   | `{ accessToken: string; style: string; }` | Yes      | Optional configuration for the Mapbox GL API, such as API key.   |

# Examples

#### Clustering

```jsx
<MapboxGL
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
<MapboxGL
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
