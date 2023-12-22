import { Tree, addProjectConfiguration, generateFiles, names, updateJson } from '@nx/devkit';
import { getRootTsConfigPathInTree } from '@nx/js';
import * as path from 'path';
import { RemixLibGeneratorSchema } from './schema';
import { normalizeOptions } from './utils/normalize-options';

export const remixLibGenerator = async (tree: Tree, schema: RemixLibGeneratorSchema): Promise<void> => {
  const options = normalizeOptions(tree, schema);
  const resolvedOptions = {
    ...options,
    name: names(options.name).fileName,
  };
  if (resolvedOptions.name) {
    const projectRoot = `libs/${resolvedOptions.name}`;

    // Generate project.json
    addProjectConfiguration(tree, resolvedOptions.name, {
      tags: [],
      name: resolvedOptions.name,
      root: projectRoot,
      sourceRoot: `${projectRoot}/src`,
      projectType: 'library',
      targets: {
        lint: {
          executor: '@nx/linter:eslint',
          outputs: ['{options.outputFile}'],
          options: {
            lintFilePatterns: ['{projectRoot}/**/*.{ts,tsx,js,jsx}'],
            fix: true,
          },
        },
        typecheck: {
          executor: 'nx:run-commands',
          options: {
            cwd: '{projectRoot}',
            commands: ['tsc -p tsconfig.json --noEmit'],
            forwardAllArgs: false,
          },
        },
      },
    });

    // Generate files
    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, resolvedOptions);

    // Update tsconfig.base.json
    const baseTsConfig = getRootTsConfigPathInTree(tree) as string;
    updateJson(tree, baseTsConfig, json => {
      const paths_ = json?.compilerOptions?.paths;
      const paths = paths_ && typeof paths_ === 'object' ? paths_ : {};
      json.compilerOptions.paths = {
        ...paths,
        [options.projectName]: [`libs/${options.projectName}/src/index.ts`],
        [`${options.projectName}/server`]: [`libs/${options.projectName}/src/server.ts`],
      };

      return json;
    });
  } else {
    throw new Error('App name must be provided');
  }
};

export default remixLibGenerator;
