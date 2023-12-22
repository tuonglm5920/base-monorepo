import { ResponseCode } from '../Code';

/** Represents a successful response for a detail operation. */
export namespace ResponseDetail {
  /**
   * Represents a successful response.
   *
   * @template T - The type of data returned in the success response.
   */
  export interface Success<T> {
    // Indicates the status of the response as a success.
    status: 'success';
    // The data returned in the response. Its type is generic.
    data: T;
  }

  /** Represents a failed response. */
  export interface Failure {
    // Indicates the status of the response as a failure.
    status: 'failure';
    // The error code associated with the failure. Can be a number or specific error strings.
    code: ResponseCode;
  }
}
