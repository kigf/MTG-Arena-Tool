import { app, remote, ipcRenderer as ipc } from "electron";
import debugLog from "../debugLog";
import { constants } from "mtgatool-shared";

const { IPC_RENDERER, IPC_BACKGROUND } = constants;

export const USER_DATA_DIR = (app || remote.app).getPath("userData");

// Begin of IPC messages recievers
function ipcSend(
  method: string,
  from = IPC_BACKGROUND,
  arg: any,
  to = IPC_RENDERER
): void {
  // This is crude but works..
  if (process && process.type === "renderer") {
    ipc.send("ipc_switch", method, from, arg, to);
  }
}

function logInfo(message: string): void {
  debugLog(`Local DB: ${message}`, "info");
}

let blockingQueriesInFlight = 0;

export function showBusy(message: string): void {
  blockingQueriesInFlight += 1;
  logInfo(message);
  ipcSend("popup", IPC_BACKGROUND, { text: message, time: 0, progress: 2 });
}

export function hideBusyIfDone(message?: string): void {
  blockingQueriesInFlight = Math.max(0, blockingQueriesInFlight - 1);
  logInfo(message || "...done.");
  if (blockingQueriesInFlight > 0) {
    return; // not done, still busy
  }
  const time = message ? 3000 : 1;
  ipcSend("popup", IPC_BACKGROUND, { text: message, time, progress: -1 });
}
