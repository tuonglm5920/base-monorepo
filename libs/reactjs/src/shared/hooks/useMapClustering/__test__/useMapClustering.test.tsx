/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { FC } from 'react';
import { Point, Viewport, isCluster } from 'utilities';
import { useMapClustering } from '../src/useMapClustering';

interface PointExtend {
  crimeId: number;
  category: string;
}

describe('useMapClustering', () => {
  it('renders clusters', async () => {
    const points: Point<PointExtend>[] = [
      {
        properties: {
          crimeId: 78212911,
          category: 'anti-social-behaviour',
          uid: '1',
        },
        geometry: { coordinate: { lng: -1.135171, lat: 52.6376 } },
      },
      {
        properties: {
          crimeId: 78213207,
          category: 'anti-social-behaviour',
          uid: '2',
        },
        geometry: { coordinate: { lng: -1.133005, lat: 52.629835 } },
      },
      {
        properties: {
          crimeId: 78213205,
          category: 'anti-social-behaviour',
          uid: '3',
        },
        geometry: { coordinate: { lng: -1.114732, lat: 52.628909 } },
      },
      {
        properties: {
          crimeId: 78213197,
          category: 'anti-social-behaviour',
          uid: '4',
        },
        geometry: { coordinate: { lng: -1.133691, lat: 52.63625 } },
      },
    ];

    const bounds: Viewport = {
      minLng: -1.2411810957931664,
      minLat: 52.61208435908725,
      maxLng: -1.0083656811012531,
      maxLat: 52.64495957533833,
      zoom: 10,
    };

    const options = { radius: 75, maxZoom: 20 };

    const App: FC = () => {
      const { pointsNClusters: clusters } = useMapClustering({ points, options, viewport: bounds });

      return (
        <ul>
          {clusters.map(point => {
            if (isCluster(point)) {
              return <li key={point.properties.clusterId}>points: {point.properties.pointsCount}</li>;
            } else {
              return <li key={point.properties.crimeId}>{point.properties.category}</li>;
            }
          })}
        </ul>
      );
    };

    const { findByText } = render(<App />);
    const clusterNode = await findByText('points: 4');
    expect(clusterNode).toBeInTheDocument();
  });
});
