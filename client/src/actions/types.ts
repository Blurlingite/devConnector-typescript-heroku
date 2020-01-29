import { Post } from "../types/Post";

// export const SET_ALERT = "SET_ALERT";
// export const REMOVE_ALERT = "REMOVE_ALERT";
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
export const CLEAR_PROFILE = "CLEAR_PROFILE";
export const PROFILE_ERROR = "PROFILE_ERROR";
export const ACCOUNT_DELETED = "ACCOUNT_DELETED";
export const GET_REPOS = "GET_REPOS";

export enum ActionTypes {
  ADD_POST = "ADD_POST",
  GET_POST = "GET_POST",
  GET_POSTS = "GET_POSTS",
  DELETE_POST = "DELETE_POST",
  UPDATE_LIKES = "UPDATE_LIKES",
  ADD_COMMENT = "ADD_COMMENT",
  REMOVE_COMMENT = "REMOVE_COMMENT",
  POST_ERROR = "POST_ERROR",
  SET_ALERT = "SET_ALERT",
  REMOVE_ALERT = "REMOVE_ALERT"
}

export interface AddPostAction {
  type: ActionTypes.ADD_POST;
  post: Post;
}

export interface GetPostAction {
  type: ActionTypes.GET_POST;
  post: Post;
}

export interface GetPostsAction {
  type: ActionTypes.GET_POSTS;
  posts: Post[];
}

export interface DeletePostAction {
  type: ActionTypes.DELETE_POST;
  id: string;
}

export interface UpdateLikesAction {
  type: ActionTypes.UPDATE_LIKES;
  id: string;
  likes: { id: string; user: string };
}

export interface AddCommentAction {
  type: ActionTypes.ADD_COMMENT;
  comment: Post["comments"];
}

export interface RemoveCommentAction {
  type: ActionTypes.REMOVE_COMMENT;
  id: string;
}

export interface PostErrorAction {
  type: ActionTypes.POST_ERROR;
  msg: string;
  status: any;
}

export interface SetAlertAction {
  type: ActionTypes.SET_ALERT;
  msg: string;
  alertType: string;
  id: string;
}

export interface RemoveAlertAction {
  type: ActionTypes.REMOVE_ALERT;
  id: string;
}

export type PostActionTypes =
  | AddPostAction
  | GetPostAction
  | GetPostsAction
  | DeletePostAction
  | UpdateLikesAction
  | AddCommentAction
  | RemoveCommentAction
  | PostErrorAction;

export type AlertActionTypes = SetAlertAction | RemoveAlertAction;

export type AppActions = PostActionTypes | AlertActionTypes;
