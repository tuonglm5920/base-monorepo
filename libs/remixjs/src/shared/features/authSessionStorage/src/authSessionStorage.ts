import {
  Session,
  SessionIdStorageStrategy,
  SessionStorage,
  TypedResponse,
  createCookieSessionStorage,
  redirect,
} from '@remix-run/node';
import { keys } from 'ramda';

/**
 * Manages authentication-related sessions using Remix's session storage.
 */
export class AuthSessionStorage<Data extends Record<string, any>> {
  protected cookieKey: string = 'clientId';
  /** Remix session storage instance */
  private _storage: SessionStorage<Data, Data>;
  /** URL to redirect to upon login */
  private _loginUrl: string;

  constructor({ loginUrl = '/login', options }: { loginUrl?: string; options?: SessionIdStorageStrategy['cookie'] }) {
    this._loginUrl = loginUrl;
    this._storage = createCookieSessionStorage<Data, Data>({
      cookie: {
        ...options,
        name: options?.name ?? this.cookieKey,
      },
    });
  }

  /**
   * Retrieves the session based on the request.
   * @param request - The request object.
   * @returns A Promise resolving to the session data.
   */
  public getSession = (request: Request): Promise<Session<Data, Data>> => {
    const cookie = request.headers.get('Cookie');
    return this._storage.getSession(cookie);
  };

  /**
   * Creates a new session or updates an existing session.
   * @param request - The request object.
   * @param sessionData - The data to be stored in the session.
   * @param remember - Indicates whether to remember the session.
   * @param redirectTo - URL to redirect to after session creation.
   * @returns A Promise resolving to void.
   * @throws Throws a redirect to the specified URL.
   */
  public createSession = async ({
    request,
    sessionData,
    remember,
    redirectTo,
  }: {
    request: Request;
    sessionData: Data;
    remember: boolean;
    redirectTo: string;
  }): Promise<TypedResponse<never>> => {
    const session = await this.getSession(request);
    keys(sessionData).forEach(key => {
      // @ts-ignore
      session.set(key, sessionData[key]);
    });
    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await this._storage.commitSession(session, {
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        }),
      },
    });
  };

  /**
   * Destroys the session and redirects to the login URL.
   * @param request - The request object.
   * @returns A Promise resolving to void.
   */
  public destroySession = async (request: Request): Promise<void> => {
    const session = await this.getSession(request);
    redirect(this._loginUrl, {
      headers: {
        'Set-Cookie': await this._storage.destroySession(session),
      },
    });
    return;
  };

  /**
   * Guards routes by checking session existence and returns session data.
   * @param request - The request object.
   * @param homeUrl - URL to redirect to if the user is already on the login page. Defaults to '/'.
   * @returns A Promise resolving to the session data.
   * @throws Throws a redirect to either homeUrl or the login URL with appropriate parameters.
   */
  public guard = async ({ request, homeUrl = '/' }: { request: Request; homeUrl?: string }): Promise<Data> => {
    const redirectTo = new URL(request.url).pathname;

    const session = await this.getSession(request);

    if (session.data && redirectTo === this._loginUrl) {
      throw redirect(homeUrl);
    }

    if (!session.data) {
      const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
      throw redirect(`${this._loginUrl}?${searchParams}`);
    }

    // @ts-ignore
    return session.data;
  };
}
