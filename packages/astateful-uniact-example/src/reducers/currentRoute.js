import cloneDeep from 'lodash/cloneDeep';

import initialState from '../initialState';
import {
  ARTIST_LOADED,
  ARTIST_CLEARED,
  ARTIST_TRACKS_LOADED,
  ARTIST_TRACKS_CLEARED,
} from '../actions/artist';
import {
  PUBLIC_ARTISTS_LOADED,
  PUBLIC_ARTISTS_CLEARED,
} from '../actions/public';

export default (state = initialState.currentRoute, action) => {
  switch (action.type) {
    case PUBLIC_ARTISTS_LOADED: {
      const data = state[action.key] ? state[action.key] : {};
      return {
        ...state,
        [action.key]: { ...data, artists: action.artists },
      };
    }
    case PUBLIC_ARTISTS_CLEARED: {
      const newState = cloneDeep(state);
      if (action.key in newState) {
        if ('artists' in newState[action.key]) {
          delete newState[action.key]['artists'];
        }

        if (Object.keys(newState[action.key]).length === 0) {
          delete newState[action.key];
        }
      }

      return newState;
    }
    case ARTIST_LOADED: {
      const data = state[action.key] ? state[action.key] : {};
      return {
        ...state,
        [action.key]: { ...data, artist: action.artist },
      };
    }
    case ARTIST_CLEARED: {
      const newState = cloneDeep(state);
      if (action.key in newState) {
        if ('artist' in newState[action.key]) {
          delete newState[action.key]['artist'];
        }

        if (Object.keys(newState[action.key]).length === 0) {
          delete newState[action.key];
        }
      }

      return newState;
    }
    case ARTIST_TRACKS_LOADED: {
      const data = state[action.key] ? state[action.key] : {};
      return {
        ...state,
        [action.key]: { ...data, tracks: action.tracks },
      };
    }
    case ARTIST_TRACKS_CLEARED: {
      const newState = cloneDeep(state);
      if (action.key in newState) {
        if ('tracks' in newState[action.key]) {
          delete newState[action.key]['tracks'];
        }

        if (Object.keys(newState[action.key]).length === 0) {
          delete newState[action.key];
        }
      }

      return newState;
    }
    case '@@router/LOCATION_CHANGE': {
      const routerKey = (() => {
        if (typeof action.payload === 'string') {
          return action.payload;
        }
        return action.payload.pathname;
      })();

      const foundServerKey = Object.keys(state).find(key => {
        const parts = key.split('.');
        return parts[1] === 'server';
      });

      if (foundServerKey) {
        const parts = foundServerKey.split('.');
        if (parts[0] !== routerKey) {
          const newState = cloneDeep(state);
          delete newState[foundServerKey];
          return newState;
        }
      }
    }
  }

  return state;
};
