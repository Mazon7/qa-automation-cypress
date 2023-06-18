import { usersStage } from "../../../constants";
class TransferPage {
  CheckLinks() {
    cy.get(".medium").invoke("removeAttr", "target").click();
  }

  CSVexport() {
    cy.get('[href="/trades"]').click();
    cy.get(".download-csv-container > .PBIcon > use").click();
    cy.get(
      ".export-btn > .Popup > .Popup__window > .Popup__content > .p-32 > .PBStatus > p"
    ).contains(
      "The link to CSV file with exported trades was sent to your email."
    );
    //cy.get('[style=""] > .vs-popup > .vs-popup--header > .vs-popup--title > h3').contains('Export CSV')
    cy.get(
      ".export-btn > .Popup > .Popup__window > .Popup__content > .p-32 > .PBStatus > .PBButton"
    ).click();
  }

  // Check that the  Wallet Adreess from CP mathces the address in UI and on exchange
  MatchWalletAddress() {
    // Hardcoded Portfolio Id and ApiKeyId for Bank (QA) account
    const portfolioId = "a763ecf2-a4d1-11ea-a830-0242ac130003";
    const apiKeyId = "cae57c4b-1138-490f-8bc2-e43f5f2e1c32";

    const coins = ["ETH", "BTC", "USDT20", "EOS"];
    // For each coin do the following checks
    for (let i of coins) {
      // Get Wallet address from CP
      cy.request({
        url: env.DEV_URL + "api/v2/login",
        method: "POST",
        body: {
          email: usersStage.STAGE_LOGIN,
          password: usersStage.STAGE_PASS,
        },
      }).then((response) => {
        cy.request({
          url:
            env.DEV_URL +
            `api/wallet/deposit/address?currency=${i}&portfolioId=${portfolioId}&apiKeyId=${apiKeyId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${response.body.token}` },
        }).then((response) => {
          expect(response.status).to.be.ok;
          const WalletAddress = response.body.address; // Get Wallet address
          const paymentId = response.body.paymentId; // Get paymentId for EOS

          // Open deposit tab
          cy.get(".test-open-deposit").click({ force: true });

          // Choose account from dropdown
          cy.get(".test-select-dropdown")
            .eq(0)
            .find(".test-select-option")
            .contains("Bank (QA)")
            .click({ force: true });

          // Assert that address is shown
          cy.get(".deposit-modal__address-block").should(
            "not.contain",
            "Loading"
          );

          // Choose coin from dropdown
          cy.get(".test-select-dropdown")
            .eq(1)
            .find(".test-select-option")
            .contains(new RegExp("^" + i + "$", "g"))
            .click({ force: true });

          // Assert that address is shown
          cy.get(".deposit-modal__address-block").should(
            "not.contain",
            "Loading"
          );

          if (i == "USDT20") {
            // Show Wallet address element
            cy.get(".deposit-modal__address-block")
              .find("button")
              .click({ force: true });
          } else if (i == "EOS") {
            cy.get(".deposit-modal__block-content")
              .invoke("text")
              .then((text) => {
                // Check EOS paymentId with UI
                expect(text.trim()).to.equal(paymentId);
              });
          }
          cy.get(".deposit-modal__address")
            .invoke("text")
            .then((text) => {
              // Check wallets address with UI
              expect(text.trim()).to.equal(WalletAddress);
            });

          // API used for getting API keys and secret keys
          cy.request({
            url: env.DEV_URL + `api/internal/apikeys`,
            method: "GET",
            headers: {
              Authorization:
                "Bearer bdc39ff75fb24559a3e3b0bef3e38289d76a63e254b3",
            },
          }).then((response) => {
            expect(response.status).to.be.ok;
            // Get object by uuid
            const obj = response.body.find(
              (x) => x.uuid === "cae57c4b-1138-490f-8bc2-e43f5f2e1c32"
            );
            // Generate authorization credentials
            const credentials = Buffer.from(
              obj.apiKey + ":" + obj.apiSecret
            ).toString("base64");

            // Get wallet adress for each coin for Bank (QA) account from exchange
            cy.request({
              url: env.EXCHANGE_URL + `api/2/account/crypto/address/${i}`,
              method: "GET",
              headers: {
                Authorization: "Basic " + credentials,
              },
            }).then((response) => {
              expect(response.status).to.be.ok;
              // Check wallet address between CP with Exchange
              if (i == "EOS") {
                expect(response.body.paymentId).to.equal(paymentId);
              }
              expect(response.body.address).to.equal(WalletAddress);
            });
          });
        });
      });
    }
  }

  DepositCheck() {
    cy.contains("Deposit").click({ force: true });
    cy.get(":nth-child(2) > .PBSelect__trigger").click({ force: true }); // clicks dropdown for instrument
    cy.get(".test-select-search").type("EOS", { force: true });
    cy.get(".list-option").contains("EOS").click({ force: true });
    cy.get(".deposit-modal__warning-message").contains(
      "Error loading wallet information"
    );
  }
  DepositNegative() {
    cy.contains("Deposit").click({ force: true });
    cy.get(":nth-child(2) > .PBSelect__trigger").click({ force: true });
    cy.get(".PBSelect__empty"); // no currency

    cy.get(".deposit-modal__block");
    cy.get(".deposit-modal__home").click();
  }

  TransferEOS() {
    cy.get(".test-open-deposit").contains("Deposit").click();
    cy.get(".popup-support > .vs-popup > .vs-popup--header > .vs-icon").click();

    cy.get(".btn-group").contains("Withdraw").click();
    cy.get(".popup-support > .vs-popup > .vs-popup--header > .vs-icon").click();

    cy.get(".btn-group").contains("Transfer").click();

    //  cy.get('#vs1__combobox > .vs__actions > .vs-icon').should('be.visible').click()
    cy.get("input.vs__search").first().type("EO");

    //cy.get('#vs1__combobox > .vs__selected-options').contains('EOS').click()
    cy.get(".bequant-select-option").contains("EOS").click();
    /*.each(($el, index, $list) => {
                                  if($el.text()==="EOS")
                                  {
                                    $el.click()
                                  }
                                })*/

    cy.get("#vs2__combobox").click();
    cy.get(".bequant-select-option").contains("Bequant").click();
    cy.get(".bequant-select-option-exchange").contains("Account 3").click();
    cy.get("#vs2__combobox > .vs__actions > .vs-icon").click(); // check button

    cy.get("#vs3__combobox").click();
    cy.get(".bequant-select-option").contains("Binance").click();
    cy.get(".bequant-select-option-exchange").contains("Account 3").click();

    cy.get(".bequant-select-option-exchange").first().click();
    cy.get(".bequant-select-option").contains("EOS").click();

    //cy.get('#vs2__option-1').click()

    // EOS transfer
    //cy.get('.vs-inputx').should('be.visible').clear();

    cy.get(".vs-inputx").should("be.visible").type("30");
    cy.get(".span-text-validation")
      .contains("Amount should be less than or equal to subaccount balance")
      .should("be.visible");
    cy.get(".vs-inputx").clear();
    cy.get(".vs-inputx").should("be.visible").type("0");
    cy.get(".span-text-validation")
      .contains("Value should be greater than zero")
      .should("be.visible");
    cy.get(".vs-inputx").clear();

    cy.get(".vs-inputx").should("be.visible").type("1");
    cy.get(".transfer-fee-eta-details")
      .contains("Fee: 0.1 EOS")
      .should("be.visible");
    // cy.get('.transfer-details > h3').contains('Total: 2.9 EOS').should('be.visible')
    cy.get(".transfer-form > .vs-button").click();
    cy.wait(5);
    cy.get("h2").contains("Transaction successful");
    cy.get(".transfer-result > h3").contains("1 EOS");
    cy.get(".transfer-result > .vs-component").should("be.visible").click();
  }

  NewFormTransfer() {
    cy.get(".test-open-transfer").contains("Transfer").click(); // Transfer button click on main page
    cy.get(".Popup__close").click(); // 'X' button to close Transfer window

    cy.get(".test-open-transfer").contains("Transfer").click(); // opens Transfer window again

    cy.get(":nth-child(1) > .PBSelect > .PBSelect__trigger").click(); // clicks on dropdown to open searech in Currency field

    cy.get(".test-select-search").type("EOS"); // types EOS in search field

    cy.get(".list-option").contains("EOS").click(); // Clicks EOS from dropdown

    cy.get(":nth-child(2) > .PBSelect > .PBSelect__trigger").click(); // Clicks on 'From'

    cy.get(
      ":nth-child(3) > .PBSelect > .PBSelect__trigger > .PBSelect__placeholder"
    ).type("account 3"); // Types account name in search field, checks filter and lower case letters passed fine

    cy.get(
      ':nth-child(2) > .PBSelect > .PBSelect__dropdown > .os-host > .os-padding > .os-viewport > .os-content > .PBSelect__list > :nth-child(1) > [data-v-dd11b090=""]'
    )
      .contains("Bequant")
      .click(); // Selects Bequant Account 3 and clicks it

    cy.get(":nth-child(3) > .PBSelect > .PBSelect__trigger").click(); // Clicks on 'To'

    cy.get(
      ":nth-child(3) > .PBSelect > .PBSelect__trigger > .PBSelect__placeholder"
    ).type("account 3"); // Types account name in search field, checks filter and lower case letters passed fine

    cy.get(
      ':nth-child(3) > .PBSelect > .PBSelect__dropdown > .os-host > .os-padding > .os-viewport > .os-content > .PBSelect__list > .test-select-option > [data-v-dd11b090=""] > .list-option'
    ).click(); // Selects Binance Account 3 and clicks it

    cy.get(
      ':nth-child(3) > .PBSelect > .PBSelect__dropdown > .os-host > .os-padding > .os-viewport > .os-content > .PBSelect__list > :nth-child(1) > [data-v-dd11b090=""]'
    ).click(); // Clicks on Spot (need selector for this menu with All, Spot, EOS Margin)

    cy.get(".PBCheckbox__box").click(); // Clicks on Instant Transfer

    cy.get(".transfer-details-total__bottom > :nth-child(1)").contains("1 EOS"); // Asserts that Fee is correctly represented

    cy.get(".transfer-details-total__top > div").contains("2.5974 EOS"); // Asserts transfer details sum

    cy.get(".PBButton").contains("Transfer").click(); // Click Transfer button

    cy.get(".transfer-result > h2").contains("Transaction successful").click();

    // View hisotory check - .transfer-result > a

    cy.get(".mb-12").contains("Close Window").click(); // Closes window when transfer executed
  }
}

export default TransferPage;
