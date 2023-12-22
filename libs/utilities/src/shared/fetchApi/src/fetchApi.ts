import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuration for initializing FetchAPI
 * @typedef {Object} Configure
 * @property {string} reduxSagaCancel - Cancel token of Redux Saga
 * @property {AxiosRequestConfig} baseConfig - Base configuration for Axios
 * @property {Function} setAccessToken - Function to retrieve access token
 * @property {Function} setRefreshToken - Function to retrieve refresh token
 * @property {Function} setConditionApplyAccessToken - Function to check condition for applying access token in headers
 * @property {RefreshTokenConfig} refreshTokenConfig - Configuration for refresh token API setup
 */
interface Configure {
  /** Cancel token of Redux Saga */
  reduxSagaCancel: string;
  /** Base configuration for Axios */
  baseConfig: AxiosRequestConfig;
  /** Function to retrieve access token */
  setAccessToken: () => string;
  /** Function to retrieve refresh token */
  setRefreshToken: () => string;
  /** Function to check condition for applying access token in headers */
  setConditionApplyAccessToken: (config: AxiosRequestConfig) => boolean;
  /** Configuration for refresh token API setup */
  refreshTokenConfig: RefreshTokenConfig;
}

/**
 * Configuration for refresh token functionality
 * @typedef {Object} RefreshTokenConfig
 * @property {string} url - URL for the refresh token API
 * @property {Function} setRefreshCondition - Condition to perform refresh token operation
 * @property {Function} bodyData - Body data for refresh token API call
 * @property {Function} success - Callback on successful refresh token request
 * @property {Function} failure - Callback on failed refresh token request
 */
interface RefreshTokenConfig {
  /** URL for the refresh token API */
  url: string;
  /** Condition to perform refresh token operation */
  setRefreshCondition: (error: AxiosError) => boolean;
  /** Body data for refresh token API call */
  bodyData: (refreshToken: string, accessToken: string) => any;
  /** Callback on successful refresh token request */
  success: (res: AxiosResponse, originalRequest: AxiosRequestConfig) => void;
  /** Callback on failed refresh token request */
  failure: (error: AxiosError) => void;
}

/**
 * FetchAPI class to handle API requests and token management
 */
export class FetchAPI {
  /** Instance of Axios for making HTTP requests. */
  private _axiosInstance: AxiosInstance;
  /** Base configuration for Axios requests. */
  private _baseConfig: AxiosRequestConfig;
  /** Configuration related to the refresh token process. */
  private _refreshTokenConfig: RefreshTokenConfig;
  /** Token used to cancel ongoing requests in Redux Saga. */
  private _reduxSagaCancel: string;
  /** Function to retrieve the access token. */
  private _setAccessToken: Configure['setAccessToken'];
  /** Function to retrieve the refresh token. */
  private _setRefreshToken: Configure['setRefreshToken'];
  /** Function to determine if the access token should be applied to the request headers. */
  private _setConditionApplyAccessToken: Configure['setConditionApplyAccessToken'];
  /**
   * Initiates an API request with the provided configuration.
   * Returns an object containing the Axios promise, and functions to abort or cancel the request.
   * @template Response - The expected response type.
   * @param {AxiosRequestConfig} requestConfig - The Axios request configuration.
   * @returns An object containing the Axios promise and functions to control the request.
   */
  public request!: <Response>(requestConfig: AxiosRequestConfig) => {
    axiosPromise: AxiosPromise<Response>;
    abortCancel: () => void;
    axiosCancel: () => void;
  };

  constructor({
    baseConfig,
    refreshTokenConfig,
    reduxSagaCancel,
    setAccessToken,
    setRefreshToken,
    setConditionApplyAccessToken,
  }: Configure) {
    this._setAccessToken = setAccessToken;
    this._setRefreshToken = setRefreshToken;
    this._setConditionApplyAccessToken = setConditionApplyAccessToken;
    this._axiosInstance = axios.create();
    this._baseConfig = baseConfig;
    this._reduxSagaCancel = reduxSagaCancel;
    this._refreshTokenConfig = refreshTokenConfig;
    this._create();
  }

  /**
   * Sets up interceptor to apply access token in request headers.
   */
  private _handleApplyAccessToken = (): void => {
    this._axiosInstance.interceptors.request.use(config => {
      if (config?.url && this._setConditionApplyAccessToken(config)) {
        const accessToken = this._setAccessToken();
        config.headers['Authorization'] = accessToken;
      }
      return config;
    });
  };

  /**
   * Handles the refresh token logic.
   * @private
   * @param {RefreshTokenConfig} config - Configuration for handling the refresh token
   * @param {AxiosError} error - The Axios error that triggered the refresh token process
   * @returns {Promise<AxiosResponse>}
   */
  private _handleRefreshToken = async (
    config: RefreshTokenConfig,
    error: AxiosError,
  ): Promise<AxiosResponse<any, any> | undefined> => {
    const { url, bodyData, success, failure } = config;
    try {
      const refreshToken = this._setRefreshToken();
      const accessToken = this._setAccessToken();
      const res = await this._axiosInstance.post(url, bodyData(refreshToken, accessToken));
      if (error.config) {
        success(res, error.config);
        return await this._axiosInstance.request(error.config);
      }
      return;
    } catch {
      failure(error);
      return await Promise.reject(error);
    } finally {
      this._handleSetupRefreshToken(config);
    }
  };

  /**
   * Sets up the refresh token interceptor.
   * @private
   * @param {RefreshTokenConfig} config - Configuration for the refresh token setup
   */
  private _handleSetupRefreshToken = (config: RefreshTokenConfig): void => {
    const interceptor = this._axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
      if (!config.setRefreshCondition(error)) {
        return Promise.reject(error);
      }
      this._axiosInstance.interceptors.response.eject(interceptor);
      return this._handleRefreshToken(config, error);
    });
  };

  /**
   * Creates the FetchAPI instance and sets up required configurations and interceptors.
   * @private
   */
  private _create = (): void => {
    this._handleApplyAccessToken();
    this._handleSetupRefreshToken(this._refreshTokenConfig);
    const baseConfig = this._baseConfig;
    this.request = (
      requestConfig: AxiosRequestConfig,
    ): { axiosPromise: Promise<AxiosResponse>; axiosCancel: () => void; abortCancel: () => void } => {
      const axiosCancelToken = axios.CancelToken.source();
      const controller = new AbortController();
      const request = this._axiosInstance({
        cancelToken: axiosCancelToken.token,
        signal: controller.signal,
        ...baseConfig,
        ...requestConfig,
        headers: {
          ...baseConfig.headers,
          ...requestConfig.headers,
        },
        params: {
          ...baseConfig.params,
          ...requestConfig.params,
        },
      });
      return {
        axiosPromise: request,
        axiosCancel: axiosCancelToken.cancel,
        abortCancel: (): void => controller.abort.apply(controller),
        [this._reduxSagaCancel]: axiosCancelToken.cancel,
      };
    };
  };

  //#region For testing
  //#endregion
}
