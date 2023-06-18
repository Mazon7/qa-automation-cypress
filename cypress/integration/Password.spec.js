import ChangePassword from "./pageObjects/password_page.js";
describe("Password change tests", function () {
  const changePassword = new ChangePassword();

  before(function () {
    cy.clearCookies();
  });

  beforeEach(function () {
    cy.visit(env.STAGE_OPEARATOR_URL + "profile");
  });

  it("User can change password", function () {
    changePassword.Login();
    changePassword.changeUserPassword();
    changePassword.Logout();
    changePassword.NewPassLogin();
    changePassword.changePasswordBack();
  });

  it("Error messages checks", function () {
    // Login to portal
    changePassword.Login();

    // changePassword.ErrorInsufficient();
    changePassword.GoToProfile();

    let currentPassword = ".test-current-password";
    let newPassword = ".test-new-password";
    let confirmPassword = ".test-confirm-password";
    let wrongPasswords = [
      "123",
      Array(74).join("1"),
      "12345678",
      "A1234567",
      "Abcdefgh",
      "A123456a!!!",
      "A1234567aب",
      " ",
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
    ];

    // Check current password field
    for (let i of Array(8).keys()) {
      changePassword
        .CheckPasswordErrors(currentPassword, wrongPasswords[i])
        .contains(errors[i]);
      changePassword.ClearField(currentPassword);
    }

    // Compare old and new passwords
    changePassword.CheckPasswordErrors(currentPassword, "A1234567a");
    changePassword
      .CheckPasswordErrors(newPassword, "A1234567a")
      .contains("Current password and new password should not be the same");
    changePassword.ClearField(currentPassword);
    changePassword.ClearField(newPassword);

    // Check new password & confirm passwords
    for (let i of Array(8).keys()) {
      changePassword
        .CheckPasswordErrors(newPassword, wrongPasswords[i])
        .contains(errors[i]);
      changePassword
        .CheckPasswordErrors(confirmPassword, wrongPasswords[i])
        .contains(errors[i]);
      changePassword.ClearField(newPassword);
      changePassword.ClearField(confirmPassword);
    }

    // Confirm password check
    changePassword
      .CheckPasswordErrors(confirmPassword, "1")
      .contains("Passwords do not match");
    changePassword.ClearField(confirmPassword);
  });
});
