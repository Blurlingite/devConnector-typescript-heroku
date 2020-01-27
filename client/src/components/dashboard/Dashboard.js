// Section 9 Lecture 44
import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Spinner component that will be used to show a spinner when profile cannot be loaded

import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

import { getCurrentProfile, deleteAccount } from "../../actions/profile";

// pull out "profile" (state of profile) and "loading" from "profile" being passed in
const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading }
}) => {
  // we want to call getCurrentProfile as soon as this component loads
  useEffect(() => {
    getCurrentProfile();
    // add getCurrentProfile as a dependency so annoying warning doesn't show
  }, [getCurrentProfile]);

  // profile is null and is still loading, show the spinner gif
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" />
        {/* {user && user.name} does 2 things:
      1) user will check to see if the user exists (is logged in)
      2) user.name will display the user's name if it gets past "user"
      
      I think the reason why "user" check for the user is b/c it comes from the auth object that we destructured above auth: { user }
      The auth object authorizes the user

      OR it could be b/c "user" is an object and we aren't accessing any of it's fields like how we do with user.name

      So if we don't access the fields, the program will instead check if it exists
      */}
        Welcome {user && user.name}
      </p>

      {/* if profile is not null use "has", otherwise (:) use "has not" */}
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          {/* need to pass in the experience array, b/c that will be passed into and used in the Experience component(Experience.js)
          We can get that from the profile object we passed in above */}
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});
export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
