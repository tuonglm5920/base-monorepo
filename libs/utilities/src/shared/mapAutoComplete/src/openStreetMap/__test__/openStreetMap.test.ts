// Mock the global fetch function

import { openStreetMap } from '../src/openStreetMap';

const mockedResponse = [
  {
    place_id: 123,
    licence: 'Data © OpenStreetMap contributors',
    osm_type: 'node',
    osm_id: 456,
    lat: '52.51631',
    lon: '13.37777',
    class: 'place',
    type: 'attraction',
    // ... other properties
  },
  // ... other items
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockedResponse),
  }),
) as jest.Mock;

describe('OpenStreetMap Integration', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should create a correct query URL', () => {
    const query = 'Berlin';
    const url = openStreetMap({ query });
    expect(url).toBe('https://nominatim.openstreetmap.org/search?q=Berlin&format=json');
  });

  it('should return data in expected format', async () => {
    const query = 'Berlin';
    const data = await (await fetch(openStreetMap({ query }))).json();
    expect(data).toEqual(mockedResponse);
  });
});
