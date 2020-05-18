import {EnhancedStore} from "@reduxjs/toolkit";
import electron, {IpcRendererEvent} from "electron";
import actionsMain from "./mainActions";
import actionsOther from "./otherActions";
const ipcRenderer = electron.ipcRenderer;

const actions = Object.assign({}, actionsMain, actionsOther);

/**
 * initializeRendererReduxIPC
 *
 * Initializes redux store ipc listeners for renderer processes.
 * @param store Redux store (EnhancedStore)
 */
export default function initializeRendererReduxIPC(store: EnhancedStore): void {
  ipcRenderer.on(
    "redux-action",
    (_event: IpcRendererEvent, type: string, arg: string) => {
      // dispatch action
      try {
        const action = JSON.parse(arg);
        store.dispatch(actions[type](action));
      } catch (e) {
        console.error("Attempted to parse a Redux Action but failed;", type, e);
      }
    }
  );
}