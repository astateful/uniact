const ARTIST_LOADING = 'ARTIST_LOADING';
const ARTIST_LOADING_ERROR = 'ARTIST_LOADING_ERROR';
const ARTIST_LOADED = 'ARTIST_LOADED';

const ARTIST_CLEARING = 'ARTIST_CLEARING';
const ARTIST_CLEARED = 'ARTIST_CLEARED';

const ARTIST_TRACKS_LOADING = 'ARTIST_TRACKS_LOADING';
const ARTIST_TRACKS_LOADING_ERROR = 'ARTIST_TRACKS_LOADING_ERROR';
const ARTIST_TRACKS_LOADED = 'ARTIST_TRACKS_LOADED';

const ARTIST_TRACKS_CLEARING = 'ARTIST_TRACKS_CLEARING';
const ARTIST_TRACKS_CLEARED = 'ARTIST_TRACKS_CLEARED';

// load artist

const artistLoading = key => {
  return {
    type: ARTIST_LOADING,
    key,
  };
};

const artistLoadingError = (error, key) => {
  return {
    type: ARTIST_LOADING_ERROR,
    error,
    key,
  };
};

const artistLoaded = (artist, key) => {
  return {
    type: ARTIST_LOADED,
    artist,
    key,
  };
};

// clear artist

const artistClearing = key => {
  return {
    type: ARTIST_CLEARING,
    key,
  };
};

const artistCleared = key => {
  return {
    type: ARTIST_CLEARED,
    key,
  };
};

// load artist tracks

const artistTracksLoading = key => {
  return {
    type: ARTIST_TRACKS_LOADING,
    key,
  };
};

const artistTracksLoadingError = (error, key) => {
  return {
    type: ARTIST_TRACKS_LOADING_ERROR,
    error,
    key,
  };
};

const artistTracksLoaded = (tracks, key) => {
  return {
    type: ARTIST_TRACKS_LOADED,
    tracks,
    key,
  };
};

// clear artist tracks

const artistTracksClearing = key => {
  return {
    type: ARTIST_TRACKS_CLEARING,
    key,
  };
};

const artistTracksCleared = key => {
  return {
    type: ARTIST_TRACKS_CLEARED,
    key,
  };
};

export {
  ARTIST_LOADING,
  ARTIST_LOADING_ERROR,
  ARTIST_LOADED,
  ARTIST_CLEARING,
  ARTIST_CLEARED,
  ARTIST_TRACKS_LOADING,
  ARTIST_TRACKS_LOADING_ERROR,
  ARTIST_TRACKS_LOADED,
  ARTIST_TRACKS_CLEARING,
  ARTIST_TRACKS_CLEARED,
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
};
