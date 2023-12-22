/**
 * Represents the different types of response codes that can be returned.
 */
export type ResponseCode =
  // Custom errors or errors returned by the service
  | number
  // Errors due to the service
  | 'Service'
  // Errors due to frontend validation issues
  | 'Frontend'
  // Network-related errors
  | 'Network'
  // Other unspecified errors
  | 'Unknown';
