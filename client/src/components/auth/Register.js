import React, { Fragment, useState } from "react";
// used to connect React components to redux. You need to export it and the end of this file and put the component's name in parantheses
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
// import the action you want to use in this file
// Whenever you import an action (like "setAlert" above), you have to pass it into the component's parameter list (const Register), your prop types (Register.propTypes) and connect() in the export statement
import { setAlert } from "../../actions/alert";
// import the register action from auth.js (don't forget to add it in all places needed (see above comments)
import { register } from "../../actions/auth";

// need this to use props
import PropTypes from "prop-types";

// we pull out setAlert from props with {setAlert} so we don't need to keep writing "props.setAlert" we can just write "setAlert"
const Register = ({ setAlert, register, isAuthenticated }) => {
  // "formData" will be the state for form elements
  // need a state for form elements b/c those fields could change
  // anything that can change or is dynamic needs a state
  // "setFormData" is like this.setState (where you can change values, change the state)
  // useState() will hold the default values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
    // password2 is used when the user must re-enter their password to confirm
  });

  // pull out these things from formData so you don't need to keep doing formData.name, etc.
  const { name, email, password, password2 } = formData;

  // ...formData makes a copy of formData (it is the spread operator)
  // we pass in name b/c thats what we want to change
  // "e.target.value" gets the value of the input (which we labeled with "e" when we did this : onChange={e => onChange(e)} in the form)
  //"[e.target.name]" will get replaced with whatever is assigned to the name attribute in a form element. So if we have name="email" it will be replaced with "email" This is so we can use the onChange() function with any of our form elements
  // So that means "e" is the element. "target" lets us target the element and then we can access the name of the element (of any attribute assigned to the element) with .NAMEOFATTRIBUTE (.name in this case)
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // this will run when the form is submitted
  // need async b/c this is asynchronous
  const onSubmit = async e => {
    e.preventDefault();
    // if the passwords don't match tell the user they don't match
    // else show the form data using formData
    if (password !== password2) {
      // "setAlert" comes from const Register as part of the props that gets automatically passed in. It will pass in this message to our actions (into our alert.js file in the "actions" folder) and perform the code in the alert.js file (which is, give it an ID and dispatch the action to the alert.js file in the "reducers" folder)
      // In that alert.js file we declare 2 params: "msg" and "alertType"
      // "Passwords do not match" is the msg that we put into alert.js
      // "danger" is the alertType that we put into alert.js   We do this b/c in our CSS file we have a styling for alert.danger, so by passing in "danger" we can dynamically add it to an alert and apply that styling
      // Also, by this point, when you open up the redux tab in your Chrome browser's console, you should see under the "State" tab we have alert set to an empty array
      // When you attempt to sign up with passwords that don't match, you will see in the "Actions" tab of the Redux tab that SET_ALERT appears there (b/c it was dispatched). You can see the message "Passwords do not match" by opening the "payload" that also appears. There you can also see the alertType of "danger" and the ID that was given to that alert (by uuid which you imported in another file)
      setAlert("Passwords do not match", "danger");
    } else {
      // call the register action you imported in the import statement
      // it takes in an object with name, email and password (which it gets values from the formData variable in this file.   formData holds what the user enters in the form on the webpage)
      register({ name, email, password });
    }
  };

  // Redirect if registered
  // We want tp make it that when we register, it redirects us
  // react-router lets is use the Redirect tag once you bring it in with the import statement above
  // it will redirect to the endpoint "/dashboard"
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      {/* This form will call the function onSubmit() above when submitted
      "e" is now the action of submission */}
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          {/* The "value" gets the name from our state  */}
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            // This will use the function in "const onChange". We call it with onChange() and pass in e
            onChange={e => onChange(e)}
            // required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            // This will use the function in "const onChange". We call it with onChange() and pass in e
            onChange={e => onChange(e)}
            // required // used to display a message when user does not enter one
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            // This will use the function in "const onChange". We call it with onChange() and pass in e
            onChange={e => onChange(e)}
            // minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            // This will use the function in "const onChange". We call it with onChange() and pass in e
            onChange={e => onChange(e)}
            // minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

// we are setting our proptypes here so when we export at the end of this file, these proptypes (setAlert) can be used by other files
// like in connect() below, we need to add a proptype for each action we import in our above import statements
// shortcut: use "ptfr" to put "PropTypes.func.isRequired"
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

// we just need to check isAuthenticated to see if we are authenticated with state.auth.isAuthenticated
// we'll assign that to the isAuthenticated field
// now isAuthenticated is a prop so we need to add it to Proptypes & const Register above
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// You need to export it and the end of this file and put the component's name in parantheses
// Whenever you import an action (like "setAlert" above), you have to pass it into connect
// connect can also take in state you want to map as the 1st parameter. But if you don't want to put "null" as the 1st parameter
// the 2nd parameter is the object with any actions you want to use (like "setAlert"). This will allow us to access "props.setAlert". The props come in at "const Register" at the top
// we export setAlert here so that "setAlert" will be passed into other files as props
export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
