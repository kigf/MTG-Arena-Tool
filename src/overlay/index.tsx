import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import OverlayController from "./OverlayController";
import TransparencyFix from "./electron-transparency-mouse-fix";

import store from "../shared/redux/stores/overlayStore";
import initializeRendererReduxIPC from "../shared/redux/initializeRendererReduxIPC";

initializeRendererReduxIPC(store);

function ready(fn: () => void): void {
  const theDocument = document as any;
  if (
    theDocument.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  const wrap = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <OverlayController />
    </Provider>,
    wrap
  );
  document.body.appendChild(wrap);
  setTimeout(() => {
    new TransparencyFix({
      log: false,
      fixPointerEvents: "auto",
    });
  }, 1000);
});
