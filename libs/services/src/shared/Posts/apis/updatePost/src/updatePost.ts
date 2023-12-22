import axios from 'axios';
import { Request, ResponseDetail } from '../../../../../@types';
import { getErrorCode } from '../../../../../@utils';
import { Post } from '../../../models';

/**
 * Updates a specific post by sending a PUT request with the new data. The function handles the API call and returns a response indicating either success or failure.
 *
 * @param {Post['id']} id - The ID of the post to be updated.
 * @param {Omit<Post, 'id'>} data - The new data for the post, excluding the 'id' field.
 * @param {Request.Options} [options] - Optional configuration for the request, such as a cancellation token.
 * @returns {Promise<ResponseDetail.Failure | ResponseDetail.Success<Post>>} A promise that resolves to a success object containing the updated post data, or a failure object with error details.
 */
export const updatePost = (
  id: Post['id'],
  data: Omit<Post, 'id'>,
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
      method: 'PUT',
      url: `https://jsonplaceholder.typicode.com/posts/${id}`,
      cancelToken: options?.cancelToken,
      data,
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
