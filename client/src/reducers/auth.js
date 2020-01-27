// This file starts with Section 8 video 40
// we created 2 new types in types.js for this file: REGISTER_SUCCESS & REGISTER_FAIL and we use this import to bring them in so we can use them
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from "../actions/types";

// this is the initial state object, representing the initial state of auth.js
const initialState = {
  // we need the json webtoken, which we'll store in local storage, so we use localStorage.getItem("token") to get that token from local storage which should be under the name "token". This is a "vanilla" javascript function
  // We access local storage with localStorage and we want to get an item (the token) with getItem()
  token: localStorage.getItem("token"),
  // is set to null to begin with but will change once we send a request to register a user/login and if successful, isAuthenticated will be set to true
  // We also set it to null so we can check if it's null later, if it is you should restrict access to certain content
  isAuthenticated: null,
  // we use this to check to see if once we load a user, the loading is done. We will set to false once it is done
  loading: true,
  // once we send a request to get a user, that will be put in here
  user: null
};

// we have "state" and "action" as params for our export function b/c we want to put the initial state for auth.js in the root reducer (root reducer holds the state of all reducers to make access to all components easier). "initialState" is assigned to "state" so when we access the state we can say "state" instead of "initialState"
//the "action" gets dispatched from another file to here, which we then export as part of this export statement for use in other files
export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };

    // when a register of a user is successful we want the website to log them in automatically. We get a JSON webtoken, so we put that in local storage under the name "token" with localStorage.setItem("token", payload.token)    This is a key-value pair, just like how we do in a hashmap in Java. We access the actual token with payload.token since it is part of the payload
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: // login will do the same as registering
      localStorage.setItem("token", payload.token);
      return {
        ...state, // all of whatever is currently in the state
        ...payload, // all of whatever is currently in the payload
        isAuthenticated: true, // set to true b/c the register was a success
        loading: false // set to false b/c we have gotten a response (REGISTER_SUCCEESS) and its been loaded
      };

    case REGISTER_FAIL:
    case AUTH_ERROR: // we want this case to do the same thing as case REGISTER_FAIL so we put right after it
    // if the register failed, remove the token that was generated (generated for the 1st time) so they can't login. They can still try to register again, but they'll get a new token instead
    // removeItem() only needs the key to remove the token
    case LOGIN_FAIL: // does the same thing as "REGISTER_FAIL"
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem("token");
      return {
        ...state, // all of whatever is currently in the state
        token: null, // set token to null to take away the token
        isAuthenticated: false, // set to false b/c the register failed
        loading: false // even though register failed, it's still done loading so set to false
      };
    default:
      return state;
  }
}
