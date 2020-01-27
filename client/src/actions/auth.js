//See Section 8 Video 40
// we bring in axios b/c this is where we make our request
import axios from "axios";
import { setAlert } from "./alert";

// import these types from types.js
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";

import setAuthToken from "../utils/setAuthToken";
// Load User
export const loadUser = () => async dispatch => {
  // check for token in localStorage and if it's there, pass it to setAuthToken so it can set that global x-auth-token header (in setAuthToken.js)
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  // make the request
  try {
    // try to get a response by hitting this endpoint (which requires a token which we set with setAuthToken above)
    const res = await axios.get("/api/auth");

    // dispatch the USER_LOADED type along with the data you got from response (res.data)
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    // dispatch AUTH_ERROR if there is an error
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// This will register a User
// It takes in an object that has a name,email & password
// We use async await b/c we are making a request
// Everything on the left of "async dispatch" is stuff we take in.
// Everything on the right of "async dispatch" is us preparing what we took in and returning it
export const register = ({ name, email, password }) => async dispatch => {
  // We are building the request and this one needs a Content-Type header b/c we are sending data
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // put the stuff we took in into the request body but use JSON format
  const body = JSON.stringify({ name, email, password });

  try {
    // Send this back as the response
    // 1st param: the endpoint the response will submit to
    // 2nd param: the stuff in the request body
    // 3rd param: any configs we need (in this case the variable we made that holds the Content-Type)
    const res = await axios.post("/api/users", body, config);

    // the register is successful if your in the try block so dispatch the REGISTER_SUCCESS type
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    // dispatch the action of loading a user after logging in just so it runs immediately (otherwise no user info will be shown even if that user is logged in)
    dispatch(loadUser());
  } catch (err) {
    // otherwise the register has failed so dispatch the REGISTER_FAIL type
    // we don't do anything with payload in the types.js so we don't need it here

    // we want to get the array of errors from the "err" in the catch() so we can display them on the webpage. The errors passed into "err" comes from our backend that we made earlier in the course
    // we access the response's data b/c that is where the errors come from by using err.response.data.errors
    // the array is called "errors" (I think we gave it that name somewhere?)
    const errors = err.response.data.errors;

    // if there are errors, loop through them
    // for each error, dispatch the setAlert action (which takes in a message "error.msg" and an alertType "danger")
    // setAlert() is an action we made in alert.js in the "actions" folder. In alert.js we added a timeout variable in the parameter list but we initialized it in the parameter list so we don't need a 3rd parameter here.
    // After doing all that, we need to go to Register component in Register.js in our componenets folder and connect this (the auth action) to it
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
// most of this is the same as Register User above
// we just need email and password to login in
export const login = (email, password) => async dispatch => {
  // We are building the request and this one needs a Content-Type header b/c we are sending data
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // put the stuff we took in into the request body but use JSON format
  const body = JSON.stringify({ email, password });

  try {
    // Send this back as the response
    // 1st param: the endpoint the response will submit to (/api/auth b/c we are authenticating when we login the user)
    // 2nd param: the stuff in the request body
    // 3rd param: any configs we need (in this case the variable we made that holds the Content-Type)
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // dispatch the action of loading a user after logging in (otherwise no user info will be shown even if that user is logged in)
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout/ Clear Profile feature
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  // used to clear a profile after you logged out so old user's profile data is not still loaded into redux when you login with a different user
  dispatch({ type: CLEAR_PROFILE });
};
