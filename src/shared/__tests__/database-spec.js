/* eslint-env jest */
import db from "../database-wrapper";
import * as httpApi from "../../background/httpApi";

const distributedVersion = db.version;
const httpQueue = httpApi.initHttpQueue();
httpApi.httpGetDatabaseVersion("en");
jest.setTimeout(30000);

describe("database", () => {
  it("updates database properly", () => {
    return httpQueue.drain().then(() => {
      // Check the database in cache is not older than 10 versions
      expect(distributedVersion).toBeGreaterThan(db.version - 10);
      // Check it can access cards
      expect(db.card(71192)?.name).toBe("Lukka, Coppercoat Outcast");
    });
  });
});
