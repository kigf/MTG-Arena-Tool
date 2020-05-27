import React, { useState, useCallback, useEffect } from "react";
import css from "./index.scss";
import sectionCss from "../settings/Sections.css";
import indexCss from "../../index.css";
import Close from "./close.svg";
import { animated, useSpring } from "react-spring";
import Input from "../misc/Input";
import { ipcSend } from "../../rendererUtil";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import showOpenLogDialog from "../../../shared/utils/showOpenLogDialog";

interface AuthSettingsProps<F extends Function> {
  closeCallback?: F;
}

export default function AuthSettings<F extends Function>(
  props: AuthSettingsProps<F>
): JSX.Element {
  const { closeCallback } = props;
  const appSettings = useSelector((state: AppState) => state.appsettings);
  const [open, setOpen] = useState(0);

  const handleClose = useCallback(() => {
    if (open == 1) return;
    if (closeCallback) {
      closeCallback();
    }
  }, [closeCallback, open]);

  useEffect(() => {
    // React doesnt give css time to know there was a change
    // in the properties, adding a timeout solves that.
    setTimeout(() => {
      setOpen(1);
    }, 1);
  }, []);

  // Arena log controls
  const arenaLogCallback = React.useCallback(
    (value: string): void => {
      if (value === appSettings.logUri) return;
      if (
        confirm(
          "Changing the Arena log location requires a restart, are you sure?"
        )
      ) {
        ipcSend("set_log", value);
      }
    },
    [appSettings.logUri]
  );

  const openPathDialog = useCallback(() => {
    showOpenLogDialog(appSettings.logUri).then(
      (value: Electron.OpenDialogReturnValue): void => {
        const paths = value.filePaths;
        if (paths && paths.length && paths[0]) {
          arenaLogCallback(paths[0]);
        }
      }
    );
  }, [appSettings.logUri, arenaLogCallback]);

  // Animation springs
  const alphaSpring = useSpring({
    opacity: open ? 1 : 0,
    onRest: () => handleClose(),
  });
  const scaleSpring = useSpring({
    transform: `scale(${open ? 1 : 1.3})`,
    config: { mass: 2, tension: 1000, friction: 100 },
  });

  return (
    <animated.div className={css.popupBackground} style={alphaSpring}>
      <animated.div
        className={css.popupDiv}
        style={scaleSpring}
        onClick={(e): void => {
          e.stopPropagation();
        }}
      >
        <Close
          fill="var(--color-light)"
          className={css.closeButton}
          onClick={(): void => setOpen(0)}
        />
        <div className={css.popupInner}>
          <div className={css.title}>Settings</div>
          <div className={sectionCss.centeredSettingContainer}>
            <label>Arena Log:</label>
            <div
              style={{
                display: "flex",
                width: "-webkit-fill-available",
                justifyContent: "flex-end",
              }}
            >
              <div className={indexCss.open_button} onClick={openPathDialog} />
              <Input
                callback={arenaLogCallback}
                placeholder={appSettings.logUri}
                value={appSettings.logUri}
              />
            </div>
          </div>
          <div></div>
        </div>
      </animated.div>
    </animated.div>
  );
}
