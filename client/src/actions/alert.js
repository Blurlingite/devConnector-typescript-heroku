import uuid from "uuid"; // this is a package we installed that generates a universal ID for the alerts passed in

// we import these so we can dispatch these actions to the alert.js in the reducers folder. This will go into the switch statement in the reducers folder's alert.js file and call 1 of it's cases depending on which action (SET_ALERT or REMOVE_ALERT) is dispatched to it
import { SET_ALERT, REMOVE_ALERT } from "./types";

// we want to dispatch more than 1 action type from this export's function, which we can do with "dispatch =>". We can only do this because we imported the "thunk" middleware in some other file (I can't remember which one)
// We will call the action "setAlert" in a React component. It will set the alert type to "SET_ALERT" then dispatch it to the alert.js file in the "reducers" folder and then go to that switch statement. The switch statement will see that the type is set to "SET_ALERT" and activate that case. That case will return all the previous states plus any new one (with ...state that is in the return statement) and the payload (payload in return statement). Then the state (the data) that was returned will get passed down to that component
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  // we call on uuid to generate an ID (a random long string) for us, and we are using version 4 sp we use v4()
  const id = uuid.v4();
  // dispatch() will call the SET_ALERT in our alert reducer (the alert.js file in the "reducers" folder)
  // dispatch() takes in an object, we set the type to SET_ALERT (this is how it know which type the alert is in the switch statement in alert.js in the "reducers" folder)
  // The SET_ALERT in that switch statement also needs a payload, so we set the payload to 3 things:
  // 1) the message (msg) passed in
  // 2) the alert type (alertType) passed in
  // 3) the ID of the alert (id)
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  // setTimeout() is just a javascript function that takes in a function that does something after a certain amount of time (you specify that)
  // after a certain amount of time, we want to dispatch REMOVE_ALERT so it will remove the alert messages on the web page (otherwise the alert messages will pile up on the web page)
  // we dispatch an object with a type of REMOVE_ALERT (type: REMOVE_ALERT)  and payload which just has the ID (payload:id)
  // the last param is the time we wait until this function performs, which is 5 seconds (5000) b/c we declared and initialized a variable called "timeout" in this line:    export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
