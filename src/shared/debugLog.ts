import electronLog from "electron-log";

type Levels = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export default function debugLog(log: any, level: Levels = "debug"): void {
  if (level == "error") electronLog.error(log);
  if (level == "warn") electronLog.warn(log);
  if (level == "info") electronLog.info(log);
  if (level == "verbose") electronLog.verbose(log);
  if (level == "debug") electronLog.debug(log);
  if (level == "silly") electronLog.silly(log);
}
