import RegisterPage from "./pageObjects/registration_page.js";
describe("Register page tests", function () {
  const registerPage = new RegisterPage();

  before(function () {
    cy.clearCookies();
  });

  beforeEach(function () {
    cy.visit(env.STAGE_CP_URL + "register");
  });

  it("user can successfully register", function () {
    registerPage.registerNewUser();
  });

  it("Error messages checks", function () {
    let wrongPasswords = [
      "123",
      Array(74).join("1"),
      "12345678",
      "A1234567",
      "Abcdefgh",
      "A123456a!!!",
      "A1234567aب",
      " ",
      "A1234567a",
    ];

    let errors = [
      "Field must have no less than 8 characters",
      "Field must have no more than 72 characters",
      "Field should contain at least one upper case character",
      "Field should contain at least one lower case character",
      "Field should contain at least one digit character",
      "Field should not contain 3 consecutive identical characters",
      "Field should only contain latin, numeric or special characters",
      "Field is required",
      "Password confirmation does not match",
    ];

    // Check email field
    registerPage.CheckErrors(0, " ").contains("Field is required");
    registerPage.CheckErrors(0, "a").contains("Email is not valid");
    registerPage.ClearField(0);

    // Check password field
    for (let i of Array(9).keys()) {
      registerPage.CheckErrors(1, wrongPasswords[i]).contains(errors[i]);
      registerPage.ClearField(1);
    }

    // Confirm Password empty field check
    registerPage.CheckErrors(2, " ").contains("Field is required");
  });
});
