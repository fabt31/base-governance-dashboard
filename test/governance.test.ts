import { GovernanceDashboard } from "../src/dashboard";
describe("GovernanceDashboard", () => {
  it("initializes with rpc", () => {
    const dash = new GovernanceDashboard({ rpc: "https://mainnet.base.org" });
    expect(dash).toBeDefined();
  });
});
