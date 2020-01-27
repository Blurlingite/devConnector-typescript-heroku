// Section 10 Lecture 54
// This file represents an individual item in a profile's list
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar }, // pull out these field from "user"
    status,
    company,
    location,
    skills
  }
}) => {
  return (
    <div className="profile bg-light">
      {/* get the image from the avatar on the "user" field above */}
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {/* If there's a company (since company is not required), then say "at" that company. Example: Junior Developer at Nintendo */}
          {status} {company && <span> at {company}</span>}
        </p>
        {/* If there's a location print it out */}
        <p className="my-1">{location && <span>{location}</span>}</p>
        {/* button that links to this user's profile using the user's ID not the profile ID */}
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul>
        {/* Go through the skills array and print them out, but stop after printing out 4 of them.  slice(0, 4) will just give us 4 of the skills
      
      We also use "index" just so we can give the <li> tag a unique key
      */}
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check" />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
