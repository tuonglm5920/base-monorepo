import axios from 'axios';
import { Request, ResponseDetail } from '../../../../../@types';
import { getErrorCode } from '../../../../../@utils';
import { Post } from '../../../models';

/**
 * Creates a new post by sending a POST request. This function handles the API call and returns the response wrapped in either a success or failure object.
 *
 * @param {Omit<Post, 'id'>} data - The data for the new post, excluding the 'id' field.
 * @param {Request.Options} [options] - Optional configuration for the request, such as cancellation tokens.
 * @returns {Promise<ResponseDetail.Failure | ResponseDetail.Success<Post>>} A promise that resolves to a success object containing the post data, or a failure object with error details.
 */
export const createPost = (
  data: Omit<Post, 'id'>,
  options?: Request.Options,
): Promise<ResponseDetail.Failure | ResponseDetail.Success<Post>> => {
  interface ResponseSuccess {
    userId: number;
    id: number;
    title: string;
    body: string;
  }
  return axios
    .request<ResponseSuccess>({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
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
