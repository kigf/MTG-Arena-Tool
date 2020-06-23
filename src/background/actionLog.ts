import { ipcSend } from "./backgroundUtil";
import fs from "fs";
import path from "path";
import { IPC_OVERLAY } from "../shared/constants";
import globals from "./globals";
import format from "date-fns/format";
import globalStore from "../shared/store";

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
      //
    }
  }
  /*
  const logData = {
    seat: seat,
    time: time.toISOString(),
    str: str,
    grpId: grpId
  };
  */
  //debugLog("action_log", { seat: seat, time: time }, str);
  ipcSend("action_log", currentActionLog, IPC_OVERLAY);
};

export default actionLog;
