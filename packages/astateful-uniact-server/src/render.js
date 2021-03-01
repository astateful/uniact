import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderRoutes } from 'react-router-config';
import { ServerStyleSheet } from 'styled-components';

import Html from './Html';
import App from './App';

export default (assets, store, url, routes, routeProps) => {
  // needed for styled-component to collect and render the styles
  const sheet = new ServerStyleSheet();

  const context = {}; // needed for static router

  // renders the main element with the static router as the child
  // static router returns the component corresponding to the route.
  const pageElement = React.createElement(
    App,
    { store, context, url },
    renderRoutes(routes, routeProps)
  );

  // perform the rendering of the app here, or the inner portion of the website.
  // on this pass, the css styles will also be computed and stored via the context
  // which we will need to attach to the outer document shell when rendering again.
  // additionally redirects can be isomorphically handled as well.
  const appHtml = ReactDOMServer.renderToString(
    sheet.collectStyles(pageElement)
  );

  if (context.url) {
    // TODO: In the case that the user is already logged in, and we do not
    // want them to visit a public url, need a way to return them to the
    // referral path...is this even possible? we dont even know on the server
    // what the previous path was, so the isomorphic case cant execute.
    return { redirect: context.url };
  }

  const htmlElement = (
    <Html
      assets={assets()}
      styles={sheet.getStyleElement()}
      store={store}
      contentMarkup={appHtml}
    />
  );

  // now render the outer html, or shell, using the inner document html that was already
  // rendered. will not be re-rendered either here or on the client due to checksumming...
  return '<!doctype html>\n' + ReactDOMServer.renderToString(htmlElement);
};
