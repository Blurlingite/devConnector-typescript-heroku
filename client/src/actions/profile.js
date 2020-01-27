import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  GET_PROFILES,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS
} from "./types";

// get current user's profile of whatever user that is logged in
export const getCurrentProfile = () => async dispatch => {
  try {
    // "/api/profile/me" comes from your backend in the route in "routes" folder in profile.js
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all profiles - Section 10 Lecture 53

export const getProfiles = () => async dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });
  try {
    // "/api/profile" comes from your backend in the route in "routes" folder in profile.js
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get profile by ID - Section 10 Lecture 53

// must take in "userId" b/c we are getting it by the user ID not the profile ID
export const getProfileById = userId => async dispatch => {
  try {
    // "/api/profile/me" comes from your backend in the route in "routes" folder in profile.js
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all GitHub repos - Section 10 Lecture 53

// takes in the github username ("username")
export const getGithubRepos = username => async dispatch => {
  try {
    // "/api/profile/me" comes from your backend in the route in "routes" folder in profile.js
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update a profile
// we need the formData variable we made in some other file b/c that has all the form data
// we need the "history" object b/c it has a method called "push" that we can use to redirect to a different route ( a client side route) after submitting the form. This is how you typically redirect in an action, you can't use <Redirect> like how we do in components
// "edit" is going to be used to determine if we are making a new profile or updating a new one. If we are updating, we'll set it to true, if not change it to false. It is false by default
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.post("/api/profile", formData, config);

    // we use GET_PROFILE to get the profile we just made
    // the payload's "res.data" is the actual info in the profile
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    // set an alert
    // if there was an edit ("?"), say "Profile Updated", otherwise (":") say "Profile Created"
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    // if there was not an edit, but you are creating a new profile (if ur came to this action you would be) then redirect to the "/dashboard" endpoint, which is the dashboard page in the browser
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    // see auth.js in "actions" folder for comments
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add Experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // we made Experience use PUT requests in the backend instead of POST
    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    // set an alert
    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    // see auth.js in "actions" folder for comments
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add Education

export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // we made Education use PUT requests in the backend instead of POST
    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    // set an alert
    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    // see auth.js in "actions" folder for comments
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete experience
// we pass in a param we named "id". So it will take in an ID
export const deleteExperience = id => async dispatch => {
  try {
    // we have to use backticks (`) instead of quotes b/c we have a path variable in the URL. That path variable is the ID of the experience (${id})
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete education

// we pass in a param we named "id". So it will take in an ID
export const deleteEducation = id => async dispatch => {
  try {
    // we have to use backticks (`) instead of quotes b/c we have a path variable in the URL. That path variable is the ID of the experience (${id})
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete account & profile

// no params needed, it will know which account to target by the JSON webtoken
export const deleteAccount = () => async dispatch => {
  // ask for a confirmation before deleting the account
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      // we have to use backticks (`) instead of quotes b/c we have a path variable in the URL. That path variable is the ID of the experience (${id})
      await axios.delete("/api/profile");

      // no payload needed
      dispatch({
        type: CLEAR_PROFILE
      });

      dispatch({
        type: ACCOUNT_DELETED
      });

      dispatch(setAlert("Your account has been permanently deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
