import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { preloader } from 'astateful-uniact-components';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Alert,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from 'reactstrap';

class Index extends React.Component {
  static addPreloaders(thunk, match, session, routeKey) {
    const preloaders = [];

    preloaders.push(dispatch => {
      return dispatch(thunk.public.loadArtists(1, 20, routeKey));
    });

    return preloaders;
  }

  static propTypes = {
    currentRoute: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    routeKey: PropTypes.string,
    thunk: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.props.dispatch(
      this.props.thunk.public.clearArtists(this.props.routeKey)
    );
  }

  render() {
    let artists = (
      <Col>
        <Alert color="info">
          <strong>Artists Loading</strong>
          &nbsp;The artists are currently being loaded...
        </Alert>
      </Col>
    );

    if (this.props.routeKey in this.props.currentRoute) {
      if ('artists' in this.props.currentRoute[this.props.routeKey]) {
        if (this.props.currentRoute[this.props.routeKey].artists.length > 0) {
          artists = this.props.currentRoute[this.props.routeKey].artists.map(
            artist => {
              let description = 'No description available';
              if (artist.description) {
                if (artist.description.length > 100) {
                  // fails for character sizes > 1 byte !!!
                  description = artist.description.substring(0, 100) + '...';
                } else {
                  description = artist.description;
                }
              }

              return (
                <Col xs="12" md="3" key={artist.id}>
                  <Card>
                    <CardImg width="200" height="200" src={artist.avatar_url} />
                    <CardBody>
                      <CardTitle>
                        <Link to={`/artist/${artist.permalink}`}>
                          {artist.username}
                        </Link>
                      </CardTitle>
                      <CardSubtitle>{description}</CardSubtitle>
                      <CardText>
                        <strong>Tracks</strong> {artist.track_count}
                        <br />
                        <strong>Playlists</strong> {artist.playlist_count}
                        <br />
                        <strong>Likes</strong> {artist.likes_count}
                        <br />
                        <strong>Followers</strong> {artist.followers_count}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              );
            }
          );
        } else {
          artists = (
            <Col>
              <Alert color="warning">
                <strong>No Artists Found</strong>
                &nbsp;Currently there are no artists to display.
              </Alert>
            </Col>
          );
        }
      }
    }

    return (
      <Row>
        <Col>
          <h3>Artists</h3>
          <Row>{artists}</Row>
        </Col>
      </Row>
    );
  }
}

export default connect(state => {
  return {
    currentRoute: state.currentRoute,
    router: state.router,
  };
})(preloader(Index));
