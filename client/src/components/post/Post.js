// Section 11 Lecture 65 - Single Post Display
import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "../post/CommentForm";
import CommentItem from "../post/CommentItem";
import { getPost } from "../../actions/post";

// from the post state (post:) we pull the post itself (post) and loading
// we also need the ID in the URL which is in the "match" object
const Post = ({ getPost, post: { post, loading }, match }) => {
  // get the post using the ID in the URL coming in on the "match" object
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);

  // make sure post has been loaded first
  // If loading is true or the post is not there (null), then show the spinner
  // Else show the post in a Fragment using the PostItem component
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      {/* PostItem needs 2 arguments, post & showActions.
      showActions is passed "false" so the buttons don't appear (the code for that is in the PostItem component)  */}
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />

      <div className="comments">
        {post.comments.map(comment => (
          // In comment={comment}, {comment} will be the words of the comment
          // _id is taken from the Mongo online Database
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

// need mapStateToProps when you are getting something from the state
export default connect(
  mapStateToProps,
  { getPost }
)(Post);
