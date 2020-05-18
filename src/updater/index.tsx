/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import ReactDOM from "react-dom";
import Updater from "./Updater";

function init(): void {
  ReactDOM.render(<Updater />, document.getElementById("container"));
}

init();
