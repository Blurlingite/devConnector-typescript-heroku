// import uuid from "uuid";
// import { ActionTypes } from "./types";

// export const setAlert = (
//   msg: string,
//   alertType: string,
//   timeout = 5000
// ) => dispatch => {
//   const id = uuid.v4();
//   dispatch({
//     type: ActionTypes.SET_ALERT,
//     payload: { msg, alertType, id }
//   });

//   setTimeout(
//     () => dispatch({ type: ActionTypes.REMOVE_ALERT, payload: id }),
//     timeout
//   );
// };

import uuid from "uuid";
import { ActionTypes, AppActions } from "./types";
import { Dispatch } from "redux";
import { AppState } from "../store";

export const setAlert = (msg: string, alertType: string, timeout = 5000) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const id = uuid.v4();
    dispatch({
      type: ActionTypes.SET_ALERT,
      msg: msg,
      alertType: msg,
      id: id
    });

    setTimeout(
      () => dispatch({ type: ActionTypes.REMOVE_ALERT, id: id }),
      timeout
    );
  };
};
