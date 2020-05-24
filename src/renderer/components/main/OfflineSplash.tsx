/* eslint-disable @typescript-eslint/camelcase */
import { remote, shell } from "electron";
import React from "react";
import { SETTINGS_PRIVACY, IPC_BACKGROUND } from "../../../shared/constants";
import { forceOpenSettings } from "../../tabControl";
import { reduxAction } from "../../../shared/redux/sharedRedux";
import store from "../../../shared/redux/stores/rendererStore";

import authCss from "./auth.css";
import mainCss from "./main.css";
import sharedCss from "../../../shared/shared.css";

const subWhite16 = sharedCss.white + " " + mainCss.messageSub16;
const bigRed = sharedCss.red + " " + mainCss.messageBig;

export default function OfflineSplash(): JSX.Element {
  return (
    <div className={mainCss.messageCenter} style={{ display: "flex" }}>
      <div className={mainCss.messageUnlink}></div>
      <div className={bigRed}>Oops, you are offline!</div>
      <div className={subWhite16}>To access online features:</div>
      <div className={subWhite16}>
        If you are logged in, you may need to{" "}
        <a
          className={authCss.privacyLink}
          onClick={(): void => forceOpenSettings(SETTINGS_PRIVACY)}
        >
          enable online sharing
        </a>{" "}
        and restart.
      </div>
      <div className={subWhite16}>
        If you are in offline mode, you can{" "}
        <a
          className={authCss.launchLoginLink}
          onClick={(): void => {
            const clearAppSettings = {
              rememberMe: false,
              autoLogin: false,
              launchToTray: false,
            };
            reduxAction(
              store.dispatch,
              { type: "SET_APP_SETTINGS", arg: clearAppSettings },
              IPC_BACKGROUND
            );
            setTimeout(() => {
              remote.app.relaunch();
              remote.app.exit(0);
            }, 1000);
          }}
        >
          login to your account
        </a>
        .
      </div>
      <div className={subWhite16}>
        If you need an account, you can{" "}
        <a
          className={authCss.signupLink}
          onClick={(): Promise<void> =>
            shell.openExternal("https://mtgatool.com/signup/")
          }
        >
          sign up here
        </a>
        .
      </div>
    </div>
  );
}
