import { Meta, StoryFn } from '@storybook/react';
import { GoogleMap } from '../src/GoogleMap';
import clusteringsData from './data/clusterings.json';
import planningsData from './data/plannings.json';
import trackingMovementData from './data/trackingMovement.json';

export default {
  title: 'Shared/Components/GoogleMap',
  component: GoogleMap,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {
    googleApiConfig: {
      client: 'AIzaSyA5Lt3E5gYb-lfogvaSpCrvCpocLqHwNOI',
      key: 'AIzaSyA5Lt3E5gYb-lfogvaSpCrvCpocLqHwNOI',
    },
  },
} as Meta<typeof GoogleMap>;

export const Clustering: StoryFn<typeof GoogleMap> = args => (
  <GoogleMap<{ name: string }>
    {...args}
    defaultCenter={{ lat: 59.95, lng: 30.33 }}
    clustering={{
      points: clusteringsData,
      cluster: {
        onClick: ({ cluster }) => {
          alert(JSON.stringify(cluster));
        },
        render: cluster => {
          return (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                background: 'rgb(231, 76, 60)',
                color: '#fff',
              }}
            >
              {cluster.properties.pointsCount}
            </div>
          );
        },
      },
      point: {
        onClick: ({ point }) => alert(JSON.stringify(point)),
        render: point => {
          return (
            <div style={{ color: '#fff' }}>
              <img width={24} height={24} src="https://img.icons8.com/?size=48&id=13800&format=png" alt="Marker icon" />
              <p>{point.properties.name}</p>
            </div>
          );
        },
      },
    }}
  />
);

export const Tracking: StoryFn<typeof GoogleMap> = args => (
  <GoogleMap
    {...args}
    defaultCenter={{ lat: 12.9802347063322, lng: 77.5907760360903 }}
    defaultZoom={16}
    trackingMovements={[
      {
        uid: '1',
        strokeColor: '#0088FF',
        strokeWeight: 6,
        strokeOpacity: 0.6,
        renderPoint: () => (
          <img
            style={{ transform: 'translate(-50%, -100%)' }}
            width={36}
            height={36}
            src="https://img.icons8.com/?size=48&id=13800&format=png"
            alt="Marker icon"
          />
        ),
        stopPoints: trackingMovementData.stopPoints,
        points: trackingMovementData.points,
      },
    ]}
  />
);

export const Planning: StoryFn<typeof GoogleMap> = args => (
  <GoogleMap
    {...args}
    defaultCenter={{ lat: 55.3781, lng: -3.436 }} // Centered on UK
    defaultZoom={5}
    plannings={(planningsData as any[]).map(planning => {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);

      // Convert each color component to a hexadecimal string and concatenate them
      const color =
        '#' +
        red.toString(16).padStart(2, '0') +
        green.toString(16).padStart(2, '0') +
        blue.toString(16).padStart(2, '0');
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
