import createMemoryHistory from 'history/createMemoryHistory';

import render from './render';
import createServerStore from './store';
import preload from './preload';

export default async (
  assets,
  storeData,
  url,
  routes,
  rootReducer,
  routeProps = {}
) => {
  // shared history object needed for store creation, so that the
  // reducer can update the history, as well as for rendering, where the
  // history can update the reducer ( or something like that )
  const history = createMemoryHistory({
    initialEntries: [url],
  });

  const store = createServerStore(rootReducer, storeData, history);

  // perform preloading here; the store will be populated with the
  // preloaded data which will be used by the components being rendered.
  const { thunk } = routeProps;
  if (thunk) {
    await preload(routes, url, store, thunk);
  }

  const renderResult = render(assets, store, url, routes, routeProps);

  if (renderResult.redirect) {
    return { status: 302, redirect: renderResult.redirect };
  } else {
    return { status: 200, content: renderResult };
  }
};
