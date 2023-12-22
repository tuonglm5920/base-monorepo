import { SessionStorage as RemixSessionStorage, TypedResponse } from '@remix-run/node';

export interface Session {
  userInfo: {
    username: string;
    email: string;
    avatar: string;
  };
  authentication: {
    type: 'Bearer' | 'Basic';
    token: string;
  };
}

export interface ISessionStorage {
  login: (params: {
    request: Request;
    email: string;
    password: string;
  }) => Promise<{ redirector: TypedResponse<void>; error: undefined } | { redirector: undefined; error: string }>;

  logout: (params: { request: Request }) => void;

  getSession: (params: {
    request: Request;
  }) => Promise<Awaited<ReturnType<RemixSessionStorage<Session>['getSession']>>['data']>;

  checkedAuthentication: (params: { request: Request }) => void;
}
