// No comments from Section 8 Lecture 43

import React, { Fragment } from "react";
// We need this b/c we dont want to use a tags to link stuff
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

// pulling out isAuthenticated and loading from auth object (also called "destructuring")
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>

      <li>
        <Link to="/posts">Posts</Link>
      </li>

      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"> </i>
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="/">
          <i className="fas fa-sign-out-alt"> </i>
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code" /> DevConnector
        </Link>
      </h1>
      {/* If not loading, do this 
      // if isAuthenticated is true show authLinks (stuff that shows when logged in only) otherwise show guestLinks
      */}
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired // auth is an object
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
