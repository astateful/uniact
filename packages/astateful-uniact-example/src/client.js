import { entry, render } from 'astateful-uniact-client';
import { connectRouter } from 'connected-react-router';

import routes from './routes';
import rootReducer from './reducers';
import thunkGenerator from './thunks';

import DataSource from './dataSource';

const dataSource = new DataSource();

const thunk = thunkGenerator(dataSource);

entry(routes, rootReducer, { thunk })
  .then(({ store, history }) => {
    if (module.hot) {
      module.hot.accept('./routes', () => {
        const newRoutes = require('./routes').default;
        render(store, history, newRoutes);
      });

      module.hot.accept('./reducers', () => {
        const newRootReducer = require('./reducers').default;
        const newRootReducerWithRouter = connectRouter(history)(newRootReducer);

        store.replaceReducer(newRootReducerWithRouter);
        render(store, history, routes);
      });
    }

    return true;
  })
  .catch(error => console.log(error));
