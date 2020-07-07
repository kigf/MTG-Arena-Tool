import path from "path";
import { app, remote } from "electron";
import fs from "fs";

import defaultTheme from "../../assets/resources/theme.json";
import debugLog from "../debugLog";

const themePath: string | null =
  app || (remote && remote.app)
    ? path.join((app || remote.app).getPath("userData"), "theme.json")
    : null;

export default function reloadTheme(overridePath = themePath): void {
  let themeUse = defaultTheme;
  if (overridePath && overridePath !== "") {
    if (fs.existsSync(overridePath)) {
      const themeString = fs.readFileSync(overridePath, "utf8");
      try {
        themeUse = JSON.parse(themeString);
      } catch (e) {
        debugLog(e, "error");
      }
    }
  }
  if (themePath && !fs.existsSync(themePath)) {
    // write the default theme so people can see it
    fs.writeFileSync(themePath, JSON.stringify(defaultTheme));
  }

  type VarKeys = keyof typeof themeUse;
  Object.keys(themeUse).map((key) => {
    document.documentElement.style.setProperty(key, themeUse[key as VarKeys]);
  });
}
