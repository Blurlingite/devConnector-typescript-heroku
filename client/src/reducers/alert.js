// this is our alert reducer, don't forget to import it to index.js in reducers folder
// A reducer is a function that takes in a piece of state (in this case, any state that has to do with alerts) and an action
// An action will get dispatched from an actions file

// don't need to include "src" in the file path b/c you'll already be in that folder at this point
import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
const initialState = [];

// here's what the initial state for alerts will look like:
// {
//   id: 1,
//   msg: 'Please log in',
//   alertType: 'success'  // Used to determine what kind of styling we'll do
// }

// when we say "state = initialState" we set the default state to initialState
// action contains 2 things:
// 1) A type
// 2) A payload (the data)
export default function(state = initialState, action) {
  // we use this switch statement to evaluate the action type

  // this takes out 2 things from the "action", the type and payload. So now when we say "type", it knows to use the type from the "action" (this is the same as saying action.type)
  const { type, payload } = action;
  switch (type) {
    // with this case we are setting the alert. Since state is immutable (unchangeable) we have to copy the previous states and then add the new state using the spread operator "...". We also return the payload along with the states as part of an array
    case SET_ALERT:
      return [...state, payload];

    // this case will remove an alert by it's ID
    case REMOVE_ALERT:
      // we filter through the states array with filter(). For each alert ("alert"), grab the ID ("alert.id") and check to see if it is not equal to the payload ("!== payload")
      // so we will filter the alert by the ID we get and leave everything else(although this will run everytime when an alert is displayed on the webpage, so it will have nothing in it)
      // The payload in this case will just be an alert ID, that is how we can compare alert.id to payload with "alert.id !== payload"
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
