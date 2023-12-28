import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { authSessionStorage } from '~/packages/Auth/sessionStorage';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authSessionStorage.guard({
    request,
    homeUrl: '/dashboard',
  });

  return null;
};

const AuthLayoutRoot = () => {
  return <Outlet />;
};

export default AuthLayoutRoot;
