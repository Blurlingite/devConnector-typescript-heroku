import {
  PostActionTypes,
  ActionTypes,
  GetPostsAction,
  GetPostAction,
  AddPostAction,
  DeletePostAction,
  UpdateLikesAction,
  AddCommentAction,
  RemoveCommentAction,
  PostErrorAction
} from "../actions/types";

const initialState = {
  posts: [],
  post: {
    user: null,
    text: "string",
    name: "string",
    avatar: "string",
    likes: [
      {
        user: null
      }
    ],
    comments: [
      {
        _id: "string",
        user: null,
        text: "string",
        name: "string",
        avatar: "string",
        date: Date
      }
    ],
    date: Date
  },
  loading: true,
  error: {}
};

export default function(state = initialState, action: PostActionTypes) {
  switch (action.type) {
    case ActionTypes.GET_POSTS: {
      const typedAction = action as GetPostsAction;
      return {
        ...state,
        posts: typedAction.posts,
        loading: false
      };
    }

    case ActionTypes.GET_POST: {
      const typedAction = action as GetPostAction;
      return {
        ...state,
        post: typedAction.post,
        loading: false
      };
    }

    case ActionTypes.ADD_POST:
      const typedAction = action as AddPostAction;
      return {
        ...state,
        post: [typedAction.post, ...state.posts],
        loading: false
      };

    case ActionTypes.DELETE_POST: {
      const typedAction = action as DeletePostAction;
      return {
        ...state,
        // post is of type "any" b/c the "_id" is randomly generated by the NoSQL database. It is not a field in my Post object
        posts: state.posts.filter((post: any) => post._id !== typedAction.id),
        loading: false
      };
    }

    case ActionTypes.POST_ERROR: {
      const typedAction = action as PostErrorAction;
      return {
        ...state,
        error: typedAction,
        loading: false
      };
    }

    case ActionTypes.UPDATE_LIKES: {
      const typedAction = action as UpdateLikesAction;
      return {
        ...state,
        // post is of type "any" b/c the "_id" is randomly generated by the NoSQL database. It is not a field in my Post object
        posts: state.posts.map((post: any) =>
          post._id === typedAction.id
            ? { ...post, likes: typedAction.likes }
            : post
        ),
        loading: false
      };
    }

    case ActionTypes.ADD_COMMENT: {
      const typedAction = action as AddCommentAction;
      return {
        ...state,
        post: { ...(<any>state.post), comments: typedAction.comment },
        loading: false
      };
    }
    case ActionTypes.REMOVE_COMMENT: {
      const typedAction = action as RemoveCommentAction;

      return {
        ...state,
        post: {
          ...(<any>state.post),
          comments: state.post.comments.filter(
            comment => comment._id !== typedAction.id
          )
        },
        loading: false
      };
    }

    default:
      return state;
  }
}
