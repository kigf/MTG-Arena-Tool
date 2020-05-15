import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../../shared/redux/stores/rendererStore";
import App from "./App";

export default function RenderApp(): void {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("container")
  );
}
