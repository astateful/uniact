import createHistory from 'history/createBrowserHistory';

import render from './render';
import createClientStore from './store';

export default (routes, rootReducer, routeProps) => {
  const history = createHistory();

  const store = createClientStore(rootReducer, window.storeState, history);
  delete window.storeState;

  return render(store, history, routes, routeProps);
};
