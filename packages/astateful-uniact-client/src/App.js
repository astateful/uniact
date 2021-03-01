import React from 'react';
import PropTypes from 'prop-types';
import { App } from 'astateful-uniact-components';
import { ConnectedRouter } from 'connected-react-router';

const app = ({ store, history, children }) => {
  return (
    <App store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </App>
  );
};

app.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default app;
