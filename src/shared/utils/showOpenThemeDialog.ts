import { remote } from "electron";
const { dialog } = remote;

export default function showOpenThemeDialog(
  log: string
): Promise<Electron.OpenDialogReturnValue> {
  return dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: "Theme Location",
    defaultPath: log,
    buttonLabel: "Select",
    filters: [{ name: "json files", extensions: ["json"] }],
    properties: ["openFile"],
  });
}
