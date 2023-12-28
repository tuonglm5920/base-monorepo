import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { FC } from 'react';
import { View } from 'reactjs';
import { GetContinentsDocument } from '../graphql';
import { getApolloClientForRemixServer } from '../packages/ApolloClient/server';
import { loader as accountLayoutLoeader } from './_account';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const graphqlClient = await getApolloClientForRemixServer(request);
  const response = await graphqlClient.query({
    query: GetContinentsDocument,
  });
  return json({
    items: response.data.continents,
  });
};

const Index: FC = () => {
  const accountLayoutLoaderData = useRouteLoaderData<typeof accountLayoutLoeader>('routes/_account');
  const { items } = useLoaderData<typeof loader>();
  return (
    <View>
      <View disableStrict style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
        Dashboard page: {JSON.stringify(accountLayoutLoaderData?.session)}
      </View>
      <View tagName="ul">
        {items.map(item => (
          <View key={item.code} tagName="li" disableStrict>
            {item.name}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Index;
