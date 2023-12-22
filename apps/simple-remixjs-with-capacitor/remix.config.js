/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  // General
  tailwind: true,
  serverModuleFormat: 'cjs',
  watchPaths: () => require('@nx/remix').createWatchPaths(__dirname),
};
