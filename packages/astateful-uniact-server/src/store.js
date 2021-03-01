import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

export default (rootReducer, storeData, history) => {
  const rootReducerWithRouter = connectRouter(history)(rootReducer);

  const enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  );

  return createStore(rootReducerWithRouter, storeData, enhancer);
};
