// Section 9 Lecture 50
import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addExperience } from "../../actions/profile";

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false, // see comments in profile model for why this is false by default
    description: ""
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const { company, title, location, from, to, current, description } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 class="large text-primary">Add An Experience</h1>
      <p class="lead">
        <i class="fas fa-code-branch" /> Add any developer/programming positions
        that you have had in the past
      </p>
      <small>* = required field</small>
      <form
        class="form"
        onSubmit={e => {
          e.preventDefault();
          // when we submit, the history object will let us redirect to the endpoint we specified
          addExperience(formData, history);
        }}
      >
        <div class="form-group">
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            value={title}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="* Company"
            name="company"
            value={company}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={e => onChange(e)}
          />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={e => onChange(e)}
          />
        </div>
        <div class="form-group">
          <p>
            {/*
             We need to toggleDisable and pre-fill this field with setFormData.

             checked={current} takes in "current" which by default is false, so the box will not be checked. If you click the box, "current" will be true and the box will be checked
            
            
            */}
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });
                // this will make it so that when the user checks the "current" box, the "to" field cannot accept any text and will toggle when you check the box again
                toggleDisabled(!toDateDisabled);
              }}
            />{" "}
            Current Job
          </p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={e => onChange(e)}
            // If toDateDisabled is true, disable this field by setting the string to 'disabled', else, do nothing (by setting it to an empty string)
            disabled={toDateDisabled ? "disabled" : ""}
          />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <a class="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { addExperience }
)(withRouter(AddExperience));
