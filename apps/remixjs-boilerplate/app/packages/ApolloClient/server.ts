import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { authSessionStorage } from '../Auth/sessionStorage';

export const getApolloClientForSetupReact = async (request: Request) => {
  const session = await authSessionStorage.getSession(request);
  return new ApolloClient({
    cache: new InMemoryCache({
      resultCaching: false,
    }),
    ssrMode: true,
    link: ApolloLink.from([
      // Auth
      createHttpLink({
        headers: { Authorization: session.data.token ?? '' },
      }),
      // Upload
      createUploadLink({ uri: process.env.PUBLIC_GRAPHQL_API }),
    ]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
};

export const getApolloClientForRemixServer = async (request: Request) => {
  const session = await authSessionStorage.getSession(request);
  return new ApolloClient({
    cache: new InMemoryCache({
      resultCaching: false,
    }),
    ssrMode: true,
    link: ApolloLink.from([
      // Auth
      createHttpLink({
        uri: process.env.PUBLIC_GRAPHQL_API,
        headers: { Authorization: session.data.token ?? '' },
      }),
    ]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
};
