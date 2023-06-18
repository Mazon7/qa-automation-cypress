import LoginPage from "./pageObjects/login_page.js";
import PasswordPage from "./pageObjects/password_page.js";
import TransferPage from "./pageObjects/transfer_page.js";

describe("User transfer tests", function () {
  const loginPage = new LoginPage();
  const passwordPage = new PasswordPage();
  const transferPage = new TransferPage();

  before(function () {
    cy.clearCookies();
  });

  beforeEach(function () {
    cy.visit(env.DEV_URL);
    cy.choose_portfolio();
  });

  it("User can make EOS transfer", function () {
    passwordPage.Login();
    transferPage.CSVexport();
    transferPage.TransferEOS();
  });
});
