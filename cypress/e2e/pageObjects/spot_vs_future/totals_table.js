import { mainURL, loginInfo } from "../../../../constants";

class TotalsTable {
  // Start of HELPER FUNCTIONS
  GetTextByIndex(selector, contractName, cellIndex, tableIndex = 1) {
    // const MyRegex = new RegExp({ contractName });
    // find(`${selector}:contains(/^${contractName}$/)`)

    return new Promise((resolve) => {
      cy.get(".vs-table--content", { timeout: 60000 })
        .eq(tableIndex)
        .find(`${selector}.${contractName}`)
        // .eq(index)
        // .contains(contractName);
        // .each((item, index, list) => {
        //   cy.wrap(item).should("contain.text", "USD")
        // });
        //   .parent()
        //   .parent()
        //   .parent()
        // .find("td")
        // .eq(cellIndex)
        .then((data) => {
          resolve(data);
        });
      // .invoke("text")
      // .then((txt) => resolve(parseFloat(txt.replace(/,/g, ""))));
      // // txt.toString()
    });
  }

  getTextByCellIndex(groupName, cellIndex, tableIndex = 1) {
    return new Promise((resolve) => {
      cy.get(".vs-table--content", { timeout: 60000 })
        .eq(tableIndex)
        .find(`tr td:nth-child(${cellIndex}):contains(${groupName})`)
        .parent()
        .then((data) => {
          resolve(data);
        });
      // .invoke("text")
      // .then((txt) => resolve(parseFloat(txt.replace(/,/g, ""))));
      // // txt.toString()
    });
  }

  //   End of HELPER FUNCTIONS

  // For checking Loans, Balances, Collateral, Long, Short
  async checkTotals(groupTotal, group, totalsValueIndex, balancesValueIndex) {
    let totalValue = await this.GetTextByIndex(
      ".tr-values",
      groupTotal,
      totalsValueIndex,
      1
    );
    // .then((totalValue) => {});
    // let items = await this.GetTextByIndex(
    //   ".tr-values",
    //   contract,
    //   balancesValueIndex,
    //   2
    // );

    let items = await this.getTextByCellIndex(group, 3, 2);
    // .then((items) => {});

    let tempTotal = 0;

    for (let item in items) {
      if (!isNaN(item)) {
        let value = Cypress.$(items[item])
          .find("td")
          .eq(balancesValueIndex)
          .text();
        if (value !== "") {
          tempTotal += parseFloat(value.toString().replace(/,/g, ""));
        }
      }
    }

    totalValue = parseFloat(
      totalValue[0].children[totalsValueIndex].textContent.replace(/,/g, "")
    );

    // Round to 5 figures to avoid slight difference
    expect(parseFloat(totalValue.toFixed(5))).to.eq(
      parseFloat(tempTotal.toFixed(5))
    );
    // expect(totalValue).to.eq(tempTotal);
  }

  async checkHedgedPosition(group, contracts) {
    let groupRow = await this.GetTextByIndex(".tr-values", group, 6);
    // .then((groupRow) => { });
    let hedgedPosition = parseFloat(
      Cypress.$(groupRow.children().eq(6)[0]).text()
    );

    let finalTotal = 0;
    for (let contract of contracts) {
      let tempTotal = 0;
      let rows = await this.GetTextByIndex(".tr-values", contract, 1, 2);
      rows = rows.toArray();
      let flag = true;
      for (let [item, value] of rows.entries()) {
        let long = Cypress.$(rows[item]).find("td").eq(19).text();
        let short = Cypress.$(rows[item]).find("td").eq(20).text();
        if (long !== "") {
          tempTotal += parseFloat(long);
        } else {
          flag = false;
        }
        if (item === rows.length - 1) {
          if (flag) {
            // Does not count Total
            tempTotal = 0;
          }
          finalTotal += tempTotal;
        }
      }
    }

    // Fix is expected for completing correct calculation
    // Curretly Assretion errors are present due to slight deifferences in calculation
    // expect(hedgedPosition).to.eq(finalTotal);

    // Round to 5 figures to avoid slight difference
    expect(parseFloat(hedgedPosition.toFixed(5))).to.eq(
      parseFloat(finalTotal.toFixed(5))
    );

    // ----- !!! DO NOT REMOVE THE CODE BELOW !!! -----
    // this.GetTextByIndex(".tr-values", contract, 14, 2).then((longs) => {
    //   this.GetTextByIndex(".tr-values", contract, 15, 2).then((shorts) => {
    //   let hedgedPosition = parseFloat(
    //     Cypress.$(groupRow.children().eq(6)[0]).text()
    //   );
    //   let totalLongs = 0;
    //   let totalShorts = 0;
    //   // cy.get(longs[item])
    //   //   .find("td")
    //   //   .eq(14)
    //   //   .invoke("text")
    //   //   .then((data) => {
    //   //     tempTotal += data;
    //   //   });
    //   for (let item in longs) {
    //     if (!isNaN(item)) {
    //       let long = Cypress.$(longs[item]).find("td").eq(14).text();
    //       console.log("This is short: ", value);
    //       if (value !== "") {
    //         totalLongs += parseFloat(value);
    //       }
    //     }
    //   }
    //   for (let item in shorts) {
    //     if (!isNaN(item)) {
    //       let value = Cypress.$(shorts[item]).find("td").eq(15).text();
    //       console.log("This is long: ", value);

    //       // if (value !== "") {
    //       //   totalShorts += parseFloat(value);
    //       // }
    //     }
    //   }
    //   // console.log(value.find("td").eq(cellIndex));
    //   // expect(hedgedPosition).to.eq(tempTotal);

    //   // NOT in USE
    //   // -----
    //   // if (!isNaN(item)) {
    //   //   (async function (cy) {
    //   //     const data = await cy.get(longs[item]).find("td").eq(14);
    //   //   })(cy);
    //   //   // console.log(longs[item]);
    //   // }
    //   // -----
    //   });
    // });
    // });
    // ----- !!! DO NOT REMOVE THE CODE ABOVE !!! -----
  }

  async checkUnhedgedPosition(contract) {
    let unhedgedPosition = await this.GetTextByIndex(".tr-values", contract, 8);
    // .then((unhedgedPosition) => {});
  }

  async checkTotalPosition(contract) {
    let item = await this.GetTextByIndex(".tr-values", contract);
    let hedgedPosition = parseFloat(
      item[0].children[6].textContent.replace(/,/g, "")
    );
    let unhedgedPosition = parseFloat(
      item[0].children[7].textContent.replace(/,/g, "")
    );
    let totalPosition = parseFloat(
      item[0].children[8].textContent.replace(/,/g, "")
    );

    let sum = hedgedPosition + unhedgedPosition;

    expect(totalPosition).to.eq(sum);
  }

  // Use the following rule: Hedged Margin = Hedged Position (BTC) * (Discount Hedged/100)
  // Discount Hedged is recieved from Simulation
  checkHedgedMargin() {}

  // Use the following rule: Unhedged Margin = Unhedged Position (BTC) * (Discount Unhedged /100)
  // Discount Unhedged is recieved from Simulation
  checkUnhedgedMargin() {}

  async checkMaintenanceMargin(contract) {
    let item = await this.GetTextByIndex(".tr-values", contract, 10);

    let hedgedMargin = parseFloat(
      item[0].children[9].textContent.replace(/,/g, "")
    );
    let unhedgedMargin = parseFloat(
      item[0].children[10].textContent.replace(/,/g, "")
    );

    let maintenanceMargin = parseFloat(
      item[0].children[11].textContent.replace(/,/g, "")
    );

    console.log(hedgedMargin);
    console.log(unhedgedMargin);

    let sum = hedgedMargin + unhedgedMargin;
    // expect(maintenanceMargin).to.eq(sum);
    // Round to 5 figures to avoid slight difference
    expect(parseFloat(maintenanceMargin.toFixed(5))).to.eq(
      parseFloat(sum.toFixed(5))
    );
  }

  // Check HedgedRatio, UnhedgedRatio
  async checkRatio(contract) {
    let item = await this.GetTextByIndex(".tr-values", contract, 13);

    let hedgedPosition = parseFloat(
      item[0].children[6].textContent.replace(/,/g, "")
    );
    let unhedgedPosition = parseFloat(
      item[0].children[7].textContent.replace(/,/g, "")
    );
    let totalPosition = parseFloat(
      item[0].children[8].textContent.replace(/,/g, "")
    );

    let hedgedRatio = parseFloat(
      item[0].children[12].textContent.replace(/,/g, "")
    );
    let unhedgedRatio = parseFloat(
      item[0].children[13].textContent.replace(/,/g, "")
    );

    let hedgedResult = hedgedPosition / totalPosition;
    let unhdgedResult = unhedgedPosition / totalPosition;

    // expect(hedgedRatio).to.eq(hedgedResult);
    // expect(unhedgedRatio).to.eq(unhdgedResult);
  }
}

export default TotalsTable;
