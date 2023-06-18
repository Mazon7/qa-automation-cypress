import {
  DASHBOARD_SELECTORS,
  LOGIN_FORM_SELECTORS,
  ACCOUNTS_TAB_SELECTORS,
  EARN_TAB_SELECTORS,
  NEW_ADDRESS_WINDOW,
} from "../../../selectors";
import { usersStage } from "../../../constants";

class earnPage {
  GoToEarn() {
    cy.get(DASHBOARD_SELECTORS.HEADER).contains("Earn").click({ force: true });
  }

  active_Deposits() {
    cy.get(EARN_TAB_SELECTORS.EARN_TAB)
      .contains("Active Deposits")
      .click({ force: true });
  }

  historical_Deposits() {
    cy.get(EARN_TAB_SELECTORS.EARN_TAB)
      .contains("Historical Deposits")
      .click({ force: true });
  }
}
export default earnPage;
