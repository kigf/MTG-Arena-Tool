import React from "react";
import { ipcSend } from "../../rendererUtil";

import mainCss from "./main.css";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { LOGIN_OK } from "../../../shared/constants";

interface TopBarProps {
  artist: string;
  offline: boolean;
}

function clickMinimize(): void {
  ipcSend("renderer_window_minimize", 1);
}

function clickMaximize(): void {
  ipcSend("renderer_window_maximize", 1);
}

function clickClose(): void {
  ipcSend("renderer_window_close", 1);
}

export default function TopBar(props: TopBarProps): JSX.Element {
  const loginState = useSelector((state: AppState) => state.login.loginState);

  return (
    <div className={sharedCss.top}>
      <div className={indexCss.flexItem}>
        <div className={sharedCss.topLogo}></div>
        {loginState !== LOGIN_OK ? (
          <div className={mainCss.topArtist}>{props.artist}</div>
        ) : (
          <></>
        )}
      </div>
      <div className={sharedCss.topButtonsContainer}>
        {props.offline ? (
          <div className={mainCss.unlink} title="You are not logged-in."></div>
        ) : (
          <></>
        )}
        <div
          onClick={clickMinimize}
          className={sharedCss.minimize + " " + sharedCss.topButton}
        ></div>
        <div
          onClick={clickMaximize}
          className={sharedCss.maximize + " " + sharedCss.topButton}
        ></div>
        <div
          onClick={clickClose}
          className={sharedCss.close + " " + sharedCss.topButton}
        ></div>
      </div>
    </div>
  );
}
