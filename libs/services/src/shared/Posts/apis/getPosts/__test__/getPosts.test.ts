import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ResponseDetail, ResponseListing } from '../../../../../@types';
import { Post } from '../../../models';
import { getPosts } from '../src/getPosts';

const mock = new MockAdapter(axios, {
  delayResponse: 1000,
});

/**
 *
 */
const mockPosts = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
  },
];

describe('getPosts', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should fetch all posts', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, mockPosts);

    const response = await getPosts();

    expect((response as ResponseListing.Success<Post>).data.hits).toEqual(mockPosts);
  });

  it('should handle a network error', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/posts').networkError();

    const response = await getPosts();

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Network');
  });

  it('should handle a 500 server error', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(500);

    const response = await getPosts();

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Service');
  });
});
