import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ResponseDetail } from '../../../../../@types';
import { Post } from '../../../models';
import { getPost } from '../src/getPost';

const mock = new MockAdapter(axios, {
  delayResponse: 1000,
});

/**
 *
 */
const mockPost = {
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
};

describe('getPost', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should fetch a post', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/posts/1').reply(200, mockPost);

    const response = await getPost(1);

    expect((response as ResponseDetail.Success<Post>).data).toEqual(mockPost);
  });

  it('should handle a network error', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/posts/1').networkError();

    const response = await getPost(1);

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Network');
  });

  it('should handle a 500 server error', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/posts/1').reply(500);

    const response = await getPost(1);

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Service');
  });
});
