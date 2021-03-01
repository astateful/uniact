import path from 'path';
import minimist from 'minimist';
import fs from 'fs-extra';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import router from 'koa-router';
import koaWebpack from 'koa-webpack';
import send from 'koa-send';
import session from 'koa-session';
import http from 'http';

import CompileServer from './Compile/Server.js';
import CompileClient from './Compile/Client.js';

const run = async () => {
  const args = minimist(process.argv.slice(2));
  const target = args['target'];
  const relEnvPath = args['environment'];

  const appPath = process.cwd();
  const cliPath = path.resolve(__dirname, '..');

  const envPath = path.resolve(appPath, relEnvPath);
  const env = require(envPath);

  fs.emptyDirSync(path.resolve(appPath, './build'));

  // configure global koa modules
  const app = new Koa();
  app.use(bodyParser());

  if (env.run.cors) {
    // not all configurations use cors
    const corsConfig = Object.assign({}, env.run.cors, {
      origin: ctx => {
        const inputOrigin = ctx.request.header.origin
          ? ctx.request.header.origin
          : '*';
        if (env.run.cors.origin instanceof Array) {
          if (env.run.cors.origin.includes(inputOrigin)) {
            return inputOrigin;
          }
        }

        return env.run.cors.origin === inputOrigin ? env.run.cors.origin : '';
      },
    });

    app.use(cors(corsConfig));
  }

  if (env.build.entry.server) {
    const buildServer = new CompileServer(cliPath, appPath, target, env.build);
    const serverStats = await buildServer.run();
    console.log(
      serverStats.toString({
        chunks: false,
        colors: true,
      })
    );

    // in development, cannot immediately call the assets since they dont exist
    // until webpack has finished compiling. for production they already exist however
    // there is no additional overhead in wrapping the path in a function
    const assetPathsFile = path.resolve(appPath, './build/assets.json');
    const assets = () => require(assetPathsFile);

    // once the rest server has been compiled, execute it to perform
    // the initialization of routes and middleware, whatever else is needed
    const compiledServerPath = path.resolve(appPath, './build/server.js');
    const compiledServer = require(compiledServerPath).default;
    await compiledServer(app, router, env.run, assets, session, appPath, send);

    let server = http.createServer(app.callback());

    if (env.build.entry.client) {
      // do not start the server right away, instead compile the client
      // otherwise we would block execution of the client compilation
      const buildClient = new CompileClient(
        cliPath,
        appPath,
        target,
        env.build
      );

      if (target === 'production') {
        const clientStats = await buildClient.run();
        console.log(
          clientStats.toString({
            chunks: false,
            colors: true,
          })
        );
      }

      // for webpack hmr with client and server builds
      // TODO: support webpack hmr for pure server builds?
      if (target === 'development') {
        delete require.cache[assetPathsFile];

        const koaWebpackMiddleware = await koaWebpack({
          config: buildClient.getConfig(),
          hotClient: { server, port: env.run.port, host: env.run.host },
          devMiddleware: {
            quiet: false,
            noInfo: false,
            inline: true,
            lazy: false,
            publicPath: '/assets',
            headers: { 'Access-Control-Allow-Origin': '*' },
            stats: { colors: true },
          },
        });

        app.use(koaWebpackMiddleware);
      }
    }

    if (!server.listening) {
      server.listen(env.run.port, env.run.host, async error => {
        if (error) throw error;

        console.log(
          `${target} server listening on ${env.run.host}:${env.run.port}`
        );
      });
    }

    return true;
  }

  throw new Error('No valid configuration found');
};

run().catch(e => console.log(e));
