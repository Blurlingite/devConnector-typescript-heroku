// Section 9 Lecture 45
// CLEAR_PROFILE is used to clear a profile when logged out so old user's profile data is not still loaded into redux when you login with a different user
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_REPOS
} from "../actions/types";

// the initial state for profile (or most things would start out empty)
//these are not fields on the Profile object
const initialState = {
  profile: null, // contains all profile data. If we view another user's profile page, that data will go here also
  profiles: [], // contains state (data) for profile listing page (list of all profiles)
  repos: [], // when you get the Github repos they will go in here
  loading: true, // once you make a request you will set this to false b/c it will be done loading at that point
  error: {} // all errors in request go in here
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };

    // fill the empty profiles array above (in initialState) with profiles from the server
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null, // clears profile
        repos: [], // empty repos on the profile
        loading: false // done loading
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      };
    default:
      return state;
  }
}
