import { gql } from '@apollo/client';

export const getContinents = gql(/* GraphQL */ `
  query getContinents {
    continents {
      code
      name
    }
  }
`);
