import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { View } from 'reactjs';
import { SessionData, authSessionStorage } from '../packages/Auth/sessionStorage';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

export interface LoaderResponse {
  session: SessionData;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authSessionStorage.getSession(request);
  return json({
    session: session.data,
  });
};

const Page = () => {
  const { t } = useTranslation();
  const { session } = useLoaderData<typeof loader>();
  return (
    <View disableStrict>
      <View disableStrict>Test I18n: {t('welcome', { name: 'User' })}</View>
      Account Layout: {JSON.stringify(session)}
      <Outlet />
    </View>
  );
};

export default Page;
