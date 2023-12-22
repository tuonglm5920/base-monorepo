<b><i>Clone from: https://github.com/mapbox/supercluster</i></b>

# Overview

A very fast JavaScript library for geospatial point clustering for browsers and Node.

# API

## Methods

#### `load(points)`

Loads an array of points. Each point is expected to be an object with `x` and `y` properties, suitable for spatial indexing. This method initializes the clustering process. The index created remains immutable once loaded.

#### `getClusters(bbox, zoom)`

Given a bounding box (`bbox` array: `[westLng, southLat, eastLng, northLat]`) and an integer value for `zoom`, this method returns an array of clusters and points. Each cluster or point is represented as a point object with `x` and `y` properties.

### `getChildren(clusterId)`

Retrieves the child elements (points or smaller clusters) of a specified cluster. Given a `clusterId`, this method returns an array of `PointOrCluster` objects, representing either points or smaller clusters that are part of the larger cluster.

### `getClusterExpansionZoom(clusterId)`

Determines the minimum zoom level at which a given cluster expands. For a specified `clusterId`, this method calculates the zoom level where the cluster breaks down into smaller clusters or individual points.

## Options

| Option    | Default | Description                                                       |
| --------- | ------- | ----------------------------------------------------------------- |
| minZoom   | 0       | Minimum zoom level at which clusters are generated.               |
| maxZoom   | 16      | Maximum zoom level at which clusters are generated.               |
| minPoints | 2       | Minimum number of points to form a cluster.                       |
| radius    | 40      | Cluster radius, in pixels.                                        |
| extent    | 512     | (Tiles) Tile extent. Radius is calculated relative to this value. |
| nodeSize  | 64      | Size of the KD-tree leaf node. Affects performance.               |
| debug     | false   | Whether timing info should be logged.                             |

# Example

```jsx

const data = [
  {
    properties: {
      scalerank: 2,
      name: 'Niagara Falls',
      comment: null,
      name_alt: null,
      lat_y: 43.087653,
      long_x: -79.044073,
      region: 'North America',
      subregion: null,
      featureclass: 'waterfall',
    },
    geometry: {
      coordinate: { lat: 43.08771393436908, lng: -79.04411780507252 },
    },
  },
  {
    properties: {
      scalerank: 2,
      name: 'Salto Angel',
      comment: null,
      name_alt: 'Angel Falls',
      lat_y: 5.686836,
      long_x: -62.061848,
      region: 'South America',
      subregion: null,
      featureclass: 'waterfall',
    },
    geometry: {
      coordinate: { lat: 5.686896063275327, lng: -62.06181800038502 },
    },
  },
  {
    properties: {
      scalerank: 2,
      name: 'Iguazu Falls',
      comment: null,
      name_alt: null,
      lat_y: -25.568265,
      long_x: -54.582842,
      region: 'South America',
      subregion: null,
      featureclass: 'waterfall',
    },
    geometry: {
      coordinate: { lat: -25.568291925005923, lng: -54.58299719960377 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Gees Gwardafuy',
      comment: null,
      name_alt: null,
      lat_y: 11.812855,
      long_x: 51.235173,
      region: 'Africa',
      subregion: null,
      featureclass: 'cape',
    },
    geometry: {
      coordinate: { lat: 11.822028799226407, lng: 51.258313644180184 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Victoria Falls',
      comment: null,
      name_alt: null,
      lat_y: -17.77079,
      long_x: 25.460133,
      region: 'Africa',
      subregion: null,
      featureclass: 'waterfall',
    },
    geometry: {
      coordinate: { lat: -17.928033135943423, lng: 25.852793816021233 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Wright I.',
      comment: null,
      name_alt: null,
      lat_y: -50.959168,
      long_x: -72.995002,
      region: 'Antarctica',
      subregion: null,
      featureclass: 'island',
    },
    geometry: {
      coordinate: { lat: -74.06670501094342, lng: -116.89262854726002 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Grant I.',
      comment: null,
      name_alt: null,
      lat_y: -50.959168,
      long_x: -72.995002,
      region: 'Antarctica',
      subregion: null,
      featureclass: 'island',
    },
    geometry: {
      coordinate: { lat: -74.48272063594342, lng: -131.48540198476002 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Newman I.',
      comment: null,
      name_alt: null,
      lat_y: -50.959168,
      long_x: -72.995002,
      region: 'Antarctica',
      subregion: null,
      featureclass: 'island',
    },
    geometry: {
      coordinate: { lat: -75.59185149531842, lng: -145.68681800038502 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Dean I.',
      comment: null,
      name_alt: null,
      lat_y: -50.959168,
      long_x: -72.995002,
      region: 'Antarctica',
      subregion: null,
      featureclass: 'island',
    },
    geometry: {
      coordinate: { lat: -74.50066497188092, lng: -127.63438880116627 },
    },
  },
  {
    properties: {
      scalerank: 3,
      name: 'Cape Canaveral',
      comment: null,
      name_alt: null,
      lat_y: 28.483713,
      long_x: -80.534941,
      region: 'North America',
      subregion: null,
      featureclass: 'cape',
    },
    geometry: {
      coordinate: { lat: 28.473056814472134, lng: -80.53625603636821 },
    },
  }
]

const Index: FC = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      const L = window.L;
      const map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      function createClusterIcon(feature, latlng) {
        if (!feature.properties.cluster) {
          return L.marker(latlng, { title: feature.properties.name });
        }

        const count = feature.properties.pointsCount;
        const size =
          feature.properties.pointsCount === 11 ? 'large' : count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
        const icon = L.divIcon({
          html: `
           <div class="tooltip">
            <span>${feature.properties.pointsCount}</span>
            <div class="tooltiptext">
              <ul>
              ${feature.properties.points.map((point) => `<li>${point.properties.name}</li>`).join('')}
              </ul>
            </div>
          </div>
          `,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(40, 40),
        });

        return L.marker(latlng, { icon });
      }

      const markers = L.geoJson(null, {
        pointToLayer: createClusterIcon,
      }).addTo(map);

      const index = new MapClustering({
        debug: true,
        radius: 60,
        extent: 256,
        maxZoom: 17,
      }).load(data);

      function update() {
        const bounds = map.getBounds();
        const clusters = index.getClusters(
          [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
          map.getZoom(),
        );

        markers.clearLayers();
        markers.addData(
          clusters.map(
            item =>
              ({
                geometry: {
                  type: 'Point',
                  coordinates: [item.geometry?.coordinate?.lng, item.geometry?.coordinate?.lat],
                },
                type: 'Feature',
                properties: item.properties,
              } as GeoJSON.Feature),
          ),
        );
      }

      // Click event for markers
      markers.on('click', (e) => {
        if (e.layer.feature.properties.clusterId) {
          const expansionZoom = index.getClusterExpansionZoom(e.layer.feature.properties.clusterId);
          map.flyTo(e.latlng, expansionZoom);
        }
      });

      update();
      map.on('moveend', update);
    }
    isMounted.current = true;
  }, []);

  return <div id="map"></div>;
};

export default Index;
```

```css
html,
body,
#map {
  height: 100%;
  margin: 0;
}

.marker-cluster-small {
  background-color: rgba(181, 226, 140, 0.6);
}
.marker-cluster-small div {
  background-color: rgba(110, 204, 57, 0.6);
}

.marker-cluster-medium {
  background-color: rgba(241, 211, 87, 0.6);
}
.marker-cluster-medium div {
  background-color: rgba(240, 194, 12, 0.6);
}

.marker-cluster-large {
  background-color: rgba(253, 156, 115, 0.6);
}
.marker-cluster-large div {
  background-color: rgba(241, 128, 23, 0.6);
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
}
.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;

  text-align: center;
  border-radius: 15px;
  font:
    12px "Helvetica Neue",
    Arial,
    Helvetica,
    sans-serif;
}
.marker-cluster span {
  line-height: 30px;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  border-radius: 6px;
  padding: 5px 16px !important;
  height: auto !important;
  width: 200px !important;
  text-align: left !important;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
```
