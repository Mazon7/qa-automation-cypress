import { WITHDRAW_WINDOW_SELECTORS } from "../../../selectors";
import { DASHBOARD_SELECTORS } from "../../../selectors";
import { usersStage } from "../../../constants";

class withdrawPage {
  checkWithdrawUI() {
    cy.contains("Withdraw").click({ force: true });

    cy.get(WITHDRAW_WINDOW_SELECTORS.BANK_ACCOUNT).click({ force: true }); // Bank
    cy.get(WITHDRAW_WINDOW_SELECTORS.BANK_DROPDOWN).click({ force: true }); // Bank dropdown

    cy.get(WITHDRAW_WINDOW_SELECTORS.CURRENCY).click({ force: true }); // Currency
    cy.get(WITHDRAW_WINDOW_SELECTORS.CURRENCY_DROPDOWN)
      .contains("EOS")
      .click({ force: true }); // Currency dropdown

    cy.get(WITHDRAW_WINDOW_SELECTORS.ADDRESS).click({ force: true }); // Address
    // Address dropdown
    cy.get(WITHDRAW_WINDOW_SELECTORS.ADDRESS_DROPDOWN).contains(
      " Add new address to Whitelist "
    );
    // Choose Address from dropdown
    cy.get(WITHDRAW_WINDOW_SELECTORS.ADDRESS_FROM_DROPDOWN).click({
      force: true,
    }); // Address

    cy.get(WITHDRAW_WINDOW_SELECTORS.AMOUNT)
      .click({ force: true }) // Amount
      .type(0, { force: true });
    cy.get(WITHDRAW_WINDOW_SELECTORS.ERROR_ZERO_AMOUNT).contains(
      "Value should be greater than zero"
    );
    cy.get(WITHDRAW_WINDOW_SELECTORS.AMOUNT).clear({ force: true });

    cy.get(WITHDRAW_WINDOW_SELECTORS.AMOUNT)
      .click({ force: true }) // Amount
      .type(1, { force: true });
    cy.wait(3000);
    cy.get(WITHDRAW_WINDOW_SELECTORS.WITHDRAW_BUTTON).click({ force: true }); // Withdraw button
    cy.wait(2000);
    cy.get(WITHDRAW_WINDOW_SELECTORS.WITHDRAW_VALIDATION);
    cy.contains("Withdrawal submitted").click({
      force: true,
    });
    cy.get(WITHDRAW_WINDOW_SELECTORS.WITHDRAW_VALIDATION_CLOSE).click({
      force: true,
    });

    // Select BankQA
    // Select Currency USDT20
    // Select Address
    // Choose amount - Wrong, check error 'Amount should be more than withdraw fee'
    // Choose correct amount
    // Choose Zero check 'Value should be greater than zero'
    // Click All
    // Click Withdraw
  }

  transactionsWithdraw() {
    cy.get(DASHBOARD_SELECTORS.HEADER)
      .contains("Transactions")
      .click({ force: true }); // Bank
    cy.get(DASHBOARD_SELECTORS.TRANSACTIONS_TAB)
      .contains("Withdrawal")
      .click({ force: true });
  }

  checkWithdrawBackend() {
    cy.request({
      url: env.DEV_URL + "api/v2/login",
      method: "POST",
      body: { email: usersStage.STAGE_LOGIN, password: usersStage.STAGE_PASS },
    }).then((response) => {
      // Get balance before withdraw
      let oldBalance;
      cy.GetSpotBalances(response.body.token).then((response) => {
        const obj = response.body.balances.find(
          (x) => x.apiKeyId === env.API_KEY_ID
        );
        oldBalance = parseFloat(obj.balance.EOS);
      });

      // Make withdraw request
      cy.request({
        url:
          env.DEV_URL +
          "api/wallet/withdraw?portfolioId=a763ecf2-a4d1-11ea-a830-0242ac130003&apiKeyId=" +
          env.API_KEY_ID,
        method: "POST",
        body: {
          address: "binancecleos",
          amount: "0.11",
          apiKeyId: env.API_KEY_ID,
          paymentId: "100267626",
          currency: "EOS",
        },
        headers: {
          Authorization: `Bearer ${response.body.token}`,
        },
      }).then((response) => {
        let uuid = response.body.uuid;

        cy.wait(10000);
        // Assert withdraw has been sent to payout service
        cy.request({
          url: env.DEV_URL + `api/internal/withdraw-requests/${uuid}`,
          method: "GET",
          headers: {
            Authorization:
              "Bearer bdc39ff75fb24559a3e3b0bef3e38289d76a63e254b3",
          },
        }).then((response) => {
          expect(response.body.status).to.eq(5);
        });
      });

      // After some time check that balance has changed (less than old one)
      cy.wait(350000);
      cy.GetSpotBalances(response.body.token).then((response) => {
        // Get object by apiKeyId
        const obj = response.body.balances.find(
          (x) => x.apiKeyId === env.API_KEY_ID
        );
        expect(parseFloat(obj.balance.EOS)).to.be.lessThan(oldBalance);
      });

      // Check transaction exist by address, type and ammount and other properties
      cy.request({
        url:
          env.DEV_URL +
          "api/v2/my/transactions?portfolioId=a763ecf2-a4d1-11ea-a830-0242ac130003&limit=5",
        method: "GET",
        headers: { Authorization: `Bearer ${response.body.token}` },
      }).then((response) => {
        const transaction = response.body.find(
          (x) =>
            x.address === "binancecleos" &&
            x.type === "payout" &&
            x.currency === "EOS" &&
            x.exchangeId === "bequant" &&
            x.amount === "0.010000000000000000000000000000" &&
            x.fee === "0.100000000000000000"
        );
        expect(transaction).to.exist;
      });
    });
  }
}
export default withdrawPage;
