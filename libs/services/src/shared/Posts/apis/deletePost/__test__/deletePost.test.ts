import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ResponseDetail } from '../../../../../@types';
import { deletePost } from '../src/deletePost';

const mock = new MockAdapter(axios, {
  delayResponse: 1000,
});

/**
 *
 */
describe('deletePost', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should delete a post', async () => {
    mock.onDelete('https://jsonplaceholder.typicode.com/posts/1').reply(200, true);

    const response = await deletePost(1);

    expect(response.status).toEqual('success');
  });

  it('should handle a network error', async () => {
    mock.onDelete('https://jsonplaceholder.typicode.com/posts/1').networkError();

    const response = await deletePost(1);

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Network');
  });

  it('should handle a 500 server error', async () => {
    mock.onDelete('https://jsonplaceholder.typicode.com/posts/1').reply(500);

    const response = await deletePost(1);

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Service');
  });
});
