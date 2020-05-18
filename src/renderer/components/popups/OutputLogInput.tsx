import React, { useState, useCallback, ChangeEvent, useEffect } from "react";
import { remote } from "electron";
const { dialog } = remote;
import Button from "../misc/Button";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";

import css from "./popups.css";
import sharedCss from "../../../shared/shared.css";
import indexCss from "../../index.css";
import formsCss from "../../forms.css";

interface OutputLogInputProps {
  closeCallback?: (log: string) => void;
}

export default function OutputLogInput(
  props: OutputLogInputProps
): JSX.Element {
  const { closeCallback } = props;
  const logUri = useSelector((state: AppState) => state.appsettings.logUri);
  const [log, setLog] = useState(logUri);
  const [open, setOpen] = useState(0);
  const handleClose = useCallback(
    (e) => {
      setOpen(0);
      e.stopPropagation();
      if (closeCallback) {
        closeCallback(log);
      }
    },
    [closeCallback, log]
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLog(e.currentTarget.value);
  };

  const openPathDialog = useCallback(() => {
    dialog
      .showOpenDialog(remote.getCurrentWindow(), {
        title: "Arena Log Location",
        defaultPath: logUri,
        buttonLabel: "Select",
        filters: [
          { name: "Text", extensions: ["txt", "text"] },
          { name: "All Files", extensions: ["*"] },
        ],
        properties: ["openFile"],
      })
      .then((value: Electron.OpenDialogReturnValue): void => {
        const paths = value.filePaths;
        if (paths && paths.length && paths[0]) {
          setLog(paths[0]);
        }
      });
  }, [logUri]);

  useEffect(() => {
    // React doesnt give css time to know there was a change
    // in the properties, adding a timeout solves that.
    setTimeout(() => {
      setOpen(1);
    }, 1);
  }, []);

  return (
    <div
      className={css.popupBackground}
      style={{ opacity: open, backgroundColor: `rgba(0, 0, 0, ${0.5 * open})` }}
      onClick={handleClose}
    >
      <div
        className={css.popupDiv}
        style={{ height: `${open * 160}px` }}
        onClick={(e): void => {
          e.stopPropagation();
        }}
      >
        <div
          style={{ marginBottom: "26px" }}
          className={indexCss.messageSub + " " + sharedCss.red}
        >
          Could not find a log
        </div>
        <label className={formsCss.formLabel}>Output log location:</label>
        <div style={{ display: "flex" }}>
          <div className={formsCss.formInputContainer}>
            <input
              onChange={onInputChange}
              type="text"
              autoComplete="off"
              value={log}
            />
          </div>
          <div
            className={indexCss.openButton}
            style={{ margin: "auto 8px", filter: "brightness(0.3)" }}
            onClick={openPathDialog}
          />
        </div>
        <Button text="Ok" onClick={handleClose} />
      </div>
    </div>
  );
}
