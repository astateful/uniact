import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import Compile from '../Compile';

export default class CompileClient extends Compile {
  constructor(cliPath, appPath, target, env) {
    super(cliPath, appPath, target, env);

    const clientConfig = {
      ...this.config,
      entry: ['@babel/polyfill', path.resolve(appPath, 'src/client.js')],
      output: {
        path: path.resolve(appPath, 'build/assets'),
        publicPath: '/assets/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
      },
      plugins: this.config.plugins.concat(
        new AssetsPlugin({
          path: path.resolve(appPath, './build'),
          filename: 'assets.json',
          prettyPrint: true,
        })
      ),
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5, // The default limit is too small to showcase the effect
              minSize: 0, // This is example is too small to create commons chunks
            },
            vendor: {
              test: /node_modules/,
              chunks: 'initial',
              name: 'common',
              priority: 10,
              enforce: true,
            },
          },
        },
      },
    };

    if (target === 'development') {
      this.config = {
        ...clientConfig,
        devtool: 'inline-eval-cheap-source-map',
        plugins: clientConfig.plugins.concat(new webpack.NamedModulesPlugin()),
      };
    } else if (target === 'production') {
      this.config = {
        ...clientConfig,
        optimization: {
          ...clientConfig.optimization,
          minimizer: [
            new UglifyJsPlugin({
              parallel: true,
              sourceMap: true,
              uglifyOptions: {
                compress: false,
                mangle: true,
                ecma: 8,
              },
            }),
          ],
        },
        devtool: 'source-map',
        plugins: clientConfig.plugins.concat(
          new webpack.optimize.OccurrenceOrderPlugin()
        ),
      };
    }
  }

  getBabelLoaderOptions(env) {
    const options = super.getBabelLoaderOptions(env);

    // we always assume the client is a react app
    options.presets.push(require.resolve('@babel/preset-react'));

    // TODO: Provide some sort of external option for targeting certain
    // browser configurations. by default we remove too many in order
    // to support native async/await and would need to provide differential
    // build serving at some point anyway...
    options.presets.push([
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        // visit https://jamie.build/last-2-versions for reasoning
        targets: {
          browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
        },
      },
    ]);

    return options;
  }
}
