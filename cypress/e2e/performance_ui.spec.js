import AccessToken from "../support/serviceObject/access_token";
import * as TEST_DATA from "../fixtures/test_data";

describe("time performance", function () {
  const accessToken = new AccessToken();
  it(`performance test`, async function () {
    cy.visit(Cypress.env("stage_url") + "login?redirect=%2F");
    cy.wait(2000);
    cy.get('input[placeholder="Enter email address"]').type(
      TEST_DATA.USER_DATA.MAIL,
      { force: true }
    );
    cy.get('input[placeholder="Enter password"]').type("123456Aa", {
      force: true,
    });
    cy.get(".login-form__actions button").click({ force: true });
    let codeNumber = await accessToken.GetCodeNumber(
      TEST_DATA.USER_DATA.MAIL,
      TEST_DATA.USER_DATA.PASSWORD,
      TEST_DATA.USER_DATA.SECRET_2FA
    );
    const arrayOfCodenumber = codeNumber.split("");
    cy.log(codeNumber);
    cy.get(".TwoFaInput__section>input:first-child").each(
      ($el, index, $list) => {
        cy.wrap($el).type(arrayOfCodenumber[index], { force: true });
      }
    );
    cy.get('a[href="/defi"]').click({ force: true });
    cy.wait(2000);
    cy.get('[class="Popup__footer"] button[class="PBButton "]').click({
      force: true,
    });

    cy.get('[class="PBTabs__list"] a[data-v-6c7d01e7]')
      .contains("DeFi Balances")
      .click({ force: true });

    cy.get(
      '[label="DeFi Balances"] div[class="flex flex-row width-100 align-center"]'
    ).each(($el, index, $list) => {
      cy.wrap($el).click({ force: true });
    });
    //2
    const number = await new Cypress.Promise((resolve) => {
      cy.get('div[class="flex flex-row width-100"]>:nth-child(3) span').each(
        ($el, index, $list) => {
          cy.wrap($el)
            .invoke("text")
            .then((txt) => {
              if (txt.toString() == "USDT_TEST2_3") {
                cy.get(
                  'div[class="flex flex-row width-100"]>:nth-child(5) div[class="flex flex-column"]>:nth-child(1)'
                )
                  .eq(index)
                  .invoke("text")
                  .then((txt) => resolve(txt.toString()));
              }
            });
        }
      );
    });
    cy.log(number + " this is our before number before swap");

    cy.get('[class="PBTabs__list"] a[data-v-6c7d01e7]')
      .contains("DeFi Protocols")
      .click({ force: true });

    cy.get('button[class="PBButton "]')
      .contains("Execute swap")
      .click({ force: true });

    //3
    cy.get('[class="PBSelect test-select"]')
      .eq(0)
      .within(() => {
        cy.get('[class="test-select-option"] strong')
          .contains("USDT_TEST2_3")
          .click({ force: true });
      });

    cy.get('[class="PBSelect test-select"]')
      .eq(1)
      .within(() => {
        cy.get('[class="test-select-option"] strong')
          .contains("COMP_AQ_KOVAN")
          .click({ force: true });
      });
    cy.wait(1000);
    cy.get('input[class="PBInput__input test-input PBInput__input--append"]')
      .eq(1)
      .clear({ force: true })
      .type("3", { force: true });
    cy.wait(10000);
    cy.get('[class="PBInput__input test-input"]')
      .eq(0)
      .type("10", { force: true });
    cy.wait(10000);
    cy.get('[class="test-transfer-submit PBButton "]').click({ force: true });
    cy.wait(10000);
    cy.get('[class="Popup__close test-popup-close"]').click({ force: true });

    //4
    cy.get('[class="PBTabs__list"] a[data-v-6c7d01e7]')
      .contains("DeFi Balances")
      .click({ force: true });
    cy.get(
      '[label="DeFi Balances"] div[class="flex flex-row width-100 align-center"]'
    ).each(($el, index, $list) => {
      cy.wrap($el).click({ force: true });
    });
    cy.get('div[class="flex flex-row width-100"]>:nth-child(3) span').each(
      ($el, index, $list) => {
        cy.wrap($el)
          .invoke("text")
          .then((txt) => {
            if (txt.toString() == "USDT_TEST2_3") {
              var start = new Date().getTime();
              var localTimeStart = new Date();
              for (let i = 0; i < (30 * 60) / 3; i++) {
                cy.get('button[class="ml-24 PBButton bordered white"]').click({
                  force: true,
                });
                cy.wait(3000);
                cy.get(
                  'div[class="flex flex-row width-100"]>:nth-child(5) div[class="flex flex-column"]>:nth-child(1)'
                )
                  .eq(index)
                  .invoke("text")
                  .then((numberAfter) => {
                    cy.log(number + " this is number before");
                    cy.log(numberAfter + " this is number after");
                    if (number !== numberAfter) {
                      var end = new Date().getTime();
                      var localTimeEnd = new Date();
                      var time = end - start;
                      var minutes = Math.floor(time / 60000);
                      var seconds = ((time % 60000) / 1000).toFixed(0);
                      cy.log(
                        "Execution time: " +
                          minutes +
                          ":" +
                          (seconds < 10 ? "0" : "") +
                          seconds
                      );
                      cy.log(
                        "Execution time: " +
                          minutes +
                          ":" +
                          (seconds < 10 ? "0" : "") +
                          seconds
                      );
                      cy.log(
                        "Execution time: " +
                          minutes +
                          ":" +
                          (seconds < 10 ? "0" : "") +
                          seconds
                      );
                      cy.log(localTimeStart + " start time");
                      cy.log(localTimeEnd + " end  time");

                      cy.get("toast-loading").should("exist");
                    }
                  });
              }
            }
          });
      }
    );
  });

  it(`performance test status `, async function () {
    cy.visit(Cypress.env("stage_url") + "login?redirect=%2F");
    cy.wait(2000);
    cy.get('input[placeholder="Enter email address"]').type(
      TEST_DATA.USER_DATA.MAIL,
      { force: true }
    );
    cy.get('input[placeholder="Enter password"]').type("123456Aa", {
      force: true,
    });
    cy.get(".login-form__actions button").click({ force: true });
    let codeNumber = await accessToken.GetCodeNumber(
      TEST_DATA.USER_DATA.MAIL,
      TEST_DATA.USER_DATA.PASSWORD,
      TEST_DATA.USER_DATA.SECRET_2FA
    );
    const arrayOfCodenumber = codeNumber.split("");
    cy.log(codeNumber);
    cy.get(".TwoFaInput__section>input:first-child").each(
      ($el, index, $list) => {
        cy.wrap($el).type(arrayOfCodenumber[index], { force: true });
      }
    );
    cy.get('a[href="/defi"]').click({ force: true });
    cy.wait(2000);
    cy.get('[class="Popup__footer"] button[class="PBButton "]').click({
      force: true,
    });

    cy.get('[class="PBTabs__list"] a[data-v-6c7d01e7]')
      .contains("DeFi Balances")
      .click({ force: true });

    cy.get(
      '[label="DeFi Balances"] div[class="flex flex-row width-100 align-center"]'
    ).each(($el, index, $list) => {
      cy.wrap($el).click({ force: true });
    });
    //2
    const number = await new Cypress.Promise((resolve) => {
      cy.get('div[class="flex flex-row width-100"]>:nth-child(3) span').each(
        ($el, index, $list) => {
          cy.wrap($el)
            .invoke("text")
            .then((txt) => {
              if (txt.toString() == "USDT_TEST2_3") {
                cy.get(
                  'div[class="flex flex-row width-100"]>:nth-child(5) div[class="flex flex-column"]>:nth-child(1)'
                )
                  .eq(index)
                  .invoke("text")
                  .then((txt) => resolve(txt.toString()));
              }
            });
        }
      );
    });
    cy.log(number + " this is our before number before swap");

    cy.get('[class="PBTabs__list"] a[data-v-6c7d01e7]')
      .contains("DeFi Protocols")
      .click({ force: true });

    cy.get('button[class="PBButton "]')
      .contains("Execute swap")
      .click({ force: true });

    //3
    cy.get('[class="PBSelect test-select"]')
      .eq(0)
      .within(() => {
        cy.get('[class="test-select-option"] strong')
          .contains("USDT_TEST2_3")
          .click({ force: true });
      });

    cy.get('[class="PBSelect test-select"]')
      .eq(1)
      .within(() => {
        cy.get('[class="test-select-option"] strong')
          .contains("COMP_AQ_KOVAN")
          .click({ force: true });
      });
    cy.wait(1000);
    cy.get('input[class="PBInput__input test-input PBInput__input--append"]')
      .eq(1)
      .clear({ force: true })
      .type("3", { force: true });
    cy.wait(10000);
    cy.get('[class="PBInput__input test-input"]')
      .eq(0)
      .type("10", { force: true });
    cy.wait(10000);
    cy.get('[class="test-transfer-submit PBButton "]').click({ force: true });
    cy.wait(10000);
    cy.get('[class="Popup__close test-popup-close"]').click({ force: true });

    //4
    cy.get('[class="PBTabs__list"] a[data-v-6c7d01e7]')
      .contains("Transactions")
      .click({ force: true })
      .then(() => {
        cy.wait(5000);
        cy.get('button[class="ml-24 PBButton bordered white"]').click({
          force: true,
        });
        var start = new Date().getTime();
        var localTimeStart = new Date();
        for (let i = 0; i < (30 * 60) / 3; i++) {
          cy.get('[class="pl-12"] span')
            .eq(0)
            .invoke("text")
            .then((status) => {
              cy.log(status + " this is status ");
              if (status == "Completed") {
                var end = new Date().getTime();
                var localTimeEnd = new Date();
                var time = end - start;
                var minutes = Math.floor(time / 60000);
                var seconds = ((time % 60000) / 1000).toFixed(0);
                cy.log(
                  "Execution time: " +
                    minutes +
                    ":" +
                    (seconds < 10 ? "0" : "") +
                    seconds
                );
                cy.log(
                  "Execution time: " +
                    minutes +
                    ":" +
                    (seconds < 10 ? "0" : "") +
                    seconds
                );
                cy.log(
                  "Execution time: " +
                    minutes +
                    ":" +
                    (seconds < 10 ? "0" : "") +
                    seconds
                );
                cy.log(localTimeStart + " start time");
                cy.log(localTimeEnd + " end  time");

                cy.get("toast-loading").should("exist");
              }
            });
          cy.wait(3000);
          cy.get('button[class="ml-24 PBButton bordered white"]').click({
            force: true,
          });
        }
      });
  });
});
