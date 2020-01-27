// Section 11 Lecture 60 - Post Reducer, Action & Initial
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };

    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };

    case ADD_POST:
      return {
        ...state,
        // "...state.posts" makes a copy of all the posts in the state. Then we add the new post that comes in with the payload. We put these things in an array b/c it's just a collection of posts, and we assign it to the "posts" field
        // Any component that uses the "posts" part of the state will have access to the new post
        // we put payload first so that the newest post is the first and will be displayed above the older ones. If you want it to be at the bottom, just switch the order to ...state.posts,payload
        posts: [payload, ...state.posts],
        loading: false
      };

    case DELETE_POST:
      return {
        ...state,
        // we use filter() to filter out the one post that got deleted so it doesn't show up anymore. It got deleted from the server, so we need to delete it from the state (in the redux container)
        // If the post's ID (post._id) is equal to the ID in the payload ("payload", since only id is in the payload as shown in post.js in the "actions" folder)
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case UPDATE_LIKES:
      return {
        ...state,

        // for each post: If the post's ID is equal to the payload's ID (b/c we sent the post's ID through the payload) that means this is the correct post that we are adding/removing a like to. If we have the correct post, return the post's state (containing that post's data) which is "...post"
        // Also, we are setting the "likes" field of the post object to the amount of likes on the payload (payload.likes). When you like or unlike a post, that change will be in the payload.
        // Else (:), return the post as it is (if it's not the one we are looking for), "post"
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };

    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      };

    default:
      return state;
  }
}
