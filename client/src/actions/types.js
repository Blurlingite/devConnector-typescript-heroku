// types.js will hold all of our variables (consts)

// We wil use this const in multiple places across different files. So if we need to change the string, we can change it one time here and it will be changed everywhere else you used it
export const SET_ALERT = "SET_ALERT";
export const REMOVE_ALERT = "REMOVE_ALERT";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const GET_PROFILE = "GET_PROFILE";
export const GET_PROFILES = "GET_PROFILES";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
// used to clear a profile when logged out so old user's profile data is not still loaded into redux when you login with a different user
export const CLEAR_PROFILE = "CLEAR_PROFILE";
export const PROFILE_ERROR = "PROFILE_ERROR";
export const ACCOUNT_DELETED = "ACCOUNT_DELETED";
export const GET_REPOS = "GET_REPOS";
export const GET_POSTS = "GET_POSTS";
export const GET_POST = "GET_POST";
export const POST_ERROR = "POST_ERROR";
// this action fires off when you add a like or remove a like from a post
export const UPDATE_LIKES = "UPDATE_LIKES";
export const DELETE_POST = "DELETE_POST";
export const ADD_POST = "ADD_POST";
export const ADD_COMMENT = "ADD_COMMENT";
export const REMOVE_COMMENT = "REMOVE_COMMENT";
