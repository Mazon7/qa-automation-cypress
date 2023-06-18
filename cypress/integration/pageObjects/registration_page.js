import { usersStage } from "../../../constants";
import { faker } from "@faker-js/faker";
class RegisterPage {
  registerNewUser() {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomString = faker.name.firstName();
    const randomPassword = `${randomNumToString.slice(0, 8)}784336hsgd`;

    // TODO: add random email and google verification

    const Email = `${randomString}@example.com`;
    const Password = "12345678aA";

    cy.get('[label="Register"]').find(".PBInput__input").eq(0).type(Email);
    this.Sideclick();

    cy.get('[label="Register"]')
      .find(".PBInput__input")
      .eq(1)
      .type(Password, { force: true });

    cy.get('[label="Register"]')
      .find(".PBInput__input")
      .eq(2)
      .type(Password, { force: true });

    this.clickCheckbox();
    cy.wait(1000);
    // Intercept registration request
    cy.intercept(env.STAGE_CP_URL + "register").as("GetUserId");
    this.clickSubmit();

    // Currently registration process is confirmed by showing welcoming message on the screen
    cy.get(".PBStatus")
      .should("contain", "Welcome to BEQUANT Pro")
      .and(
        "contain",
        "To login, please confirm your email address by clicking the Finish signup button in the email we’ve just sent to Your email address."
      );

    // Immediately remove created user
    /*cy.wait("@GetUserId").then((interception) => {
      this.DeleteUser(interception.response.body.id);
    });*/
  }

  DeleteUser(id) {
    // Login for getting cookie
    cy.request({
      url: env.DEV_URL + "api/v2/login",
      method: "POST",
      body: { email: usersStage.STAGE_LOGIN, password: usersStage.STAGE_PASS },
    }).then((response) => {
      // Delete user
      cy.request({
        url: env.DEV_URL + `api/users/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${response.body.token}`,
        },
      });
    });
  }

  ClearField(inputNumber) {
    return cy
      .get('[label="Register"]')
      .find(".PBInput__input")
      .eq(inputNumber)
      .clear({ force: true });
  }

  Sideclick() {
    cy.get(".auth-layout-container").click();
    cy.wait(500);
  }

  clickSubmit() {
    cy.get("button").contains("Sign up").click({ force: true }); // Click on Sign Up button
  }
  clickCheckbox() {
    cy.get(
      //'input[id="i-understand-and-agree-to-the-terms-and-conditions."]'
      ".PBCheckbox__box"
    ).click({ force: true }); // Click on checkbox
  }

  CheckErrors(n, WrongPass) {
    this.Sideclick();
    cy.get('[label="Register"]')
      .find(".PBInput__input")
      .eq(n)
      .type(WrongPass, { force: true });
    return cy.get(".PBInput__error");
  }
}

export default RegisterPage;
