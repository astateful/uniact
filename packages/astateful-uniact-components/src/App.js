import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

const App = ({ store, children }) => {
  return <Provider store={store}>{children}</Provider>;
};

App.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default App;
