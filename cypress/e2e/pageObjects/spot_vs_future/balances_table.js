import Balances from "../balances/balances";

class BalancesTable {
  // START OF HELPER FUNCTIONS

  // Extract value from the field by selector
  GetText(selector) {
    return new Promise((resolve) => {
      cy.get('table[id="systable"]', { timeout: 60000 })
        .eq(1)
        .get(selector)
        .invoke("text")
        .then((txt) => resolve(txt.toString()));
    });
  }

  // Extract value from the field by selector and index
  GetTextByIndex(selector, contractName, cellIndex, tableIndex = 2) {
    return new Promise((resolve) => {
      cy.get(".vs-table--content", { timeout: 60000 })
        .eq(tableIndex)
        .find(`${selector}.${contractName}`)
        // .find(selector)
        // .eq(index)
        // .contains(contractName)
        // .parent()
        .find("td")
        .eq(cellIndex)
        .invoke("text")
        .then((txt) => resolve(txt.toString()));
    });
  }

  // change currency on the dashboard
  changeCurrency(currency) {
    cy.get("button")
      .contains("Currencies")
      .trigger("mouseover", { force: true });
    cy.get(".vs-dropdown--item").contains(currency).click();
  }
  // END OF HELPER FUNCTIONS

  // Check headers for the Balances table
  CheckBalancesHeaders() {
    cy.get("table")
      .eq(2)
      .find("thead")
      .then((el) => {
        const collumnHeaders = [
          "Contract",
          "Asset",
          "Group",
          "Discount Hedged",
          "Discount Unhedged",
          "Instrument",
          "Account",
          "Market",
          "Base Currency",
          "Quote Currency",
          "Margin Currency",
          "Loans",
          "Balance",
          "Collateral",
          "Long",
          "Short",
          "Loans, BTC",
          "Balances, BTC",
          "Collateral, BTC",
          "Long, BTC",
          "Short, BTC",
        ];
        for (let i of collumnHeaders) {
          expect(el).to.contain(i);
        }
      });
  }

  /* Complete preconditions:
  1. Go to test Dashboard
  2. Navigate to the Spot Tab
  3. Find needed records and enable them
  4. Wait to take effect on the Risk Manager
  */

  /*
  1. Go to SpotvsFuture table
  2. Find Balances table
  2. Find first records with contracts: "BTC", "SOL", "ETH", "USDT"
  3. Iterare each record through bunch of checks based on test cases
  */

  checkContract(item) {
    this.GetTextByIndex(".tr-values", item, 0).then((contract) => {
      this.GetTextByIndex(".tr-values", item, 5).then((instrument) => {
        if (instrument === "spot") {
          this.GetTextByIndex(".tr-values", item, 1).then((asset) => {
            expect(contract).to.eq(asset);
          });
        } else {
          // need to check test case for additional logic
        }
      });
    });
  }

  checkAsset(item) {
    this.GetTextByIndex(".tr-values", item, 1).then((asset) => {
      this.GetTextByIndex(".tr-values", item, 8).then((baseCurrency) => {
        expect(asset).to.eq(baseCurrency);
      });
    });
  }

  checkGroup() {
    // ** Wait to synchronize preprod and simulation envs **
    // Check Currency for current record
    // Go to discounts table
    // Check assigned Group for this Currency
    // Group for the record should be same as in Discounts table mapping
  }

  checkDiscountHendged() {
    // Wait to synchronize preprod and simulation
  }

  checkDiscountUnhendged() {
    // Wait to synchronize preprod and simulation
  }

  checkInstrument() {
    // Check record in simulation (in specific tab) and compare with the instrument value
    this.GetTextByIndex(".tr-values", "btc", 1).then((instrument) => {
      if (instrument === "spot") {
      }
    });
  }

  checkMarket() {
    this.GetTextByIndex(".tr-values", "btc", 8).then((market) => {
      expect(market).not.to.be.empty;
    });
  }

  chekBaseCurrency() {
    this.GetTextByIndex(".tr-values", "btc", 1).then((instrument) => {
      if (instrument === "spot") {
        // Use currency of balance
      } else {
      }
    });
  }

  checkBalance(item) {
    this.GetTextByIndex(".tr-values", item, 1).then((instrument) => {
      if (instrument === "spot") {
        // value should equal to balance in given currency
      } else if (instrument.includes("collateral")) {
        this.GetTextByIndex(".tr-values", item, 12).then((balance) => {
          expect(balance).to.be.empty;
        });
      } else {
        // if instrument is derivative the formulas are used wich currently unable to reproduce
      }
    });
  }

  checkCollateral(item) {
    this.GetTextByIndex(".tr-values", item, 1).then((instrument) => {
      if (instrument === "spot" || instrument.includes("in transfer")) {
        this.GetTextByIndex(".tr-values", item, 13).then((collateral) => {
          this.GetTextByIndex(".tr-values", item, 12).then((balance) => {
            expect(collateral).to.eq(balance);
          });
        });
      } else if (instrument.includes("collateral")) {
        //  Statement for Native Margin - Position & Net Amount	or Native margin - Borrow + Interest
      }
    });
  }

  checkLong(item) {
    this.GetTextByIndex(".tr-values", item, 14).then((long) => {
      this.GetTextByIndex(".tr-values", item, 12).then((balance) => {
        if (balance != "") {
          expect(long).to.eq(balance);
        } else {
          expect(long).to.eq("Temp value");
        }
      });
    });
  }

  checkShort(item) {
    this.GetTextByIndex(".tr-values", item, 16).then((short) => {
      this.GetTextByIndex(".tr-values", item, 12).then((balance) => {
        if (parseFloat(balance) < 0) {
          expect(short).to.eq(balance);
        } else {
          expect(short).to.eq("Temp value");
        }
      });
    });
  }

  commonConvertionCheck() {
    // Check convertaion for 	"Loans, {}", "Balances, {}", "Collateral, {}", "Long, {}", "Short, {}"
    cy.get(".vs-dropdown--item").then((currencies) => {
      for (currency of currencies) {
        this.changeCurrency(currency);
        this.GetTextByIndex(".tr-values", "BTC", 12).then((loans) => {
          this.GetTextByIndex(".tr-values", "BTC", 12).then(
            (loansCurrency) => {}
          );
        });
        this.GetTextByIndex(".tr-values", "BTC", 13).then((balances) => {
          this.GetTextByIndex(".tr-values", "BTC", 13).then(
            (balancesCurrency) => {}
          );
        });
        this.GetTextByIndex(".tr-values", "BTC", 14).then((collateral) => {
          this.GetTextByIndex(".tr-values", "BTC", 14).then(
            (collateralCurrency) => {}
          );
        });
        this.GetTextByIndex(".tr-values", "BTC", 15).then((long) => {
          this.GetTextByIndex(".tr-values", "BTC", 15).then(
            (longCurrency) => {}
          );
        });
        this.GetTextByIndex(".tr-values", "BTC", 16).then((short) => {
          this.GetTextByIndex(".tr-values", "BTC", 15).then(
            (shortCurrency) => {}
          );
        });
      }
    });

    // Switch currency at the top and calculate Convertions
    // Iterate for each currency
    // Get correct currency for convertion at a given time (where can I get it?)
  }

  //Switch to Balances Page
  SwitchToBalancesPage() {
    cy.reload();
    cy.visit("https://test002.bqtstuff.com/risk-manager/balances");
    cy.wait(7000);
    cy.get("button[class='vs-con-dropdown parent-dropdown ml-auto']>a").trigger(
      "mouseover",
      { force: true }
    );
    cy.get('a[class="vs-dropdown--item-link"]').contains(" Safeh ").click();
    cy.wait(3000);
  }
}
export default BalancesTable;
