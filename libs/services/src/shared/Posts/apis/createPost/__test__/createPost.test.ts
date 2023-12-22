import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ResponseDetail } from '../../../../../@types';
import { Post } from '../../../models';
import { createPost } from '../src/createPost';

const mock = new MockAdapter(axios, {
  delayResponse: 1000,
});

/**
 *
 */
const mockPost = {
  id: 1,
  userId: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
};

describe('createPost', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should create a post', async () => {
    mock.onPost('https://jsonplaceholder.typicode.com/posts').reply(200, mockPost);

    const response = await createPost({
      userId: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    });

    expect((response as ResponseDetail.Success<Post>).data).toEqual(mockPost);
  });

  it('should handle a network error', async () => {
    mock.onPost('https://jsonplaceholder.typicode.com/posts').networkError();

    const response = await createPost({
      userId: 1,
      title: 'New Post',
      body: 'Content of new post',
    });

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Network');
  });

  it('should handle a 500 server error', async () => {
    mock.onPost('https://jsonplaceholder.typicode.com/posts').reply(500);

    const response = await createPost({
      userId: 1,
      title: 'New Post',
      body: 'Content of new post',
    });

    expect(response.status).toBe('failure');
    expect((response as ResponseDetail.Failure).code).toBe('Service');
  });
});
