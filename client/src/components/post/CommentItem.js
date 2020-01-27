// Section 11 Lecture 67 - Comment Display & Delete
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteComment } from "../../actions/post";

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment
}) => (
  <div class="post bg-white p-1 my-1">
    <div>
      {/* Link to the user's profile using user ID (user) that comes from the comment object above */}
      <Link to={`/profile/${user}`}>
        <img class="round-img" src={avatar} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p class="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>

      {/* user === auth.user._id is saying if the user ID (user) is thw same as the ID of the user logged in (auth.user._id) then this comment belongs to them and they can delete it with the deleteComment() action */}
      {!auth.loading && user === auth.user._id && (
        <button
          // deleteComment() takes in the post's ID (postId from the props above) and the comment's ID (_id from the destructured comment object above)
          onClick={e => deleteComment(postId, _id)}
          type="button"
          className="btn btn-danger"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  </div>
);

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
