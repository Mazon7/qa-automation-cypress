import { LOGIN_FORM_SELECTORS } from "../../../selectors";
import { ACCOUNTS_TAB_SELECTORS } from "../../../selectors";
import { TRADES_TAB_SELECTORS } from "../../../selectors";
import { DASHBOARD_SELECTORS } from "../../../selectors";

import { usersStage } from "../../../constants";

class tradesPage {
  GoToTrades() {
    cy.get(DASHBOARD_SELECTORS.HEADER)
      .contains("Trades")
      .click({ force: true });
  }

  BuyCheck() {
    cy.get(TRADES_TAB_SELECTORS.TAB).contains("Buy").click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.SEARCH).click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.SEARCH_FIELD).type("Hit");
    cy.get(TRADES_TAB_SELECTORS.TABLE_TRADES).contains("HitBTC");
    cy.get(TRADES_TAB_SELECTORS.SEARCH);
    cy.contains("Hide").click({ force: true });
    this.filter_trades();
    this.download_trades();
  }

  SellCheck() {
    cy.get(TRADES_TAB_SELECTORS.TAB).contains("Sell").click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.SEARCH).click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.SEARCH_FIELD).type("Hit");
    cy.get(TRADES_TAB_SELECTORS.TABLE_TRADES).contains("HitBTC");
    cy.get(TRADES_TAB_SELECTORS.SEARCH);
    cy.contains("Hide").click({ force: true });

    this.filter_trades();
    this.download_trades();
  }

  AllCheck() {
    cy.get(TRADES_TAB_SELECTORS.TAB).contains("All").click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.SEARCH).click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.SEARCH_FIELD).type("Hit", { force: true });
    cy.get(TRADES_TAB_SELECTORS.TABLE_TRADES);
    cy.get(TRADES_TAB_SELECTORS.SEARCH);
    cy.contains("Hide").click({ force: true });

    this.filter_trades();
    this.download_trades();
  }

  filter_trades() {
    cy.get(TRADES_TAB_SELECTORS.FILTER).click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN);
    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN_SELECT)
      .contains("Choose exchange")
      .click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN)
      .contains("Bequant")
      .click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN_EXCHANGE).click({
      force: true,
    });

    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN_SELECT)
      .contains("Choose instrument")
      .click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN)
      .contains("BTC-USD")
      .click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.FILTER_DROPDOWN_INSTRUMENT).click({
      force: true,
    });

    cy.get(TRADES_TAB_SELECTORS.DATE_RANGE).click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.DATE_PICKER)
      .contains("1")
      .click({ force: true });
    cy.get(TRADES_TAB_SELECTORS.DATE_PICKER)
      .contains("29")
      .click({ force: true });

    cy.get(TRADES_TAB_SELECTORS.APPLY).click({ force: true });

    this.download_trades();
  }

  download_trades() {
    cy.get(TRADES_TAB_SELECTORS.DOWNLOAD_TRADES).click({ force: true });
  }
}
export default tradesPage;
