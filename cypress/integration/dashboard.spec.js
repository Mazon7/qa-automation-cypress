import dashboardPage from "./pageObjects/dashboardPage.js";
import { usersStage } from "../../constants";

describe("User login tests", function () {
  const DashboardPage = new dashboardPage();

  before(function () {
    cy.clearCookies();
  });

  beforeEach(function () {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);
    cy.choose_portfolio();
  });

  it.skip("Check dashboard", function () {
    DashboardPage.aggregated_Balance();
    DashboardPage.zoom();
    DashboardPage.spot_Asset_AllocationCurrency();
    DashboardPage.spot_Asset_AllocationExchange();
    DashboardPage.pagination();
    DashboardPage.latest_Trades();
    DashboardPage.latest_Transactions();
  });
});
