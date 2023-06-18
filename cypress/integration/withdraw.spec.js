import withdrawPage from "./pageObjects/withdrawPage";
import { usersStage } from "../../constants";

describe("Accounts tests", function () {
  const withdraw_page = new withdrawPage();

  before(function () {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);

    cy.choose_portfolio();
  });

  it("Withdraw EOS from UI", function () {
    withdraw_page.checkWithdrawUI();
  });

  it.skip("Checks Withdrawal tab in Transactions", function () {
    withdraw_page.transactionsWithdraw();
  }); // in Progress

  it.skip("Withdraw EOS from Backend", function () {
    withdraw_page.checkWithdrawBackend();
  });
});
