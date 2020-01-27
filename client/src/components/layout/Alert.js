// this is the alert component that will be used to display an alert message to the user

import React from "react";
// need this to use props
// This file is getting the setAlert proptype from Register.js in the components folder
import PropTypes from "prop-types";
import { connect } from "react-redux";

// "alerts" is the name we made up for incoming data (props) being passed in
// since we only need 1 expression here we removed the curly braces
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  // map through (go through) each alert object in the array and output a div with the alert message (alert.msg)
  // we need a key when we map through a collection and it should be unique so we say key={alert.id}

  // we use backticks for the classname b/c we are using a combination of hard coded strings and EL (${}) to plug in dynamic data (in this case the alertType so we can style the message depending on what type of alert it is)
  // We now have to embed this into App.js
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

// "alerts" is going to be a proptype so we need to put it here so when we export it at the end of this file, it will be usable by other files
// the shortcut for "PropTypes.array.isRequired" is "ptar" + TAB key
Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

// this will take the alert state (the array of alerts we saw in the Redux tab of Chrome browser's console) and bring it in so we can use it here
// "state" is passed in as a parameter
// "alerts" is a name we made up for the incoming prop in "const Alert" above
// With "state.alert" we get the state from whatever we want from the rootReducer (the Root Reducer is the index.js file in the "reducers" folder). Remember that the Root Reducer contains all the data from all your reducers. So we are just accessing the data from the alert reducer that got passed into that index.js file's export statement with export default combineReducers({ alert });   We are getting that state inside of "alert"
const mapStateToProps = state => ({
  alerts: state.alert
});

// we pass in the 1st param only (state) b/c we don't need any actions like in Alert.js (actions would be the 2nd param)
export default connect(mapStateToProps)(Alert);
