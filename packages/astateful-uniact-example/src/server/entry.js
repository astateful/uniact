import renderGenerator from './render';
import fileHandler from './file';
import thunkGenerator from '../thunks';
import DataSource from '../dataSource';

export default (server, Router, env, assets, session, appPath, send) => {
  const dataSource = new DataSource();

  const thunk = thunkGenerator(dataSource);
  const render = renderGenerator(assets, thunk);

  const serverRouter = new Router();

  server.use(serverRouter.routes());
  server.use(fileHandler(appPath, render, send));
};
