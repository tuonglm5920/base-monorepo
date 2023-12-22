import axios, { AxiosError, CanceledError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { FetchAPI } from '../src/fetchApi';

describe('fetchApi', () => {
  const mock = new MockAdapter(axios, {
    delayResponse: 1000,
  });

  const mockRefreshTokenSuccess = jest.fn();
  const mockRefreshTokenFailure = jest.fn();

  const instanceService1 = new FetchAPI({
    baseConfig: {
      method: 'GET',
      timeout: 10000,
      baseURL: 'https://randomuser.me/api',
    },
    reduxSagaCancel: '',
    setAccessToken: (): string => {
      return 'AccessToken';
    },
    setRefreshToken: (): string => {
      return 'RefreshToken';
    },
    setConditionApplyAccessToken: (config): boolean => {
      return config.method !== 'GET';
    },
    refreshTokenConfig: {
      url: 'https://example.com/refresh-token',
      success: mockRefreshTokenSuccess,
      failure: mockRefreshTokenFailure,
      setRefreshCondition: (error): boolean => {
        return error.response?.status === 401;
      },
      bodyData: (refreshToken, accessToken): any => {
        return {
          refreshToken,
          accessToken,
        };
      },
    },
  });
  const fetchAPI = instanceService1.request;

  beforeEach(() => {
    mock.onGet('https://randomuser.me/api/').reply(200, []);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should handle a request with a token', async () => {
    const { axiosPromise } = fetchAPI({ url: '/' });
    const response = await axiosPromise;
    expect(response.config.headers['Authorization']).toBe('AccessToken');
  });

  it('with abort cancel', async () => {
    const { axiosPromise, abortCancel } = fetchAPI({ url: '/' });
    setTimeout(abortCancel, 100);
    const error = await axiosPromise.catch(reason => reason);
    expect(error).toBeInstanceOf(CanceledError);
  });

  it('with axios cancel', async () => {
    const { axiosPromise, axiosCancel } = fetchAPI({ url: '/' });
    setTimeout(axiosCancel, 100);
    const error = await axiosPromise.catch(reason => reason);
    expect(error).toBeInstanceOf(CanceledError);
  });

  it('should handle refresh token', async () => {
    // Mock initial request failure and refresh token request success
    mock.reset();
    mock.onGet('https://randomuser.me/api/').replyOnce(401); // Simulating token expiry
    mock.onPost('https://example.com/refresh-token').reply(200, { accessToken: 'NewAccessToken' });

    const { axiosPromise } = fetchAPI({ url: '/' });
    const response = await axiosPromise.catch(reason => reason);
    expect(response).toBeInstanceOf(AxiosError);
    expect(mockRefreshTokenSuccess).toHaveBeenCalled();
  });

  it('handle refresh token failure', async () => {
    mock.reset();
    mock.onGet('https://randomuser.me/api/').replyOnce(401);
    mock.onPost('https://example.com/refresh-token').reply(400);

    const { axiosPromise } = fetchAPI({ url: '/' });
    const response = await axiosPromise.catch(reason => reason);
    expect(response).toBeInstanceOf(AxiosError);
    expect(mockRefreshTokenFailure).toHaveBeenCalled();
  });
});
