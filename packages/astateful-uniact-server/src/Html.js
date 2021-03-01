import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const stringifyForwardSlashes = json => {
  return JSON.stringify(json).replace(/\//g, '\\/');
};

const Html = ({ assets, store, contentMarkup, styles }) => {
  const webpageHead = Helmet.rewind();
  const htmlAttributes = webpageHead.htmlAttributes.toComponent();

  const storeState = store.getState();

  const html = (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...htmlAttributes}>
      <head>
        {webpageHead.title.toComponent()}
        {webpageHead.meta.toComponent()}
        {webpageHead.link.toComponent()}
        {webpageHead.script.toComponent()}
        {assets.main &&
          assets.main.css && (
            <link
              rel="stylesheet"
              type="text/css"
              href={assets.main.css}
              media="screen"
            />
          )}
        {styles}
        {assets.icon && <link rel="shortcut icon" href={assets.icon} />}
      </head>

      <body>
        <div id="react" dangerouslySetInnerHTML={{ __html: contentMarkup }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.storeState=JSON.parse(${JSON.stringify(
              stringifyForwardSlashes(storeState)
            )}
            )`,
          }}
          charSet="UTF-8"
        />
        {assets.common &&
          assets.common.js && <script src={assets.common.js} charSet="UTF-8" />}
        {assets.main &&
          assets.main.js && <script src={assets.main.js} charSet="UTF-8" />}
      </body>
    </html>
  );

  return html;
};

Html.propTypes = {
  assets: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  contentMarkup: PropTypes.string.isRequired,
  styles: PropTypes.node,
};

export default Html;
