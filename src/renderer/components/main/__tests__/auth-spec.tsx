/* eslint-env jest */
import renderer from "react-test-renderer";

import React from "react";
import Auth from "../Auth";
import { Provider } from "react-redux";
import store from "../../../../shared/redux/stores/rendererStore";

describe("Auth component", () => {
  const form = { email: "jester@gmail.com", pass: "fake", rememberme: false };

  it("renders properly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Auth authForm={form} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
