// Section 9 Lecture 46
// used to show a spinner when profile can't be loaded or is null
import React, { Fragment } from "react";
// the spinner gif to be displayed
import spinner from "./spinner.gif";

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: "200px", margin: "auto", display: "block" }}
      alt="Loading..."
    />
  </Fragment>
);
