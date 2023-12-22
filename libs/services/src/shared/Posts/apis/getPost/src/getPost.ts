import axios from 'axios';
import { Request, ResponseDetail } from '../../../../../@types';
import { getErrorCode } from '../../../../../@utils';
import { Post } from '../../../models';

/**
 * Retrieves a specific post by its ID using a GET request. The function handles the API call and returns a response wrapped in either a success or failure object.
 *
 * @param {Post['id']} id - The ID of the post to retrieve.
 * @param {Request.Options} [options] - Optional configuration for the request, such as a cancellation token.
 * @returns {Promise<ResponseDetail.Failure | ResponseDetail.Success<Post>>} A promise that resolves to a success object containing the post data, or a failure object with error details.
 */
export const getPost = (
  id: Post['id'],
  options?: Request.Options,
): Promise<ResponseDetail.Failure | ResponseDetail.Success<Post>> => {
  // Internal interface for the success response from the API
  interface ResponseSuccess {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  return axios
    .request<ResponseSuccess>({
      method: 'GET',
      url: `https://jsonplaceholder.typicode.com/posts/${id}`,
      cancelToken: options?.cancelToken,
    })
    .then<ResponseDetail.Success<Post>>(response => {
      return {
        status: 'success',
        data: response.data,
      };
    })
    .catch<ResponseDetail.Failure>(error => {
      return {
        status: 'failure',
        code: getErrorCode(error),
      };
    });
};
