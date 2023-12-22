import { CancelToken } from 'axios';

export namespace Request {
  export interface Options {
    /**
     * An optional cancellation token to cancel the request.
     * This is typically used to cancel the request before it completes,
     * for instance, if the user navigates away from a page or a component is unmounted.
     */
    cancelToken?: CancelToken;
  }
}
