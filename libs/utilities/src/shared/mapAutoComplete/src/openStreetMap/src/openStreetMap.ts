/**
 * Interface representing an item returned by OpenStreetMap's search API.
 * It includes various properties describing a geographical location, such as its coordinates, type, and descriptive names.
 */
export interface OpenStreetMapItem {
  place_id: number; // Unique identifier for the place.
  licence: string; // License information for the data.
  osm_type: string; // Type of the OpenStreetMap element (e.g., node, way).
  osm_id: number; // OpenStreetMap ID for the element.
  lat: string; // Latitude of the location.
  lon: string; // Longitude of the location.
  class: string; // General classification of the location (e.g., building, highway).
  type: string; // More specific type of the location within its class.
  place_rank: number; // Numerical rank of the place.
  importance: number; // Importance score for the location.
  addresstype: string; // Type of address (e.g., residential, commercial).
  name: string; // Name of the location.
  display_name: string; // Full display name, often including address details.
  boundingbox: [string, string, string, string]; // Bounding box coordinates [south latitude, north latitude, west longitude, east longitude].
}

/**
 * Type representing an array of OpenStreetMapItem, typically used as a response format for successful search queries.
 */
export type OpenStreetMapResponseSuccess = OpenStreetMapItem[];

/**
 * Interface for the OpenStreetMap query object. It encapsulates the query parameters for the OpenStreetMap search.
 */
interface OpenStreetMap {
  query: string; // Search query string for the OpenStreetMap API.
}

/**
 * Constructs a URL for querying the OpenStreetMap API using a specified search query.
 * @param {OpenStreetMap} param0 - Object containing the 'query' string.
 * @returns {string} URL for the OpenStreetMap API search endpoint with the encoded query.
 * @link https://nominatim.openstreetmap.org/ui/search.html
 */
export const openStreetMap = ({ query }: OpenStreetMap): string => {
  return `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`;
};
