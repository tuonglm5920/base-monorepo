import { AuthSessionStorage } from 'remixjs/server';

export interface SessionData {
  token: string;
  role: string;
}
export const authSessionStorage = new AuthSessionStorage<SessionData>({
  loginUrl: '/login', // URL to redirect to upon login
  options: {},
});
