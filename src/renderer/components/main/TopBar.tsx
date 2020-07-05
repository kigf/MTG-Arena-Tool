import React, { CSSProperties, useState } from "react";
import { ipcSend } from "../../rendererUtil";

import mainCss from "./main.css";
import indexCss from "../../index.css";
import sharedCss from "../../../shared/shared.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../shared/redux/stores/rendererStore";
import { LOGIN_OK } from "../../../shared/constants";

import MacMinimize from "../../../assets/images/svg/mac-minimize.svg";
import MacMaximize from "../../../assets/images/svg/mac-maximize.svg";
import MacClose from "../../../assets/images/svg/mac-close.svg";

import WinMinimize from "../../../assets/images/svg/win-minimize.svg";
import WinMaximize from "../../../assets/images/svg/win-maximize.svg";
import WinClose from "../../../assets/images/svg/win-close.svg";

import Logo from "../../../assets/images/svg/logo.svg";

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
  const [hoverControls, setHoverControls] = useState(false);

  const os = process.platform;

  const topButtonClass =
    os == "darwin" ? sharedCss.topButtonMac : sharedCss.topButton;

  const topButtonsContainerClass =
    os == "darwin"
      ? sharedCss.topButtonsContainerMac
      : sharedCss.topButtonsContainer;

  const isReverse = os == "darwin";

  const MinimizeSVG = os == "darwin" ? MacMinimize : WinMinimize;
  const MaximizeSVG = os == "darwin" ? MacMaximize : WinMaximize;
  const CloseSVG = os == "darwin" ? MacClose : WinClose;

  // Define components for simple ordering later
  const iconStyle: CSSProperties = {
    fill: os == "darwin" ? (hoverControls ? "#000000bf" : "#00000000") : "#FFF",
    margin: "auto",
  };

  const minimize = (
    <div
      onClick={clickMinimize}
      className={`${sharedCss.minimize} ${topButtonClass}`}
    >
      <MinimizeSVG style={iconStyle} />
    </div>
  );

  const maximize = (
    <div
      onClick={clickMaximize}
      className={`${sharedCss.maximize} ${topButtonClass}`}
    >
      <MaximizeSVG style={iconStyle} />
    </div>
  );

  const close = (
    <div
      onClick={clickClose}
      className={`${sharedCss.close} ${topButtonClass}`}
    >
      <CloseSVG style={iconStyle} />
    </div>
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
        <Logo style={{ margin: "2px 6px", opacity: 0.6 }} />
        {loginState !== LOGIN_OK ? (
          <div className={mainCss.topArtist}>{props.artist}</div>
        ) : (
          <></>
        )}
        {props.offline && isReverse && offline}
      </div>
      <div
        onMouseEnter={(): void => setHoverControls(true)}
        onMouseLeave={(): void => setHoverControls(false)}
        className={topButtonsContainerClass}
      >
        {props.offline && !isReverse && offline}
        {os == "darwin"
          ? [close, minimize, maximize]
          : [minimize, maximize, close]}
      </div>
    </div>
  );
}
