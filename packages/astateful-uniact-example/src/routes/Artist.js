import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { preloader } from 'astateful-uniact-components';
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

class Artist extends React.Component {
  static addPreloaders(thunk, match, session, routeKey) {
    const preloaders = [];
    preloaders.push(dispatch =>
      dispatch(thunk.artist.loadArtist(match.params.artist, routeKey))
    );

    preloaders.push(dispatch =>
      dispatch(thunk.artist.loadTracks(match.params.artist, 1, 20, routeKey))
    );

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
      this.props.thunk.artist.clearArtist(this.props.routeKey)
    );
    this.props.dispatch(
      this.props.thunk.artist.clearTracks(this.props.routeKey)
    );
  }

  render() {
    let tracks = (
      <Col>
        <Alert color="warning">
          <strong>No Tracks Found</strong>
          &nbsp;Currently there are no tracks to display.
        </Alert>
      </Col>
    );

    let username = <span>Loading...</span>;

    if (this.props.routeKey in this.props.currentRoute) {
      if ('tracks' in this.props.currentRoute[this.props.routeKey]) {
        if (this.props.currentRoute[this.props.routeKey].tracks.length > 0) {
          tracks = this.props.currentRoute[this.props.routeKey].tracks.map(
            track => {
              let description = 'No description available';
              if (track.description) {
                if (track.description.length > 100) {
                  // fails for character sizes > 1 byte !!!
                  description = track.description.substring(0, 100) + '...';
                } else {
                  description = track.description;
                }
              }

              let streamPopup = "javascript:window.open('";
              streamPopup += track.stream_url;
              streamPopup += "');";

              let title = track.title ? track.title : 'No title available';

              return (
                <Col key={track.id} xs="12" md="3">
                  <Card>
                    <CardImg width="200" height="200" src={track.thumb} />
                    <CardBody>
                      <CardTitle>
                        <a href={streamPopup}>{title}</a>
                      </CardTitle>
                      <CardSubtitle>{description}</CardSubtitle>
                      <CardText>
                        <strong>Download Count</strong> {track.download_count}
                        <br />
                        <strong>Duration</strong> {track.duration}
                        <br />
                        <strong>Genre</strong> {track.genre}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              );
            }
          );
        } else {
          tracks = (
            <Col>
              <Alert color="warning">
                <strong>No Tracks Found</strong>
                &nbsp;Currently there are no tracks to display.
              </Alert>
            </Col>
          );
        }
      }

      if ('artist' in this.props.currentRoute[this.props.routeKey]) {
        if (this.props.currentRoute[this.props.routeKey].artist.username) {
          username = this.props.currentRoute[this.props.routeKey].artist
            .username;
        } else {
          username = '...';
        }
      }
    }

    return (
      <div>
        <h3>Tracks for {username}</h3>
        <Row>{tracks}</Row>
      </div>
    );
  }
}

export default connect(state => {
  return {
    currentRoute: state.currentRoute,
    router: state.router,
  };
})(preloader(Artist));
