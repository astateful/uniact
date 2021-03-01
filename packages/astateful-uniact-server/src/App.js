import React from 'react';
import PropTypes from 'prop-types';
import { App } from 'astateful-uniact-components';
import StaticRouter from 'react-router-dom/StaticRouter';

const app = ({ store, context, url, children }) => {
  return (
    <App store={store}>
      <StaticRouter location={url} context={context}>
        {children}
      </StaticRouter>
    </App>
  );
};

app.propTypes = {
  store: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default app;
