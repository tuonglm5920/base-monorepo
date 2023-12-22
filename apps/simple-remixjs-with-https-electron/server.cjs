/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */

const { createRequestHandler } = require('@remix-run/express');
const { broadcastDevReady, installGlobals } = require('@remix-run/node');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const sourceMapSupport = require('source-map-support');
const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const url = require('node:url');
(async () => {
  sourceMapSupport.install();
  installGlobals();

  /** @typedef {import('@remix-run/node').ServerBuild} ServerBuild */

  const BUILD_PATH = path.resolve('build/index.js');
  const VERSION_PATH = path.resolve('build/version.txt');

  const initialBuild = await reimportServer();
  const remixHandler =
    process.env.NODE_ENV === 'development'
      ? await createDevRequestHandler(initialBuild)
      : createRequestHandler({
          build: initialBuild,
          mode: initialBuild.mode,
        });

  const app = express();

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by');

  // Remix fingerprints its assets so we can cache forever.
  app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('public', { maxAge: '1h' }));

  app.use(morgan('tiny'));

  app.all('*', remixHandler);

  const server = https.createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app,
  );

  const port = 3000;
  server.listen(port, () => {
    console.log(`Express server listening on port ${port}`);

    if (process.env.NODE_ENV === 'development') {
      broadcastDevReady(initialBuild);
    }
  });

  /**
   * @returns {Promise<ServerBuild>}
   */
  async function reimportServer() {
    const stat = fs.statSync(BUILD_PATH);

    // convert build path to URL for Windows compatibility with dynamic `import`
    const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

    // use a timestamp query parameter to bust the import cache
    return require(BUILD_URL + '?t=' + stat.mtimeMs);
  }

  /**
   * @param {ServerBuild} initialBuild
   * @returns {Promise<import('@remix-run/express').RequestHandler>}
   */
  async function createDevRequestHandler(initialBuild) {
    let build = initialBuild;
    async function handleServerUpdate() {
      // 1. re-import the server build
      build = await reimportServer();
      // 2. tell Remix that this app server is now up-to-date and ready
      broadcastDevReady(build);
    }
    const chokidar = require('chokidar');
    chokidar
      .watch(VERSION_PATH, { ignoreInitial: true })
      .on('add', handleServerUpdate)
      .on('change', handleServerUpdate);

    // wrap request handler to make sure its recreated with the latest build for every request
    return async (req, res, next) => {
      try {
        return createRequestHandler({
          build,
          mode: 'development',
        })(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
})();
