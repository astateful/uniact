import React from 'react';
import PropTypes from 'prop-types';

import { generateServerKey, generateClientKey } from './key';

export default Component => {
  class Preloader extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};

      const serverKey = generateServerKey(
        this.props.router,
        this.props.session
      );

      if (serverKey in this.props.currentRoute) {
        this.state.routeKey = serverKey;
      }
    }

    static propTypes = {
      router: PropTypes.object.isRequired,
      currentRoute: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired,
      thunk: PropTypes.object.isRequired,
      session: PropTypes.object,
    };

    static addPreloaders(thunk, match, session, routeKey) {
      return Component.addPreloaders(thunk, match, session, routeKey);
    }

    componentDidMount() {
      if (!this.state.routeKey) {
        const clientKey = generateClientKey(this.props.router);
        const preloaders = Preloader.addPreloaders(
          this.props.thunk,
          this.props.match,
          this.props.session,
          clientKey
        );

        preloaders.forEach(preloader => {
          this.props.dispatch(preloader);
        });

        this.setState({ routeKey: clientKey });
      }
    }

    render() {
      return <Component routeKey={this.state.routeKey} {...this.props} />;
    }
  }

  return Preloader;
};
