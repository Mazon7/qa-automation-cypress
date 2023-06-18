import earnPage from "./pageObjects/earnPage.js";
import { usersStage } from "../../constants";
//

describe("Earn tab tests", function () {
  const EarnPage = new earnPage();

  beforeEach(function () {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);
    cy.choose_portfolio();
  });

  it("Tests Earn active, historical tabs", function () {
    EarnPage.GoToEarn();
    EarnPage.active_Deposits();
    EarnPage.historical_Deposits();
  });
});
