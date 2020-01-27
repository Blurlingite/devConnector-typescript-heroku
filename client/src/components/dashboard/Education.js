// Section 9 Lecture 51
// Section 9 Lecture 51
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";

// "Moment" is used to format dates
import Moment from "react-moment";

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        {/* Moment will format the date from "edu.from"
      
        Since the "to" date from "edu.to" can be null, we have to check for that. 
        If it's null set the "to" date to "Now" else, set it to whatever date was on it
      */}
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
        {edu.to === null ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </td>

      <td>
        <button
          onClick={() => deleteEducation(edu._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            {/* hide-sm will hide this th on mobile screens(or on small screens) */}
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>

        {/* we will loop through the array of experiences to get each one */}
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
