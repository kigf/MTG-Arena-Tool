import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import electron from "electron";
import { IPC_NONE } from "../constants";
import actionsMain from "./mainActions";
import actionsOther from "./otherActions";
const ipcRenderer = electron.ipcRenderer;

const actions = Object.assign({}, actionsMain, actionsOther);

/**
 * Dispatch a redux action to the main store and (if required) relay it to other processes
 * @param dispatch Dispatcher
 * @param type Action type
 * @param arg argument / object
 * @param to process to relay to
 */
export function reduxAction(
  dispatch: Dispatch<AnyAction>,
  type: string,
  arg: any,
  to: number
): void {
  dispatch(actions[type](arg));
  if (to !== IPC_NONE) {
    ipcRenderer.send("redux-action", type, JSON.stringify(arg), to);
  }
}
