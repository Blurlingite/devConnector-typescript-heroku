// Our Redux Store

// we bring in "applyMiddleware" so we can then bring in middleware stuff (such as "thunk")
import { createStore, applyMiddleware } from "redux";
// "composeWithDevTools" comes from the redux devtools package (by remotedevio) you installed in Chrome at this link: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
import { composeWithDevTools } from "redux-devtools-extension";

// "thunk" is our middleware (which must come after the "applyMiddleware" import)
// By default actions in Redux are dispatched synchronously (and we need asynchronous), which is a problem for any non-trivial app that needs to communicate with an external API or perform side effects
// Redux Thunk is a middleware that lets you call action creators that return a function instead of an action object. That function receives the store’s dispatch method, which is then used to dispatch regular synchronous actions inside the body of the function once the asynchronous operations have completed.
import thunk from "redux-thunk";
// we will have reduces for auth, profile, etc. and we will combine them into this rootReducer
// Read up on reducers here: https://redux.js.org/basics/reducers
import rootReducer from "./reducers";

// all of our initial state from the reducers will be in here
const initialState = {};

// this is where we put all the middleware we plan to use in an array, right now we are only using "thunk"
const middleware = [thunk];

// make the store using "createStore" brought in by our import statement
// takes 3 params: the rootReducer, the initialState and any middleware
// since we are using devTools extension for our middleware, we need to use the "composeWithDevTools" we brought in with our import and then pass in the "applyMiddleware" to actually be able to use the middleware, and then pass in all our middleware (held by the variable)
// we use the "...", called a spread operator. This will take everything in the array variable "middleware" and pass just those elements in. If we passed in "middleware" by itself we'd be passing in an array into something that already makes a new array (applyMiddleware), so we'd have an array in an array, which will not work
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// export the store so it can be used outside this file
// In order to use the store we have to go to our App.js and bring it in with an import
export default store;
