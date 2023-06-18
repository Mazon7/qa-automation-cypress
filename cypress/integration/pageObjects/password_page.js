import { LOGIN_FORM_SELECTORS } from "../../../selectors";
import { usersStage } from "../../../constants";

class PasswordPage {
  Login() {
    cy.login_stage(usersStage.STAGE_LOGIN, usersStage.STAGE_PASS);
  }

  LoginUpperCase() {
    const UpperEmail = env.STAGE_LOGIN;
    const oldPassword = env.STAGE_PASS;
    cy.get(
      ".inputs > :nth-child(1) > .PBInput > .PBInput__wrapper > .PBInput__input"
    )
      .first()
      .type(UpperEmail, { force: true });
    cy.get(
      ".inputs > :nth-child(2) > .PBInput > .PBInput__wrapper > .PBInput__input"
    ).type(oldPassword, { force: true });

    this.SignInClick();
    cy.wait(1000);
    this.TwofAuthSubmit();
  }

  NewPassLogin() {
    const newPassword = "12345678aA#$!";
    const oldEmail = "vitaly.bogachev@bequant.io";
    cy.get(
      ".inputs > :nth-child(1) > .PBInput > .PBInput__wrapper > .PBInput__input"
    )
      .first()
      .type(oldEmail, { force: true });

    cy.get(
      ".inputs > :nth-child(2) > .PBInput > .PBInput__wrapper > .PBInput__input"
    ).type(newPassword, { force: true });

    this.SignInClick();
    cy.wait(1000);
    this.TwofAuthSubmit();
  }

  Logout() {
    cy.get(".test-profile-menu").click({ force: true });
    cy.contains("Logout").click({ force: true });
  }

  SignInClick() {
    cy.get(".login-form__actions > .mb-24").click({ force: true });
  }

  TwofAuthSubmit() {
    // Currently skip the 2FA setup

    cy.get(".Popup__window", { timeout: 10000 })
      .find(".PBButton")
      .contains("Skip")
      .click({ force: true });
  }

  TwofAuthEnable() {
    this.Login();
    this.GoToProfile();
    cy.get("button").contains("Enable 2FA").click({ force: true });
    cy.get(".qr-code").screenshot("qrcode");
    cy.DecodeQR("qrcode");
  }

  SavePassword() {
    cy.get(".test-save-changes").click({ force: true });
  }

  changeUserPassword() {
    const oldPassword = "12345678aAa";
    const newPassword = "12345678aA#$!";

    //this.Login()
    cy.visit(env.DEV_URL + "profile/");

    cy.get(".test-current-password .test-input")
      .first()
      .type(oldPassword, { force: true });
    cy.get(".test-new-password .test-input")
      .first()
      .type(newPassword, { force: true });
    cy.get(".test-confirm-password .test-input")
      .first()
      .type(newPassword, { force: true });
    this.SavePassword();
  }
  changePasswordBack() {
    const oldPassword = "12345678aAa";
    const newPassword = "12345678aA#$!";

    //this.Login()
    cy.visit(env.DEV_URL + "profile/");

    cy.get(".test-current-password .test-input")
      .first()
      .type(newPassword, { force: true });
    cy.get(".test-new-password .test-input")
      .first()
      .type(oldPassword, { force: true });
    cy.get(".test-confirm-password .test-input").type(oldPassword, {
      force: true,
    });
    this.SavePassword();
  }

  Sideclick() {
    cy.get(".layout-container").click();
    cy.wait(500);
  }

  CheckPasswordErrors(inputSelector, WrongPass) {
    this.Sideclick();
    cy.get(inputSelector).find(".test-input").type(WrongPass, { force: true });
    return cy.get(".test-input-error");
  }

  ClearField(inputSelector) {
    return cy.get(inputSelector).find(".test-input").clear({ force: true });
  }

  GoToProfile() {
    // Need explicit wait for UI to be shown
    cy.wait(5000);
    // Click onto the profile dropdown
    cy.get(".test-dropdown-trigger").eq(2).click({ force: true });
    // Click Security button
    cy.get("a").contains("Security").click({ force: true });
  }
}

export default PasswordPage;
