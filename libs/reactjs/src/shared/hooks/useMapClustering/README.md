# Overview

`useMapClustering` is a custom React hook designed for efficient point clustering on maps. It facilitates the management of numerous map points by dynamically clustering them based on zoom levels and optional geographic bounds. The hook offers customizable options for different clustering behaviors, making it highly adaptable to various map-related applications.

# Options

### Parameters

- **points**: `Array<Point<P>>`: An array of points to be clustered on the map.
- **bounds**: `Viewport` (optional): Geographic bounds to limit the clustering to a specific area.
- **zoom**: `number`: The zoom level of the map, which influences the clustering.
- **options**: `Partial<MapClusteringOptions>` (optional): Configuration options for customizing the clustering behavior.
- **disableRefresh**: `boolean` (optional): If set to true, it prevents automatic re-clustering when the points data changes.

### Return Value

- `Object`: An object containing:
  - `clusters`: `Array<PointOrCluster<P>>` - The array of clustered points.
  - `mapClusteringInstance`: `MapClustering<P> | undefined` - An instance of the map clustering implementation, if applicable.

# Examples

```jsx
import React from 'react';
import { useMapClustering } from 'your-library-name';

export default function MapComponent() {
  const { clusters, mapClusteringInstance } = useMapClustering({
    points: [...], // Array of points
    bounds: {...}, // Optional viewport bounds
    zoom: 10,      // Zoom level
    options: {...},// Optional clustering options
    disableRefresh: false
  });

  return (
    <div>
      {/* Render your map with clusters here */}
    </div>
  );
}
```
