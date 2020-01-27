// Section 9 Lecture 44
import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// this takes in another React component (the Dashboard component) and we put that in a field called "component" where "Component" represents the actual Component
// ...rest  is the next param that passes in the rest of the stuff that comes in with the Component passed in (b/c depending on the Component, it could vary)
// we also pass in the auth object and pull out "isAuthenticated" & "loading"
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest} // pass in the custom props that were passed in (represented with "...rest" that was passed in). It is multiple stuff so we put it in "{}"
    render={props =>
      !isAuthenticated && !loading ? ( // if you are not authenticated and user is not loaded (don't assume that not being authenticated means that user isn't loaded. That's why we check for both) redirect to the login page with the endpoint "/login"
        <Redirect to="/login" />
      ) : (
        <Component {...props} /> // else if you are authenticated load whatever Component & it's props that was passed in ("Component" is a placeholder for any React Component)
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
