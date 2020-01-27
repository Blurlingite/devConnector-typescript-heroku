// Section 9 Lecture 47
// each form inout should be a piece of state so we use the useState hook
import React, { Fragment, useState } from "react";
// "withRouter" to use the "history" object (also used in profile.js in the "actions folder"). It lets us to redirect from the action
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

// we pull out "createProfile" and "history" from the props object b/c that's all we need here
const CreateProfile = ({ createProfile, history }) => {
  // see Register.js for more comments

  // are we setting these values to both formData & setFormData???
  const [formData, setFormData] = useState({
    // these are all the profile fields from Profile model in "models" folder
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: ""
  });

  // the default state for "displaySocialInputs" & "toggleSocialInputs" is set to false thanks to useState()
  // this will be used to hide the social media inputs until you click the "Add Social Network" button, by setting the state to false, we can hide them
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  // pull out these fields from formData
  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  // see comments from another component
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    // submit the action "createProfile" which creates a profile using data from a form (the "formData" variable we've been using) and the "history" object to redirect to another endpoint

    createProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      {/* onSubmit() is the const we made above */}
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <select name="status" value={status} onChange={e => onChange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className="form-group">
          value={bio} onChange={e => onChange(e)}
          <textarea placeholder="A short bio of yourself" name="bio" />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            // we set toggleSocialInputs to the opposite of what "displaySocialInputs" is with "!displaySocialInputs". If "displaySocialInputs" is false, toggleSocialInputs is true and vice-versa. This will let us show the media inputs when we click the button the first time and hide them when we click again.
            // Since toggleSocialInputs & displaySocialInputs both use the same state as we said here:   const [displaySocialInputs, toggleSocialInputs] = useState(false);   when toggleSocialInputs is false, displaySocialInputs becomes false and if toggleSocialInputs is true, displaySocialInputs becomes true

            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {/* If displaySocialInputs is true, show this Fragment that has all the social media inputs */}
        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x" />
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x" />
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x" />
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x" />
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x" />
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

// we wrap "CreateProfile" in "withRouter" b/c we used the "history" object in that compopnent, otherwise we can't pass in the history object and use it from the action
export default connect(
  null,
  { createProfile }
)(withRouter(CreateProfile));
