// created in Section 8 video 41

// we only import axios b/c we want a global header (that header will be x-auth-token, which holds the JSON web token. The idea is that we have the token always in the global header so we always have it when we need to send any request (rather than picking and choosing which requests to send the token in with))
import axios from "axios";

// the token we pass in will come from localStorage
const setAuthToken = token => {
  // if there is a token in localStorage,
  if (token) {
    // set global header to x-auth-token
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    // else, delete the x-auth-token global header (you can't have a header with no value or you'll get an error)
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
