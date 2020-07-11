import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../../shared/redux/stores/rendererStore";
import App from "./App";
import reloadTheme from "../../shared/utils/reloadTheme";

export default function RenderApp(): void {
  reloadTheme();
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("container")
  );
}
