/* eslint-env jest */
import globals from "../globals";

describe("globals", () => {
  it("checks all global flags for production", () => {
    expect(globals.debugLog).toBe(false);
    expect(globals.debugNet).toBe(false);
  });
});
