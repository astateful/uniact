const PUBLIC_ARTISTS_LOADING = 'PUBLIC_ARTISTS_LOADING';
const PUBLIC_ARTISTS_LOADING_ERROR = 'PUBLIC_ARTISTS_LOADING_ERROR';
const PUBLIC_ARTISTS_LOADED = 'PUBLIC_ARTISTS_LOADED';

const PUBLIC_ARTISTS_CLEARING = 'PUBLIC_ARTISTS_CLEARING';
const PUBLIC_ARTISTS_CLEARED = 'PUBLIC_ARTISTS_CLEARED';

// load public artists

const publicArtistsLoading = key => {
  return {
    type: PUBLIC_ARTISTS_LOADING,
    key,
  };
};

const publicArtistsLoadingError = (error, key) => {
  return {
    type: PUBLIC_ARTISTS_LOADING_ERROR,
    error,
    key,
  };
};

const publicArtistsLoaded = (artists, key) => {
  return {
    type: PUBLIC_ARTISTS_LOADED,
    artists,
    key,
  };
};

// clear public artists

const publicArtistsClearing = key => {
  return {
    type: PUBLIC_ARTISTS_CLEARING,
    key,
  };
};

const publicArtistsCleared = key => {
  return {
    type: PUBLIC_ARTISTS_CLEARED,
    key,
  };
};

export {
  PUBLIC_ARTISTS_LOADING,
  PUBLIC_ARTISTS_LOADING_ERROR,
  PUBLIC_ARTISTS_LOADED,
  PUBLIC_ARTISTS_CLEARING,
  PUBLIC_ARTISTS_CLEARED,
  publicArtistsLoading,
  publicArtistsLoadingError,
  publicArtistsLoaded,
  publicArtistsClearing,
  publicArtistsCleared,
};
