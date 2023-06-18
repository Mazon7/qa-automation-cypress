import LoginPage from "./pageObjects/login_page.js";
import PasswordPage from "./pageObjects/password_page.js";
import TransferPage from "./pageObjects/transfer_page.js";
import AdminPage from "./pageObjects/adminPage.js";
import { usersStage } from "../../constants";

describe("Test suite for Deposit workflow: check for user access after turn on/off Bank button in admin panel and makes basic UI assertions. Then checks wallet address.", function () {
  const loginPage = new LoginPage();
  const passwordPage = new PasswordPage();
  const transferPage = new TransferPage();
  const adminPage = new AdminPage();

  it.skip("Remove a bankAccount checkbox for the test user and check the warning screen shows when trying to deposit.", function () {
    adminPage.LoginAdmin();
    adminPage.CheckBankAccount();
  });

  it.skip("Logs to portal and checks that you cannot open Deposit", function () {
    cy.visit(env.STAGE_OPEARATOR_URL);
    passwordPage.Login();
    cy.choose_portfolio();
    transferPage.DepositNegative();
  });

  it.skip("Enables Bank button", function () {
    adminPage.LoginAdmin();

    adminPage.CheckBankAccount();
  });

  it.skip("Logs to portal and checks validates that you can open Deposit, user selects EOS as currency.", function () {
    cy.visit(env.STAGE_OPEARATOR_URL);

    passwordPage.Login();
    cy.choose_portfolio();

    transferPage.DepositCheck();
  });

  // Matches the Wallet Adreess from DB and UI
  it.skip("Match wallet addresses check", function () {
    cy.visit(env.STAGE_OPEARATOR_URL + "login");
    passwordPage.Login();
    cy.choose_portfolio();

    transferPage.MatchWalletAddress();
  });
});
