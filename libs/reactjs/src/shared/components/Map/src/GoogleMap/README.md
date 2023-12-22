# Overview

The `GoogleMap` component is a versatile React component designed for displaying and interacting with Google Maps. It supports features like clustering, tracking movements, and handling of Google Maps API, making it suitable for applications that require detailed map interactions such as tracking deliveries, visualizing locations, or displaying large sets of geospatial data.

# Features

- **Clustering**: Efficiently manages and displays a large number of points on the map, grouping them into clusters based on the zoom level and viewport.
- **Tracking Movements**: Allows for the visualization of paths and stop points.
- **Planning Features**: Enables the incorporation of planning data, facilitating route planning, and event scheduling on the map.
- **Google Maps API Integration**: Seamlessly integrates with Google Maps API, offering extensive customization and control over map features.

# Props

| Prop                | Type                                       | Optional | Description                                                          |
| ------------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------- |
| `width`             | `CSSProperties['width']`                   | No       | The width of the map component.                                      |
| `height`            | `CSSProperties['height']`                  | No       | The height of the map component.                                     |
| `googleApiConfig`   | `GoogleMapReactProps['bootstrapURLKeys']`  | Yes      | Optional configuration for the Google Maps API, such as the API key. |
| `defaultCenter`     | `GoogleMapReactProps['defaultCenter']`     | No       | The default center position of the map.                              |
| `defaultZoom`       | `GoogleMapReactProps['defaultZoom']`       | Yes      | Optional default zoom level for the map.                             |
| `onGoogleApiLoaded` | `GoogleMapReactProps['onGoogleApiLoaded']` | Yes      | Optional callback for when the Google Maps API is loaded.            |
| `clustering`        | `Clustering<P>`                            | Yes      | Optional configurations for clustering behavior on the map.          |
| `trackingMovements` | `TrackingMovement[]`                       | Yes      | Optional array of tracking movements to display on the map.          |
| `plannings`         | `Planning[]`                               | Yes      | Optional array of planning objects to be used in the map.            |

# Known Issues with React 18

As of the current version, google-react-maps has a known issue when used with React 18. Specifically, markers and clusters may flicker, leading to a suboptimal user experience. This is due to incompatibility with the new react-dom API. Users are advised to consider this when deciding to integrate this component into applications running on React 18.
See more at:

- https://github.com/google-map-react/google-map-react/issues/1197
- https://github.com/google-map-react/google-map-react/issues/1145

# Examples

#### Clustering

```jsx
<GoogleMap
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
<GoogleMap
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
  <GoogleMap
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
