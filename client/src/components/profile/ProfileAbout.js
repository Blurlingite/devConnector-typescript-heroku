// Section 10 Lecture 57 - . ProfileTop & ProfileAboutComponents
import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => (
  <div class="profile-about bg-light p-2">
    {bio && (
      <Fragment>
        {/* This will split the name into the first and last name, get rid of the last name and display only the first name. It does this by splitting by the space between the first and last names with split(" ")[0]  */}
        <h2 class="text-primary">{name.trim().split(" ")[0]}'s Bio</h2>
        <p>{bio}</p>
        <div class="line" />
      </Fragment>
    )}
    <h2 class="text-primary">Skill Set</h2>
    <div class="skills">
      {/* map through skills so you can display them */}
      {skills.map((skill, index) => (
        <div key={index} className="p-1">
          <i className="fas fa-check" /> {skill}
        </div>
      ))}
    </div>
  </div>
);
ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};
export default ProfileAbout;
