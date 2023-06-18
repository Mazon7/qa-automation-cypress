import accountsPage from "./pageObjects/accountsPage";
import { usersStage } from "../../constants";

describe("Accounts tests", function () {
  const accounts_page = new accountsPage();

  beforeEach(function () {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);
    cy.choose_portfolio();
  });
  it.skip("Goes to Accounts tab and checks search field", function () {
    accounts_page.Search();
    accounts_page.Whitelist();
  });
});
