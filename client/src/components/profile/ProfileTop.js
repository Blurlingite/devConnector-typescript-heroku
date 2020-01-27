// Section 10 Lecture 57 - . ProfileTop & ProfileAboutComponents
import React from "react";
import PropTypes from "prop-types";

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
  }
}) => {
  return (
    <div class="profile-top bg-primary p-2">
      <img class="round-img my-1" src={avatar} alt="" />
      <h1 class="large">{name}</h1>
      <p class="lead">
        {/* check if there is a company and if there is add this span */}
        {status} {company && <span> at {company}</span>}
      </p>
      {/* check if there is a location and if there is add this span */}
      <p>{location && <span> at {location}</span>}</p>
      <div class="icons my-1">
        {/* If the website exists, display it
        rel="noopener noreferrer"  stops an error in the Chrome console
        */}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <i class="fas fa-globe fa-2x" />
          </a>
        )}

        {/* If the social object is not null and the twitter field on that social object is not null, show the button that leads to that twitter */}
        {social && social.twitter && (
          <a href={social.twitter} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-twitter fa-2x" />
          </a>
        )}

        {social && social.facebook && (
          <a href={social.facebook} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-facebook fa-2x" />
          </a>
        )}

        {social && social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-linkedin fa-2x" />
          </a>
        )}

        {social && social.youtube && (
          <a href={social.youtube} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-youtube fa-2x" />
          </a>
        )}

        {social && social.instagram && (
          <a href={social.instagram} target="_blank" rel="noopener noreferrer">
            <i class="fab fa-instagram fa-2x" />
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
