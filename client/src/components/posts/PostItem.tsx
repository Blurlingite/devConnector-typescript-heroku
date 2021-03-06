import React, { Fragment, useCallback } from "react";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addLike, deletePost, removeLike } from "../../actions/post";
import { Auth } from "../../types/Auth";
import { User } from "../../types/User";

// We will replace connect() with hooks, take out everything we get from the state (the state itself(everything you would put in "mapStateToProps") and the actions we use(in this case: addLike, removeLike, and deletePost)) we will instead define them in the component using useSelector(), useDispatch(), and useCallback()
interface PostItemProps {
  // addLike: React.Dispatch<React.SetStateAction<any>>;
  // removeLike: React.Dispatch<React.SetStateAction<any>>;
  // deletePost: React.Dispatch<React.SetStateAction<any>>;
  // auth: Auth;
  post: {
    _id: string;
    text: string;
    name: string;
    avatar: string;
    user: string;
    likes: [{ user: User }];
    comments: [
      { user: User; text: string; name: string; avatar: string; date: Date }
    ];
    date: any;
  };
  showActions: boolean;
}

// type Props = PostItemProps;
// & LinkDispatchProps & LinkStateProps;

export const PostItem: React.FC<PostItemProps> = ({
  // addLike,
  // removeLike,
  // deletePost,
  // auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  showActions
}) => {
  const auth: Auth = useSelector<LinkStateProps, Auth>(state => state.auth);

  const dispatch: any = useDispatch();

  const onClickDeletePost = useCallback(
    (postID: string) => dispatch(deletePost(postID)),
    [dispatch]
  );

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          {" "}
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button
              // onClick={e => addLike(_id)}
              onClick={() => dispatch(addLike(_id))}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up" />{" "}
              <span> {likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button
              onClick={() => dispatch(removeLike(_id))}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down" />
            </button>

            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>

            {!auth.loading && user === auth.user._id && (
              <button
                onClick={() => onClickDeletePost(_id)}
                // onClick={e => deletePost(_id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

// PostItem.propTypes = {
//   post: PropTypes.object.isRequired,
//   auth: PropTypes.object.isRequired,
//   addLike: PropTypes.func.isRequired,
//   removeLike: PropTypes.func.isRequired,
//   deletePost: PropTypes.func.isRequired
// };

interface LinkStateProps {
  auth: Auth;
}

// interface LinkDispatchProps {
//   addLike: (id: string) => void;
//   removeLike: (id: string) => void;
//   deletePost: (id: string) => void;
// }

// const mapStateToProps = (state: AppState): LinkStateProps => ({
//   auth: state.auth
// });

// const mapDispatchToProps = (
//   dispatch: ThunkDispatch<any, any, AppActions>,
//   ownProps: PostItemProps
// ): LinkDispatchProps => ({
//   addLike: bindActionCreators(addLike, dispatch),
//   removeLike: bindActionCreators(removeLike, dispatch),
//   deletePost: bindActionCreators(deletePost, dispatch)
// });

// export default connect(mapStateToProps, mapDispatchToProps)(PostItem);
export default PostItem;
