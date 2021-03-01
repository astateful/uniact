import { entry } from 'astateful-uniact-server';
import cloneDeep from 'lodash/cloneDeep';

import routes from '../routes';
import rootReducer from '../reducers';
import initialState from '../initialState';

export default (assets, thunk) => {
  return ctx => {
    const storeData = cloneDeep(initialState);

    return entry(assets, storeData, ctx.req.url, routes, rootReducer, {
      thunk,
    });
  };
};
