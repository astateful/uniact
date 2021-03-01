// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./store.production.js');
} else if (process.env.NODE_ENV === 'development') {
  module.exports = require('./store.development.js');
} else {
  throw new Error(
    'An invalid NODE_ENV value caused the store to not be loaded.'
  );
}
