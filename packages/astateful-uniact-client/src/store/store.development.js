import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

export default (rootReducer, storeData, history) => {
  const rootReducerWithRouter = connectRouter(history)(rootReducer);

  const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  );

  return createStore(rootReducerWithRouter, storeData, enhancer);
};
