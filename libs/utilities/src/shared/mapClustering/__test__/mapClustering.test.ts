import { MapClustering } from '../src/mapClustering';
import data from './data.json';

interface PointProps {
  name: string;
  scalerank?: number;
}

describe('mapClustering', () => {
  //#region .getClusters()
  it('returns clusters when query crosses international dateline', () => {
    const index = new MapClustering<PointProps>({}).load([
      {
        properties: {
          uid: '1',
          name: 'Test Island 1',
        },
        geometry: {
          coordinate: {
            lng: -178.989,
            lat: 0,
          },
        },
      },
      {
        properties: {
          uid: '2',
          name: 'Test Island 2',
        },
        geometry: {
          coordinate: {
            lng: -178.99,
            lat: 0,
          },
        },
      },
      {
        properties: {
          uid: '3',
          name: 'Test Island 3',
        },
        geometry: {
          coordinate: {
            lng: -178.991,
            lat: 0,
          },
        },
      },
      {
        properties: {
          uid: '4',
          name: 'Test Island 4',
        },
        geometry: {
          coordinate: {
            lng: -178.992,
            lat: 0,
          },
        },
      },
    ]);

    const nonCrossing = index.getClusters({ minLng: -179, minLat: -10, maxLng: -177, maxLat: 10, zoom: 1 });
    const crossing = index.getClusters({ minLng: 179, minLat: -10, maxLng: -177, maxLat: 10, zoom: 1 });

    expect(nonCrossing.length).toBeTruthy();
    expect(crossing.length).toBeTruthy();
    expect(nonCrossing.length).toEqual(crossing.length);
  });

  it('does not crash on weird bbox values', () => {
    const index = new MapClustering<PointProps>({}).load(data);

    expect(() => {
      index.getClusters({ minLng: 129.42639, minLat: -103.720017, maxLng: -445.930843, maxLat: 114.518236, zoom: 1 });
    }).not.toThrow();

    expect(() => {
      index.getClusters({ minLng: 112.207836, minLat: -84.578666, maxLng: -463.149397, maxLat: 120.169159, zoom: 1 });
    }).not.toThrow();

    expect(() => {
      index.getClusters({ minLng: 129.886277, minLat: -82.33268, maxLng: -445.470956, maxLat: 120.39093, zoom: 1 });
    }).not.toThrow();

    expect(() => {
      index.getClusters({ minLng: 458.220043, minLat: -84.239039, maxLng: -117.13719, maxLat: 120.206585, zoom: 1 });
    }).not.toThrow();

    expect(() => {
      index.getClusters({ minLng: 456.713058, minLat: -80.354196, maxLng: -118.644175, maxLat: 120.539148, zoom: 1 });
    }).not.toThrow();

    expect(() => {
      index.getClusters({ minLng: 453.105328, minLat: -75.857422, maxLng: -122.251904, maxLat: 120.73276, zoom: 1 });
    }).not.toThrow();

    expect(() => {
      index.getClusters({ minLng: -180, minLat: -90, maxLng: 180, maxLat: 90, zoom: 1 });
    }).not.toThrow();
  });

  it('does not crash on non-integer zoom values', () => {
    const index = new MapClustering<PointProps>({}).load(data);
    expect(index.getClusters({ minLng: 179, minLat: -10, maxLng: -177, maxLat: 10, zoom: 1.25 })).toBeTruthy();
  });

  it('makes sure same-location points are clustered', () => {
    const index = new MapClustering<PointProps>({
      maxZoom: 20,
      extent: 8192,
      radius: 16,
    }).load([
      {
        properties: {
          uid: '1',
          name: 'Test Island 1',
        },
        geometry: {
          coordinate: {
            lng: -1.426798,
            lat: 53.943034,
          },
        },
      },
      {
        properties: {
          uid: '2',
          name: 'Test Island 2',
        },
        geometry: {
          coordinate: {
            lng: -1.426798,
            lat: 53.943034,
          },
        },
      },
    ]);

    expect(index.getTreeForTesting()[20].getIdsForTesting().length).toEqual(1);
  });

  it('does not throw on zero items', () => {
    expect(() => {
      const index = new MapClustering<PointProps>({}).load([]);
      expect(index.getClusters({ minLng: -180, minLat: -85, maxLng: 180, maxLat: 85, zoom: 0 })).toEqual([]);
    }).not.toThrow();
  });
  //#endregion

  //#region .getChildren
  it('returns children of a cluster', () => {
    const index = new MapClustering({}).load(data);
    const childCounts = index
      .getChildren(164)
      .map(p => (p.properties && 'pointsCount' in p.properties ? p.properties?.pointsCount : 1));
    expect(childCounts).toEqual([6, 7, 2, 1]);
  });
  //#endregion

  //#region .getClusterExpansionZoom
  it('returns cluster expansion zoom', () => {
    const index = new MapClustering({}).load(data);
    expect(index.getClusterExpansionZoom(164)).toEqual(1);
    expect(index.getClusterExpansionZoom(196)).toEqual(1);
    expect(index.getClusterExpansionZoom(581)).toEqual(2);
    expect(index.getClusterExpansionZoom(1157)).toEqual(2);
    expect(index.getClusterExpansionZoom(4134)).toEqual(3);
  });

  it('returns cluster expansion zoom for maxZoom', () => {
    const index = new MapClustering({
      radius: 60,
      extent: 256,
      maxZoom: 4,
    }).load(data);

    expect(index.getClusterExpansionZoom(2504)).toEqual(5);
  });
  //#endregion
});
