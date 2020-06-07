/* eslint-env jest */

import getSetCodeInEventId from "../getSetInEventId";

describe("utils", () => {
  it("Set codes are detected preperly", () => {
    expect(getSetCodeInEventId("Ladder")).toBeUndefined();
    expect(getSetCodeInEventId("Historic_Shakeup_20200606")).toBeUndefined();
    expect(getSetCodeInEventId("TestName_WithIkoInIt")).toBeUndefined();
    expect(getSetCodeInEventId("Sealed_DAR_20190304")).toBe("DAR");
    expect(getSetCodeInEventId("QuickDraft_GRN_20190412")).toBe("GRN");
    expect(getSetCodeInEventId("PremierDraft_IKO_20200416")).toBe("IKO");
    expect(getSetCodeInEventId("CompDraft_WAR_20190425")).toBe("WAR");
  });
});
