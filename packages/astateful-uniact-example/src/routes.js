import Root from './components/Root';

import Index from './routes/Index';
import NotFound from './routes/NotFound';
import Artist from './routes/Artist';

const routes = [
  {
    component: Root,
    routes: [
      {
        path: '/',
        exact: true,
        component: Index,
      },
      {
        path: '/artist/:artist',
        exact: true,
        component: Artist,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
];

export default routes;
