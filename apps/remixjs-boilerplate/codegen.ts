import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.PUBLIC_GRAPHQL_API,
  documents: ['app/graphql/**/*.ts*'],
  generates: {
    './app/graphql/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        inlineFragmentTypes: 'combine',
        // Thêm vào để tránh lỗi duplicate type
        addUnderscoreToArgsType: true,
        skipTypeNameForRoot: true,
      },
    },
  },
};

export default config;
