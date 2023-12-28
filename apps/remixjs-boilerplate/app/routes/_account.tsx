import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'reactjs';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { SessionData, authSessionStorage } from '~/packages/Auth/sessionStorage';

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
  const { t, i18n } = useTranslation();
  const { session } = useLoaderData<typeof loader>();
  const [langState, setLangState] = useState(i18n.language);

  useEffect(() => {
    setLangState(i18n.language);
  }, [i18n.language]);

  const handleChange = (lang: 'en' | 'fr') => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setLangState(lang);
      i18n.changeLanguage(lang);
    }
  };

  return (
    <View disableStrict>
      <View disableStrict className="hidden lg:inline-block">
        Language:{' '}
        <View className="inline-flex gap-3">
          <View tagName="label" disableStrict>
            EN <input type="checkbox" checked={langState === 'en'} onChange={handleChange('en')} />
          </View>
          <View tagName="label" disableStrict>
            FR <input type="checkbox" checked={langState === 'fr'} onChange={handleChange('fr')} />
          </View>
        </View>
      </View>
      <View disableStrict>Test I18n: {t('welcome', { name: 'User' })}</View>
      Account Layout: {JSON.stringify(session)}
      <Outlet />
    </View>
  );
};

export default Page;
