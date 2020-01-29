import {
  AlertActionTypes,
  SetAlertAction,
  RemoveAlertAction
} from "../actions/types";
import { ActionTypes } from "../actions/types";

const initialState: { msg: string; alertType: string; id: string }[] = [];

export default function(state = initialState, action: AlertActionTypes) {
  switch (action.type) {
    case ActionTypes.SET_ALERT: {
      const typedAction = action as SetAlertAction;

      return [...state, typedAction];
    }
    case ActionTypes.REMOVE_ALERT: {
      const typedAction = action as RemoveAlertAction;

      return state.filter(alert => alert.id !== typedAction.id);
    }
    default:
      return state;
  }
}
