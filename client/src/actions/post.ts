import axios from "axios";
import { setAlert } from "./alert";
import { ActionTypes, AppActions } from "./types";
import { ThunkAction } from "redux-thunk";
import { Dispatch } from "redux";
import { AppState } from "../store";

export const getPosts = () => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    try {
      const res = await axios.get("/api/posts");

      dispatch({
        type: ActionTypes.GET_POSTS,
        posts: res.data
      });
    } catch (err) {
      dispatch({
        type: ActionTypes.POST_ERROR,
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  };
};

export const addLike = (id: string) => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    try {
      const res = await axios.put(`/api/posts/like/${id}`);

      dispatch({
        type: ActionTypes.UPDATE_LIKES,
        id: id,
        likes: res.data
      });
    } catch (err) {
      dispatch({
        type: ActionTypes.POST_ERROR,
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  };
};

export const removeLike = (id: string) => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    try {
      const res = await axios.put(`/api/posts/unlike/${id}`);

      dispatch({
        type: ActionTypes.UPDATE_LIKES,
        id: id,
        likes: res.data
      });
    } catch (err) {
      dispatch({
        type: ActionTypes.POST_ERROR,
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  };
};

export const deletePost = (
  id: string
): ThunkAction<Promise<void>, {}, {}, AppActions> => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);
    console.log("AAA");
    dispatch({
      type: ActionTypes.DELETE_POST,
      id: id
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: ActionTypes.POST_ERROR,
      msg: err.response.statusText,
      status: err.response.status
    });
  }
};

export const addPost = (
  formData: string
): ThunkAction<Promise<void>, {}, {}, AppActions> => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(`/api/posts`, formData, config);

    dispatch({
      type: ActionTypes.ADD_POST,
      post: res.data
    });

    dispatch(setAlert("Post Created", "success"));
  } catch (err) {
    dispatch({
      type: ActionTypes.POST_ERROR,
      msg: err.response.statusText,
      status: err.response.status
    });
  }
};

export const getPost = (id: string) => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);

      dispatch({
        type: ActionTypes.GET_POST,
        post: res.data
      });
    } catch (err) {
      dispatch({
        type: ActionTypes.POST_ERROR,
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  };
};

export const addComment = (
  postId: string,
  formData: string
): ThunkAction<Promise<void>, {}, {}, AppActions> => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );

    dispatch({
      type: ActionTypes.ADD_COMMENT,
      comment: res.data
    });

    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: ActionTypes.POST_ERROR,
      msg: err.response.statusText,
      status: err.response.status
    });
  }
};

export const deleteComment = (
  postId: string,
  commentId: string
): ThunkAction<Promise<void>, {}, {}, AppActions> => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: ActionTypes.REMOVE_COMMENT,
      id: commentId
    });

    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: ActionTypes.POST_ERROR,
      msg: err.response.statusText,
      status: err.response.status
    });
  }
};
