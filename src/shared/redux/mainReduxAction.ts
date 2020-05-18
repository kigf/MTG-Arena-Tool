import {Dispatch, AnyAction} from "@reduxjs/toolkit";
import electron from "electron";
import {IPC_NONE} from "../constants";
import actions from "./mainActions";
const ipcRenderer = electron.ipcRenderer;

/**
 * Dispatch a redux action to a renderer store and (if required) relay it to other processes
 * @param dispatch Dispatcher
 * @param type Action type
 * @param arg argument / object
 * @param to process to relay to
 */
export default function reduxAction(
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
