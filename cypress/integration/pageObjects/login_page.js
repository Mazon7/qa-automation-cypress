class LoginPage {
  TwofAuthSubmit() {
    cy.get(".two-fa-skip-btn").click(); // 2 Auth
  }

  LoginWrongPass() {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomPassword = `${randomNumToString.slice(0, 8)}784336hsgd`;
    const Email = env.STAGE_LOGIN;
    const Password = "1234567AAa";
    cy.get(
      ".inputs > :nth-child(1) > .PBInput > .PBInput__wrapper > .PBInput__input"
    ).type(Email);
    cy.get(
      ".inputs > :nth-child(2) > .PBInput > .PBInput__wrapper > .PBInput__input"
    ).type(randomPassword);
    this.SignIn();
  }

  SignIn() {
    cy.get(".login-form__actions > .mb-24").click();
  }

  SignUp() {
    cy.get(".PBTabs__list > ul > :nth-child(2) > a").click();
    //cy.get("#background > div > span > div > div.form-actions > p > a").click();
  }

  ErrorMessage() {
    return cy.get(".content-noti > .vs-icon");
  }

  DashboardHeader() {
    return cy.get(".Header__title");
  }

  // ClickEmailField() {
  //   cy.get(
  //     ".inputs > :nth-child(1) > .PBInput > .PBInput__wrapper > .PBInput__input"
  //   )
  //     .first()
  //     .click({ force: true });
  // }
  // ClickPassField() {
  //   cy.get(
  //     ".inputs > :nth-child(1) > .PBInput > .PBInput__wrapper > .PBInput__input"
  //   ).click();
  // }

  SideclickAuth() {
    cy.get(".auth-layout-container").click();
    cy.wait(500);
  }

  CheckErrors(wrongInput, field) {
    this.SideclickAuth();
    cy.get(".inputs")
      .find(".PBInput__input")
      .eq(field)
      .type(wrongInput, { force: true });
    return cy.get(".PBInput__error").eq(field);
  }

  ClearField(inputNumber) {
    return cy
      .get(".inputs")
      .find(".PBInput__input")
      .eq(inputNumber)
      .clear({ force: true });
  }
}

export default LoginPage;
