// Section 11 Lecture 66 - Adding Comments
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Leave a Comment</h3>
      </div>
      <form
        class="form my-1"
        // When we submit this form we do these things:
        onSubmit={e => {
          // 1) prevent the page from reloading so it doesn't mess up our submission
          e.preventDefault();
          // 2) add the comment to the post (held by the "text" variable) using the addComment action. We also need the post's ID as shown in our post.js action
          addComment(postId, { text });
          // 3) Clear the "text" field with setText() and passing in an empty string
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
};

export default connect(
  null,
  { addComment }
)(CommentForm);
