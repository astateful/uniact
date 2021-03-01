import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';

import App from './App';

const renderApp = (store, history, routes, routeProps, resolve) => {
  ReactDOM.hydrate(
    <AppContainer>
      <App store={store} history={history}>
        {renderRoutes(routes, routeProps)}
      </App>
    </AppContainer>,
    document.getElementById('react'),
    () => {
      resolve({ store, history });
    }
  );
};

export default (store, history, routes, routeProps) => {
  return new Promise((resolve, reject) => {
    renderApp(store, history, routes, routeProps, resolve);
  });
};
