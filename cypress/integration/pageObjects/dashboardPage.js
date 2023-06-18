import { LOGIN_FORM_SELECTORS } from "../../../selectors";
import { ACCOUNTS_TAB_SELECTORS } from "../../../selectors";
import { DASHBOARD_SELECTORS } from "../../../selectors";
import { NEW_ADDRESS_WINDOW } from "../../../selectors";

import { usersStage } from "../../../constants";

class dashboardPage {
  aggregated_Balance() {
    cy.get(DASHBOARD_SELECTORS.TABLE).contains("Aggregated spot balance");
  }

  zoom() {
    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("1w")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("1m")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("2w")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("3m")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("1y")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("Ytd")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("All")
      .click({ force: true });

    cy.get(DASHBOARD_SELECTORS.ZOOM_CHART)
      .contains("1w")
      .click({ force: true });
  }

  spot_Asset_AllocationCurrency() {
    cy.get(DASHBOARD_SELECTORS.ALLOCATION)
      .contains("By currency")
      .click({ force: true });
  }

  spot_Asset_AllocationExchange() {
    cy.get(DASHBOARD_SELECTORS.ALLOCATION)
      .contains("By exchange")
      .click({ force: true });
  }
  pagination() {
    cy.get(DASHBOARD_SELECTORS.PAGINATION).contains("2").click({ force: true });
    cy.get(DASHBOARD_SELECTORS.PAGINATION_PREV).click({ force: true });
    cy.get(DASHBOARD_SELECTORS.PAGINATION_NEXT).click({ force: true });
  }

  latest_Trades() {
    cy.get(DASHBOARD_SELECTORS.LATEST)
      .contains("Latest trades")
      .click({ force: true });
  }

  latest_Transactions() {
    cy.get(DASHBOARD_SELECTORS.LATEST)
      .contains("Latest transactions")
      .click({ force: true });
  }
}
export default dashboardPage;
