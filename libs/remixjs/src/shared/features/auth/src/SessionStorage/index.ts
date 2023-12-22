import { createCookieSessionStorage, redirect, SessionStorage as RemixSessionStorage } from '@remix-run/node';
import axios, { AxiosResponse } from 'axios';
import { ISessionStorage, Session } from './interface';

class SessionStorage implements ISessionStorage {
  private _storage: RemixSessionStorage<Session>;

  constructor() {
    this._storage = createCookieSessionStorage({
      cookie: {
        name: '_session', // use any name you want here
        sameSite: 'lax', // this helps with CSRF
        path: '/', // remember to add this so the cookie will work in all routes
        httpOnly: true, // for security reasons, make this cookie http only
        // FIXME: chưa config đc env
        secrets: ['A'], // process.env.SESSION_SECRET.split(','), // replace this with an actual secret
        // FIXME: chưa config đc env
        secure: process.env.NODE_ENV === 'production', // enable this in prod only
      },
    });
  }

  public login: ISessionStorage['login'] = async ({ email, password, request }) => {
    try {
      const session = await this._storage.getSession(request.headers.get('Cookie'));
      const response: AxiosResponse<{
        info: Session;
        message: string;
      }>['data'] = await Promise.resolve({
        info: {
          userInfo: {
            avatar: '',
            email,
            password,
            username: 'Tuong',
          },
          authentication: {
            token: 'Hello',
            type: 'Bearer',
          },
        },
        message: 'Logged in',
      });
      session.set('userInfo', response.info.userInfo);
      session.set('authentication', response.info.authentication);
      return {
        redirector: redirect('/', {
          headers: {
            'Set-Cookie': await this._storage.commitSession(session),
          },
        }),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: error.response?.data,
        };
      }
      return {
        error,
      };
    }
  };

  public logout: ISessionStorage['logout'] = async ({ request }) => {
    const session = await this._storage.getSession(request.headers.get('Cookie'));
    await Promise.resolve({ message: 'Logged out' });
    // Return redirect không được
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await this._storage.destroySession(session),
      },
    });
  };

  public getSession: ISessionStorage['getSession'] = async ({ request }) => {
    const session = await this._storage.getSession(request.headers.get('Cookie'));
    return session.data;
  };

  public checkedAuthentication: ISessionStorage['checkedAuthentication'] = async ({ request }) => {
    const session = await this._storage.getSession(request.headers.get('Cookie'));
    if (!session.data.authentication?.token) {
      throw redirect('/login');
    }
  };
}

export const storage = new SessionStorage();
