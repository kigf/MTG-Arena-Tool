import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../../shared-redux/stores/rendererStore";
import HotApp from "./App";

export default function RenderApp(): void {
  ReactDOM.render(
    <Provider store={store}>
      <HotApp />
    </Provider>,
    document.getElementById("appcontainer")
  );
}
