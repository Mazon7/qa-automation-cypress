import { OPERATOR_SELECTORS } from "../../../selectors";

class AdminPage {
  // case

  LoginAdmin() {
    cy.wait(1000);
    cy.visit(env.ADMIN_PORTAL_URL + "login");
    const Email = env.STAGE_LOGIN;
    const Password = "12345678aAa";
    cy.get(OPERATOR_SELECTORS.EMAIL_INPUT_ADMIN).type(Email);
    cy.get(OPERATOR_SELECTORS.PASSWORD_INPUT_ADMIN).type(Password);
    this.SignInAdmin();
    cy.wait(10000);
    cy.reload();
    cy.wait(500);
  }

  SignInAdmin() {
    cy.get(OPERATOR_SELECTORS.SIGN_IN_ADMIN).click();
  }

  IsInternalFlow() {
    this.LoginAdmin();
    this.IsInternalCheck();
  }

  CheckBankAccount() {
    // click on panel to see accoiunts
    cy.get('div[class="fullscreen q-drawer__backdrop"]').click();
    cy.get('table[class="q-table"] td[class="text-left"]').each(
      ($e1, index) => {
        const text = $e1.text();
        if (text.includes("aleksey-portfolio")) {
          cy.get('[class="row fit no-wrap items-start content-start"] a')
            .eq(index)
            .click();
        }
      }
    );
    cy.wait(3000);
    cy.get("tr[class]>td:nth-child(1)").each(($e1, index) => {
      const text = $e1.text();
      if (text.includes("yo245")) {
        cy.get('[class="row fit no-wrap items-start content-start"] a')
          .eq(index)
          .click();
      }
    });
    // uncheck Is Bank for account
    cy.get('[aria-label="Bank account"]').click();
    cy.get('div[class="row full-width justify-start q-py-sm"] button')
      .eq(0)
      .click();
    cy.get('div[class="q-notification__message col"]').should(
      "have.text",
      "API key updated"
    );
  }

  IsInternalCheck() {
    cy.get(
      ".v-expansion-panel--active > .v-expansion-panel-header > :nth-child(1) > :nth-child(2) > .row > :nth-child(1) > .v-btn__content > .v-icon"
    ).click({ force: true });

    cy.get(
      ":nth-child(4) > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple"
    ).click({ force: true });

    // cy.get(':nth-child(2) > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click() // is active click
    //cy.get(':nth-child(2) > .v-expansion-panel-header > :nth-child(1)').click() // click on panel to see accoiunts
    //cy.get(':nth-child(1) > :nth-child(9) > .d-flex > .mr-2').click()
    cy.get(
      ".px-2 > .v-card__actions > :nth-child(3) > .v-btn__content"
    ).click(); // click save
  }

  IsActiveCheck() {
    cy.get(
      "#app > div.v-application--wrap > header > div > div.v-toolbar__items > a.v-btn--active.v-btn.v-btn--flat.v-btn--router.v-btn--text.theme--dark.v-size--default > span"
    ).click({ force: true });

    cy.get("#app > div.v-application--wrap > header > div > a > span").click({
      force: true,
    });

    // cy.get(':nth-child(2) > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click() // is active click
    cy.get(":nth-child(2) > .v-expansion-panel-header > :nth-child(1)").click(); // click on panel to see accoiunts
    cy.get(":nth-child(1) > :nth-child(9) > .d-flex > .mr-2").click();
    cy.get(
      ":nth-child(13) > .v-input__control > .v-input__slot > .v-label"
    ).click({ force: true }); // uncheck Is active for account
    cy.get(".v-card__actions > :nth-child(3) > .v-btn__content").click(); // click save
  }
}

export default AdminPage;
