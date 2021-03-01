import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default class Compile {
  constructor(cliPath, appPath, target, env) {
    const envDefines = env.defines ? env.defines : {};
    const nodeModules = env.nodeModules ? env.nodeModules : 'node_modules';
    const es6Modules = env.es6Modules ? env.es6Modules : {};

    const es6ModulesRegex = Object.keys(es6Modules).map(e => {
      return new RegExp(e, 'i');
    });

    // this is used to hack around the fact that there is no 'mainDir' support
    // for npm packages, thus it is hard to compile es6 only modules without
    // explictly providing a src folder, which in fact the client can provide us.
    // reference: https://github.com/nodejs/node/issues/14970
    const es6ModuleAliases = {};
    for (const es6Module in es6Modules) {
      const relPath =
        es6Modules[es6Module] === '/' ? '' : es6Modules[es6Module];
      es6ModuleAliases[es6Module] = `${es6Module}${relPath}`;
    }

    const exclude = modulePath => {
      return (
        /node_modules/.test(modulePath) &&
        !es6ModulesRegex.some(e => e.test(modulePath))
      );
    };

    const defines = {
      'process.env': {
        NODE_ENV: JSON.stringify(target),
      },
    };

    for (const envDefine in envDefines) {
      defines[envDefine] = JSON.stringify(envDefines[envDefine]);
    }

    this.config = {
      mode: target,
      context: appPath,
      // used to resolve webpack's loader packages. of course the
      // modules folder should be the path of the cliPath. also support
      // installation via yarn in which the node_modules of this package
      // are installed into the parent folder
      resolveLoader: {
        modules: [
          path.resolve(cliPath, 'node_modules'),
          path.resolve(cliPath, '../'),
        ],
        extensions: ['.js', '.json'],
        mainFields: ['loader', 'main'],
      },
      // needed in the case of, for example, external modules which
      // are not bundled, and therefore have to have their modules
      // resolved somehow...
      resolve: {
        extensions: ['*', '.js'],
        modules: [
          path.resolve(cliPath, 'node_modules'),
          path.resolve(cliPath, '../'),
          path.resolve(appPath, 'node_modules'),
          path.resolve(appPath, nodeModules),
        ],
        alias: es6ModuleAliases,
      },

      module: {
        rules: [
          {
            test: /\.js(x)?$/,
            exclude,
            use: {
              loader: 'babel-loader',
              options: this.getBabelLoaderOptions(env),
            },
          },
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader?importLoaders=true&localIdentName=[name]_[local]_[hash:base64:3]',
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000',
          },
          {
            test: /\.(ttf|eot)(\?[\s\S]+)?$/,
            loader: 'file-loader',
          },
          {
            test: /\.svg$/,
            loader: 'url-loader?limit=10000',
          },
          {
            test: /\.png$/,
            loader: 'url-loader?limit=10000',
            query: { mimetype: 'image/png' },
          },
          {
            test: /favicon.ico$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '/',
            },
          },
          {
            test: /\.(jpg)$/,
            loaders: ['url-loader?limit=10000'],
          },
        ],
      },

      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin(defines),
      ],
    };
  }

  getConfig() {
    return this.config;
  }

  getBabelLoaderOptions(env) {
    const plugins = [
      require.resolve('@babel/plugin-syntax-export-default-from'),
      require.resolve('@babel/plugin-transform-react-display-name'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      [
        require.resolve('babel-plugin-styled-components'),
        {
          ssr: true,
          displayName: true,
        },
      ],
    ];

    // only add react hot loading if we are building an isomorphic app
    // which implies there is a client/server combination present
    if (env.entry.client && env.entry.server) {
      plugins.push(require.resolve('react-hot-loader/babel'));
    }

    return {
      presets: [],
      plugins,
      cacheDirectory: true,
    };
  }

  run() {
    return new Promise((resolve, reject) => {
      const compileInstance = webpack(this.config);
      compileInstance.run((err, stats) => {
        if (err) reject(err);
        resolve(stats);
      });
    });
  }
}
