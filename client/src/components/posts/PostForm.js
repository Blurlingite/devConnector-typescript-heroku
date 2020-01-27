// Section 11 Lecture 64 - Adding Posts
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";
const PostForm = ({ addPost }) => {
  // we only have 1 field for this form so we can just use a string (useState(""))
  const [text, setText] = useState("");

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        class="form my-1"
        // When we submit this form we do these things:
        onSubmit={e => {
          // 1) prevent the page from reloading so it doesn't mess up our submission
          e.preventDefault();
          // 2) add the post (held by the "text" variable)
          addPost({ text });
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

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(
  null,
  { addPost }
)(PostForm);
