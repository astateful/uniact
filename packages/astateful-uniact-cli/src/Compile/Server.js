import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import fs from 'fs';

import Compile from '../Compile';

export default class CompileServer extends Compile {
  constructor(cliPath, appPath, target, env, type) {
    super(cliPath, appPath, target, env, type);

    const es6Modules = env.es6Modules
      ? Object.keys(env.es6Modules).map(e => {
          return new RegExp(e, 'i');
        })
      : [];

    // webpack-node-externals will not resolve node_modules up the directory tree
    // in the way that typical package resolution works so we use a work-around here.
    // as a reference see: https://github.com/liady/webpack-node-externals/issues/39
    const externals = [];

    if (fs.existsSync(path.resolve(appPath, 'node_modules'))) {
      externals.push(nodeExternals({ whitelist: es6Modules }));
    }

    if (env.nodeModules) {
      externals.push(
        nodeExternals({
          whitelist: es6Modules,
          modulesDir: path.resolve(appPath, env.nodeModules),
        })
      );
    }

    this.config = {
      ...this.config,
      entry: ['@babel/polyfill', path.resolve(appPath, env.entry.server)],
      target: 'node', // https://webpack.github.io/docs/configuration.html#target
      node: {
        __dirname: false,
        __filename: false,
      },
      output: {
        libraryTarget: 'commonjs2',
        filename: 'server.js',
        chunkFilename: 'server.js',
        pathinfo: true,
        path: path.resolve(appPath, './build'),
      },
      devtool: 'source-map',
      // do not bundle anything from node_modules into the output
      // except certain libraries, such as ones which are written in
      // ES6 and thus are compiled as part of the application
      externals,
      plugins: this.config.plugins.concat(
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
      ),
    };
  }

  getBabelLoaderOptions(env) {
    const options = super.getBabelLoaderOptions(env);

    // only add react preset if we are building an isomorphic app
    // which implies there is a client/server combination present
    if (env.entry.client && env.entry.server) {
      options.presets.push(require.resolve('@babel/preset-react'));
    }

    options.presets.push([
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        targets: {
          node: 'current',
        },
      },
    ]);

    return options;
  }
}
