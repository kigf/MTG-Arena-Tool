import { EnhancedStore } from "@reduxjs/toolkit";
import electron, { IpcMainEvent, BrowserWindow } from "electron";
import {
  IPC_BACKGROUND,
  IPC_RENDERER,
  IPC_OVERLAY,
  IPC_MAIN,
} from "../constants";
import actions from "./mainActions";
const ipc = electron.ipcMain;

/**
 * initializeMainReduxIPC
 *
 * Initializes redux store ipc listener for main process (main.js)
 * @param store  Redux store (EnhancedStore)
 * @param background window/process (BrowserWindow)
 * @param mainWindow window/process (BrowserWindow)
 * @param overlay window/process (BrowserWindow)
 */
export default function initializeMainReduxIPC(
  store: EnhancedStore,
  back: BrowserWindow,
  main: BrowserWindow,
  overlay: BrowserWindow
): void {
  ipc.on("redux-action", function (
    _event: IpcMainEvent,
    type: number,
    arg: string,
    to: number
  ) {
    // dispatch action
    try {
      if (to & IPC_MAIN) {
        const action = JSON.parse(arg);
        if (!actions[type]) {
          console.log("ERROR: Unknown redux action to main: " + type);
          console.error(
            "This action should not be sent to main or the action is missing on the actions list."
          );
        } else {
          store.dispatch(actions[type](action));
        }
      }
      // Relay action
      // to is binary to allow any number or relays
      if (to & IPC_BACKGROUND)
        back?.webContents.send("redux-action", type, arg);
      if (to & IPC_RENDERER) main?.webContents.send("redux-action", type, arg);
      if (to & IPC_OVERLAY)
        overlay?.webContents.send("redux-action", type, arg);
    } catch (e) {
      console.error("Attempted to parse a Redux Action but failed;", type, e);
    }
  });
}
