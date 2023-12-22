import axios from 'axios';
import { Request, ResponseListing } from '../../../../../@types';
import { getErrorCode } from '../../../../../@utils';
import { Post } from '../../../models';

/**
 * Fetches a list of posts using a GET request. The function handles the API call and returns a response wrapped in either a success or failure object. The success response includes the list of posts and pagination details.
 *
 * @param {Request.Options} [options] - Optional configuration for the request, such as a cancellation token.
 * @returns {Promise<ResponseListing.Failure | ResponseListing.Success<Post>>} A promise that resolves to a success object containing an array of posts and pagination details, or a failure object with error details.
 */
export const getPosts = (
  options?: Request.Options,
): Promise<ResponseListing.Failure | ResponseListing.Success<Post>> => {
  type ResponseSuccess = Array<{
    userId: number;
    id: number;
    title: string;
    body: string;
  }>;

  return axios
    .request<ResponseSuccess>({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts',
      cancelToken: options?.cancelToken,
    })
    .then<ResponseListing.Success<Post>>(response => {
      return {
        status: 'success',
        data: {
          hits: response.data,
          pagination: {
            totalPages: 1,
            totalRows: response.data.length,
          },
        },
      };
    })
    .catch<ResponseListing.Failure>(error => {
      return {
        status: 'failure',
        code: getErrorCode(error),
      };
    });
};
