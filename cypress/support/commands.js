import { LOGIN_FORM_SELECTORS } from "../../selectors";
import { DASHBOARD_SELECTORS } from "../../selectors";

Cypress.Commands.add("login_stage", (username, password) => {
  cy.visit(Cypress.env("env").STAGE);
  cy.get(LOGIN_FORM_SELECTORS.EMAIL_INPUT)
    .first()
    .type(username, { force: true });
  cy.get(LOGIN_FORM_SELECTORS.PASSWORD_INPUT)
    .first()
    .type(password, { force: true });
  cy.get(LOGIN_FORM_SELECTORS.SUBMIT_BUTTON).click({ force: true });
  cy.get(LOGIN_FORM_SELECTORS.TWOF_WINDOW);
  cy.get(LOGIN_FORM_SELECTORS.TWOF_SKIP).first().click({ force: true });
});

Cypress.Commands.add("choose_portfolio", () => {
  cy.visit(Cypress.env("env").STAGE);
  cy.get(DASHBOARD_SELECTORS.HEADER)
    .click()
    .contains("my-portfolio")
    .click({ force: true });
  cy.contains(env.PORTFOLIO_NAME).click({ force: true });
});

// Get Spot balances for env.PORTFOLIO_NAME (a763ecf2-a4d1-11ea-a830-0242ac130003)
Cypress.Commands.add("GetSpotBalances", (token) => {
  cy.request({
    url:
      env.DEV_URL +
      "api/my/balance/spot?portfolioId=a763ecf2-a4d1-11ea-a830-0242ac130003",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
});
