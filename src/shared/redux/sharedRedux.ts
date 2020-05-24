import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import electron from "electron";
import { IPC_NONE } from "../constants";
import actionsMain, { MainActions } from "./mainActions";
import actionsOther, { OtherActions } from "./otherActions";
const ipcRenderer = electron.ipcRenderer;

const actions = Object.assign({}, actionsMain, actionsOther);

type DispatchParameter<K extends MainActions | OtherActions> = {
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
export function reduxAction<K extends MainActions | OtherActions>(
  dispatch: Dispatch<AnyAction>,
  action: DispatchParameter<K>,
  to: number
): void {
  dispatch(actions[action.type](action.arg as any));
  if (to !== IPC_NONE) {
    ipcRenderer.send(
      "redux-action",
      action.type,
      JSON.stringify(action.arg),
      to
    );
  }
}
