// Section 10 Lecture 56 - Starting On The Profile
// The parent component for the View Profile page
// bring in the state, bring in the actual profile data
// we need to get the ID from the route (the URL)

import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

import { getProfileById } from "../../actions/profile";

// we pull out "match" from the URL. The URL has the ID and we can access it with "match"
const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match
}) => {
  // immediately when the profile mounts, getProfileById() will get the profile
  useEffect(() => {
    getProfileById(match.params.id); // NOT _id maybe b/c it comes from the URL and not the online database?
  }, [getProfileById, match.params.id]);
  return (
    <Fragment>
      {/* check if profile is loaded. While loading show the spinner gif. Otherwise, show the profile */}
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profile
          </Link>
          {/* If the profile you are viewing is yours, show the Edit Button */}
          {auth.isAuthenticated && // If you are authenticated and
          auth.loading === false && // you are done loading and
            // If the userId from auth (auth.user._id) is the same as the userId of the profile you are viewing (profile.user._id)
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link> // Show the Edit Button
            )}

          <div class="profile-grid my-1">
            {/* The upper part of the profile. We pass in the profile data */}
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {/* loop through experiences on the profile object */}
                  {profile.experience.map(experience => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience} // the experience we pass into the ProfileExperience component
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {/* loop through experiences on the profile object */}
                  {profile.education.map(education => (
                    <ProfileEducation
                      key={education._id}
                      education={education} // the experience we pass into the ProfileExperience component
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

            {/* If there is a github username display this component
            We pass in the username (username={githubusername})
            */}
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getProfileById }
)(Profile);
