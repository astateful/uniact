import {
  publicArtistsLoading,
  publicArtistsLoadingError,
  publicArtistsLoaded,
  publicArtistsClearing,
  publicArtistsCleared,
} from '../actions/public';

class Public {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  loadArtists = (page, count, key) => {
    return dispatch => {
      dispatch(publicArtistsLoading(key));

      return this.dataSource
        .get(`/feed/?type=popular&page=${page}&count=${count}`)
        .then(response => {
          // setup the promises to execute for each artist
          // a get request to fetch more information
          let artistPromises = [];
          response.forEach(popular => {
            artistPromises.push(
              this.dataSource.get(`/${popular.user.permalink}/`)
            );
          });

          // return instead of popular list, a list of artists!
          return Promise.all(artistPromises);
        })
        .then(response => {
          // filter the artists, returning potentially a little
          // less than what was requested. TODO: fix
          let seen = {};
          const unique = response.filter(artist => {
            return seen.hasOwnProperty(artist.id)
              ? false
              : (seen[artist.id] = true);
          });

          dispatch(publicArtistsLoaded(unique, key));
          return unique;
        })
        .catch(error => {
          dispatch(publicArtistsLoadingError(error, key));
        });
    };
  };

  clearArtists = key => {
    return dispatch => {
      dispatch(publicArtistsClearing(key));
      dispatch(publicArtistsCleared(key));
    };
  };
}

export default Public;
