import tradesPage from "./pageObjects/tradesPage";

import { usersStage } from "../../constants";

describe("Loans tab tests", function () {
  const TradesPage = new tradesPage();

  beforeEach(function () {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);
    cy.choose_portfolio();
  });

  it("Checks Loans tab", function () {
    TradesPage.GoToTrades();
    TradesPage.BuyCheck();
    TradesPage.SellCheck();
    TradesPage.AllCheck();
  });
});
