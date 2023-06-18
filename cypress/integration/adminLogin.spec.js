import LoginPage from "./pageObjects/login_page.js";
import PasswordPage from "./pageObjects/password_page.js";
import AdminPage from "./pageObjects/adminPage.js";

// case - login to admin page, disable Is active and then got to portal and check that transaction (by ID dissaperead)

// check method for checkbox! not click should(be.checked).and('have.value', 'Is Active')

describe("User is Active/Is Internal test flow", function () {
  const loginPage = new LoginPage();
  const passwordPage = new PasswordPage();
  const adminPage = new AdminPage();

  it("User can login as admin and check/uncheck Is Active and Is Internal and ", function () {
    cy.visit(env.ADMIN_PORTAL_URL + "personal");

    adminPage.LoginAdmin();
    adminPage.IsActiveCheck();
    adminPage.IsInternalCheck();
    // go to balances and check by ID that its not present
  });
});
