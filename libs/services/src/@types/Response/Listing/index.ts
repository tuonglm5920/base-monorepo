import { ResponseCode } from '../Code';

/**
 * Namespace for handling response details specific to listing operations.
 */
export namespace ResponseListing {
  /**
   * Represents a successful response for a listing operation.
   *
   * @template T - The type of individual items in the listing.
   */
  export interface Success<T> {
    // Indicates the status of the response as a success.
    status: 'success';
    // Contains the data for the successful response.
    data: {
      // Array of items of generic type T.
      hits: T[];
      // Pagination details of the listing.
      pagination: {
        // The total number of rows/items available.
        totalRows: number;
        // The total number of pages available.
        totalPages: number;
      };
    };
  }

  /** Represents a failed response for a listing operation. */
  export interface Failure {
    // Indicates the status of the response as a failure.
    status: 'failure';
    // The error code associated with the failure, defined in ResponseCode.
    code: ResponseCode;
  }
}
