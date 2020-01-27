// Section 11 Lecture 61 - Post Item Component
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
// used when we add a like, remove a like, delete a post,etc
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  // this will show the like,unlike, discussion and delete post buttons when it is true and hide them when false. This is so we can reuse this PostItem component when we display a single post (you could make a new componenet for this but it's so similar to this component so let's reuse it)
  showActions
}) => (
  <div class="post bg-white p-1 my-1">
    <div>
      {/* when you click on the avatar, it will take you to that user's profile b/c of this Link's "to" */}
      <Link to={`/profile/${user}`}>
        <img class="round-img" src={avatar} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p class="post-date">
        {" "}
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>

      {/* If showActions is true, show the buttons */}
      {showActions && (
        <Fragment>
          {/* With this onClick, when the button is clicked, we call the addLike() action and pass in the post's ID which we destructured above as _id.  This will let us like the post*/}
          <button
            onClick={e => addLike(_id)}
            type="button"
            class="btn btn-light"
          >
            <i class="fas fa-thumbs-up" />{" "}
            {/* check if there are likes and then show how many there are of there are some (in the span tag) */}
            <span> {likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            onClick={e => removeLike(_id)}
            type="button"
            class="btn btn-light"
          >
            <i class="fas fa-thumbs-down" />
          </button>
          {/* we want to be linked to the post so we use backticks and pass in the ID (_id) */}
          <Link to={`/posts/${_id}`} class="btn btn-primary">
            Discussion{" "}
            {/* check if there are comments and then show how many there are of there are some (in the span tag) */}
            {comments.length > 0 && (
              <span class="comment-count">{comments.length}</span>
            )}
          </Link>

          {/* only show the delete post button if the post belongs to that user. We use auth for this
      
      "user" is the post's user ID (remember we made "user" just the user ID in another file)
      "auth.user._id" is the user that is logged in

      If they are equal, that means this post belongs to the user currently logged in
      */}
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={e => deletePost(_id)}
              type="button"
              class="btn btn-danger"
            >
              <i class="fas fa-times" />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

// Every component can have defaultProps and you can make fields have a default value
PostItem.defaultProps = {
  // we make this true by default (we can change it to false later) so we can hide the buttons only when we make it false
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

// uses auth's state so we can provide a button to delete a post/comment only if that post/comment belongs to that user
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost }
)(PostItem);
