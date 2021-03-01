import { matchRoutes } from 'react-router-config';
import { generateServerKey } from 'astateful-uniact-components';

export default (routes, url, store, thunk) => {
  let preloaders = [];

  const storeState = store.getState();
  const { router, session } = storeState;

  const branch = matchRoutes(routes, url);
  branch.forEach(({ route, match }) => {
    if (match.isExact) {
      // on server we only have the location from the router, but anyway
      // the key pertains to the entire route so it is generated for a single
      // page in a static way so that the client can read it deterministically
      const serverKey = generateServerKey(router, session);

      const { addPreloaders } = route.component;
      if (addPreloaders instanceof Function) {
        const p = addPreloaders(thunk, match, session, serverKey);
        preloaders = [...preloaders, ...p];
      }
    }
  });

  const preloaderPromises = preloaders.map(preloader =>
    store.dispatch(preloader)
  );

  return Promise.all(preloaderPromises);
};
