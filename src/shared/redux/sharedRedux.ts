import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import electron from "electron";
import { IPC_NONE } from "../constants";
import { actions, ActionKeys } from "./actions";
const ipcRenderer = electron.ipcRenderer;

type DispatchParameter<K extends ActionKeys> = {
  type: K;
  arg: Parameters<typeof actions[K]>[0];
};

/**
 * Dispatch a redux action to the main store and (if required) relay it to other processes
 * @param dispatch Dispatcher
 * @param type Action type
 * @param arg argument / object
 * @param to process to relay to
 */
export function reduxAction<K extends ActionKeys>(
  dispatch: Dispatch<AnyAction>,
  action: DispatchParameter<K>,
  to: number
): void {
  dispatch(actions[action.type](action.arg));
  if (to !== IPC_NONE) {
    ipcRenderer.send(
      "redux-action",
      action.type,
      JSON.stringify(action.arg),
      to
    );
  }
}
