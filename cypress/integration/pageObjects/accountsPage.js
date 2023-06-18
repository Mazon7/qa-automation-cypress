import { LOGIN_FORM_SELECTORS } from "../../../selectors";
import { ACCOUNTS_TAB_SELECTORS } from "../../../selectors";
import { WITHDRAW_ADDRESSES_SELECTORS } from "../../../selectors";
import { NEW_ADDRESS_WINDOW } from "../../../selectors";

import { usersStage } from "../../../constants";

class accountsPage {
  Search() {
    cy.contains("Accounts").click({ force: true });
    cy.get(ACCOUNTS_TAB_SELECTORS.SEARCH).click({ force: true });

    cy.get(ACCOUNTS_TAB_SELECTORS.SEARCH_FIELD).type("yo245", { force: true });
    cy.get(ACCOUNTS_TAB_SELECTORS.COLUNMN).contains("yo245");
    cy.contains("Hide").click({ force: true });
  }
  Whitelist() {
    cy.get(WITHDRAW_ADDRESSES_SELECTORS.OPEN_ACCOUNT).click({ force: true });
    cy.get(WITHDRAW_ADDRESSES_SELECTORS.DROPDOWN_ITEM)
      .contains("Whitelist")
      .click({ force: true });

    cy.get(WITHDRAW_ADDRESSES_SELECTORS.WITHDRAW_ADDRESSES_HEADER)
      .contains("Withdrawal Addresses")
      .contains("Add address")
      .click({ force: true });

    cy.get(NEW_ADDRESS_WINDOW.NEW_ADDRESS_HEADER).contains("Add New Address");

    cy.get(NEW_ADDRESS_WINDOW.NOTIFICATION_MESSAGE).contains(
      "Please allow up to 48 hours for this request to be completed. All withdrawals may be unavailable for your account until the request is processed."
    );
  }
}
export default accountsPage;
