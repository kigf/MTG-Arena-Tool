import { EnhancedStore } from "@reduxjs/toolkit";
import electron, { IpcMainEvent, BrowserWindow } from "electron";
import { actions, ActionKeys } from "./actions";
import debugLog from "../debugLog";
import { constants } from "mtgatool-shared";

const { IPC_BACKGROUND, IPC_RENDERER, IPC_OVERLAY, IPC_MAIN } = constants;

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
  ipc.on(
    "redux-action",
    (_event: IpcMainEvent, type: ActionKeys, arg: string, to: number) => {
      // dispatch action
      try {
        if (to & IPC_MAIN) {
          const action = JSON.parse(arg) as any;
          if (!actions[type]) {
            debugLog("ERROR: Unknown redux action to main: " + type, "error");
            debugLog(
              "This action should not be sent to main or the action is missing on the actions list.",
              "error"
            );
          } else {
            store.dispatch(actions[type](action));
          }
        }
        // Relay action
        // to is binary to allow any number or relays
        if (to & IPC_BACKGROUND)
          back?.webContents.send("redux-action", type, arg);
        if (to & IPC_RENDERER)
          main?.webContents.send("redux-action", type, arg);
        if (to & IPC_OVERLAY)
          overlay?.webContents.send("redux-action", type, arg);
      } catch (e) {
        debugLog(
          `Attempted to parse a Redux Action but failed; 
          ${type},
          ${arg},
          ${e}`,
          "error"
        );
      }
    }
  );
}
