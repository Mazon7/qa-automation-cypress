import loansPage from "./pageObjects/loansPage";

import { usersStage } from "../../constants";

describe("Loans tab tests", function () {
  const LoansPage = new loansPage();

  beforeEach(function () {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);
    cy.choose_portfolio();
  });

  it("Checks loan tab", function () {
    LoansPage.GoToLoans();
    LoansPage.current_Loans();
    LoansPage.loan_Archive();
    LoansPage.current_Loans();
    LoansPage.ltv();
  });
});
