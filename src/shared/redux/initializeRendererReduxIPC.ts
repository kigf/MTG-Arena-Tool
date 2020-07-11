import { EnhancedStore } from "@reduxjs/toolkit";
import electron, { IpcRendererEvent } from "electron";
import { actions, ActionKeys } from "./actions";
import debugLog from "../debugLog";
import logInitialMessage from "../utils/logInitialMessage";
const ipcRenderer = electron.ipcRenderer;

/**
 * initializeRendererReduxIPC
 *
 * Initializes redux store ipc listeners for renderer processes.
 * @param store Redux store (EnhancedStore)
 */
export default function initializeRendererReduxIPC(store: EnhancedStore): void {
  logInitialMessage();
  ipcRenderer.on(
    "redux-action",
    (_event: IpcRendererEvent, type: ActionKeys, arg: string) => {
      // dispatch action
      try {
        const action = JSON.parse(arg);
        store.dispatch(actions[type](action));
      } catch (e) {
        debugLog(`Attempted to parse a Redux Action but failed; ${type}, ${e}`);
      }
    }
  );
}
