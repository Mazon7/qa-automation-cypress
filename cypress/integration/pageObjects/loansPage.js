import { LOGIN_FORM_SELECTORS } from "../../../selectors";
import { ACCOUNTS_TAB_SELECTORS } from "../../../selectors";
import { LOANS_TAB_SELECTORS } from "../../../selectors";
import { NEW_ADDRESS_WINDOW } from "../../../selectors";
import { DASHBOARD_SELECTORS } from "../../../selectors";

import { usersStage } from "../../../constants";

class loansPage {
  GoToLoans() {
    cy.get(DASHBOARD_SELECTORS.HEADER).contains("Loans").click({ force: true });
  }
  current_Loans() {
    cy.get(LOANS_TAB_SELECTORS.LOANS_TAB)
      .contains("Current Loans")
      .click({ force: true });
  }

  loan_Archive() {
    cy.get(LOANS_TAB_SELECTORS.LOANS_TAB)
      .contains("Loan Archive")
      .click({ force: true });
  }

  ltv() {
    cy.get(LOANS_TAB_SELECTORS.TOTAL);
    cy.get(LOANS_TAB_SELECTORS.LTV_CHART);
  }
}
export default loansPage;
