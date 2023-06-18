import LoginPage from "./pageObjects/login_page.js";
import PasswordPage from "./pageObjects/password_page.js";

describe("User login tests", function () {
  const loginPage = new LoginPage();
  const passwordPage = new PasswordPage();

  before(function () {
    cy.clearCookies();
  });

  beforeEach(() => {
    cy.visit(Cypress.env("env").STAGE);
  });

  it("User can login", function () {
    passwordPage.Login();
    loginPage.DashboardHeader();
  });

  it("User can login with upper case letters in email", function () {
    passwordPage.LoginUpperCase();
    loginPage.DashboardHeader();
  });

  it("Error messages checks", function () {
    // Checks email field
    loginPage.CheckErrors(" ", 0).contains("Field is required");
    loginPage.ClearField(0);

    loginPage.CheckErrors("test", 0).contains("Email is not valid");
    loginPage.ClearField(0);

    // Checks password field
    loginPage.CheckErrors(" ", 1).contains("Field is required");
    loginPage.ClearField(1);
  });
});
