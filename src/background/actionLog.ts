import { ipcSend } from "./backgroundUtil";
import fs from "fs";
import path from "path";
import globals from "./globals";
import format from "date-fns/format";
import globalStore from "../shared/store";
import { constants } from "mtgatool-shared";
import debugLog from "../shared/debugLog";

const { IPC_OVERLAY } = constants;

let currentActionLog = "";

const actionLog = function (
  seat: number,
  time = new Date(),
  str: string,
  _grpId = 0
): void {
  if (seat == -99) {
    currentActionLog = "version: 1\r\n";
  } else {
    //str = str.replace(/(<([^>]+)>)/gi, "");

    currentActionLog += `${seat}\r\n`;
    currentActionLog += `${format(time, "HH:mm:ss")}\r\n`;
    currentActionLog += `${str}\r\n`;

    try {
      fs.writeFileSync(
        path.join(
          globals.actionLogDir,
          globalStore.currentMatch.matchId + ".txt"
        ),
        currentActionLog,
        "utf-8"
      );
    } catch (e) {
      debugLog("Could not write action log data", "error");
      debugLog(e, "error");
    }
  }

  ipcSend("action_log", currentActionLog, IPC_OVERLAY);
};

export default actionLog;
