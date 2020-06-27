import electronDebug from "electron-debug";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import debugLog from "../shared/debugLog";

export default function installDevTools(): void {
  debugLog(`INSTALLING DEV TOOLS..`);
  [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].map((ext) => {
    installExtension(ext)
      .then((name) => debugLog(`Added ${name}`))
      .catch((err) => debugLog(err));
  });

  // Adds debug features like hotkeys for triggering dev tools and reload
  electronDebug({ showDevTools: false });
}
