// Section 10 Lecture 54
// as soon as this profile loads we need to call GET_PROFILE that we made in the last video and we need useEffect for that
import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";

import { getProfiles } from "../../actions/profile";
import { connect } from "react-redux";

// we want profiles and loading from the profile object
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  // as soon as this profile loads we need to run getProfiles()
  // Next, we go to App.js and add code to make sure profiles get put in the state
  useEffect(() => {
    getProfiles();
  }, [getProfiles]); // add getProfiles as a dependency so annoying warning doesn't show

  return (
    // If loading is true (if still loading), show the spinner gif (<Spinner />). Else, go through the array of profiles (from "profiles") and print each one to the webpage (using the <ProfileItem/> component)
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {/* If the length of "profiles" is greater than 0 (meaning there are profiles in it), then go through the "profiles" array anf print each profile to the webpage. Else, say there were no profiles found */}
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  getProfiles: PropTypes.func.isRequired,
  profile: state.profile
});
// we need to get our profile state so we need mapStateToProps
export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
