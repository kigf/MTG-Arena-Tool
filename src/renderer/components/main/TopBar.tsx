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

  const os = process.platform;

  const topButtonClass =
    os == "darwin" ? sharedCss.topButtonMac : sharedCss.topButton;

  const topButtonsContainerClass =
    os == "darwin"
      ? sharedCss.topButtonsContainerMac
      : sharedCss.topButtonsContainer;

  const isReverse = os == "darwin"; // ubuntu too?

  // Define components for simple ordering later
  const minimize = (
    <div
      onClick={clickMinimize}
      className={sharedCss.minimize + " " + topButtonClass}
    />
  );

  const maximize = (
    <div
      onClick={clickMaximize}
      className={sharedCss.maximize + " " + topButtonClass}
    />
  );

  const close = (
    <div
      onClick={clickClose}
      className={sharedCss.close + " " + topButtonClass}
    />
  );

  const offline = (
    <div className={mainCss.unlink} title="You are not logged-in." />
  );

  return (
    <div
      className={sharedCss.top}
      style={{ flexDirection: isReverse ? "row-reverse" : "row" }}
    >
      <div
        className={indexCss.flexItem}
        style={{ flexDirection: isReverse ? "row-reverse" : "row" }}
      >
        <div className={sharedCss.topLogo}></div>
        {loginState !== LOGIN_OK ? (
          <div className={mainCss.topArtist}>{props.artist}</div>
        ) : (
          <></>
        )}
        {props.offline && isReverse && offline}
      </div>
      <div className={topButtonsContainerClass}>
        {props.offline && !isReverse && offline}
        {os == "darwin"
          ? [close, minimize, maximize]
          : [minimize, maximize, close]}
      </div>
    </div>
  );
}
