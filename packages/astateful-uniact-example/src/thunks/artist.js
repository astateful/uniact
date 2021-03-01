import {
  artistLoading,
  artistLoadingError,
  artistLoaded,
  artistClearing,
  artistCleared,
  artistTracksLoading,
  artistTracksLoadingError,
  artistTracksLoaded,
  artistTracksClearing,
  artistTracksCleared,
} from '../actions/artist';

class Artist {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  loadArtist = (artistName, key) => {
    return dispatch => {
      dispatch(artistLoading(key));

      return this.dataSource
        .get(`/${artistName}/`)
        .then(response => {
          dispatch(artistLoaded(response, key));
          return response;
        })
        .catch(error => {
          dispatch(artistLoadingError(error, key));
        });
    };
  };

  clearArtist = key => {
    return dispatch => {
      dispatch(artistClearing(key));
      dispatch(artistCleared(key));
    };
  };

  loadTracks = (artistName, page, count, key) => {
    return dispatch => {
      dispatch(artistTracksLoading(key));

      return this.dataSource
        .get(`/${artistName}/?type=tracks&page=${page}&count=${count}`)
        .then(response => {
          dispatch(artistTracksLoaded(response, key));
          return response;
        })
        .catch(error => {
          dispatch(artistTracksLoadingError(error, key));
        });
    };
  };

  clearTracks = key => {
    return dispatch => {
      dispatch(artistTracksClearing(key));
      dispatch(artistTracksCleared(key));
    };
  };
}

export default Artist;
