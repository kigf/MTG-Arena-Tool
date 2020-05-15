/* eslint-env jest */
import renderer from "react-test-renderer";

import React from "react";
import { App } from "../App";
import { Provider } from "react-redux";
import store from "../../../shared/redux/stores/rendererStore";

describe("App component", () => {
  it("renders properly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
