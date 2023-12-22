import axios from 'axios';
import { Request, ResponseDetail } from '../../../../../@types';
import { getErrorCode } from '../../../../../@utils';
import { Post } from '../../../models';

/**
 * Sends a DELETE request to remove a post based on its ID. It handles the API call and returns a response indicating success or failure.
 *
 * @param {Post['id']} id - The ID of the post to be deleted.
 * @param {Request.Options} [options] - Optional configuration for the request, such as a cancellation token.
 * @returns {Promise<ResponseDetail.Failure | ResponseDetail.Success<boolean>>} A promise that resolves to a success object with a boolean indicating the outcome, or a failure object with error details.
 */
export const deletePost = (
  id: Post['id'],
  options?: Request.Options,
): Promise<ResponseDetail.Failure | ResponseDetail.Success<boolean>> => {
  return axios
    .request<boolean>({
      method: 'DELETE',
      url: `https://jsonplaceholder.typicode.com/posts/${id}`,
      cancelToken: options?.cancelToken,
    })
    .then<ResponseDetail.Success<boolean>>(response => {
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
