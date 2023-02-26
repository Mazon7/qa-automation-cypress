import { mainURL, loginInfo } from "../../../../constants";

class SummaryTable {
  GetTextByIndex(selector, cellIndex, tableIndex = 0) {
    return new Promise((resolve) => {
      cy.get(".vs-table--content", { timeout: 60000 })
        .eq(tableIndex)
        .find(`${selector}`)
        .find("td")
        .eq(cellIndex)
        .invoke("text")
        .then((txt) => resolve(txt.toString()));
    });
  }

  getTextByCellIndex(cellIndex, tableIndex = 1) {
    return new Promise((resolve) => {
      cy.get(".vs-table--content", { timeout: 60000 })
        .eq(tableIndex)
        .find(`tr td:nth-child(${cellIndex})`)
        .then((data) => {
          resolve(data);
        });
      // .invoke("text")
      // .then((txt) => resolve(parseFloat(txt.replace(/,/g, ""))));
      // // txt.toString()
    });
    // :contains(${groupName})
  }

  Login() {
    const login = loginInfo.login;
    const pass = loginInfo.pass;

    cy.get('input[type="email"]').type(login);
    cy.get('input[type="password"]').type(pass);

    cy.get("button").click();
    cy.location("pathname", { timeout: 10000 }).should("include", "/2fa");

    cy.task("generateOTP", loginInfo.secret_preprod).then((token) => {
      // Paste 2FA code and login
      cy.get("input").type(token);
      cy.get("button").contains("Login").click();
    });
  }

  SwitchToSnapshot() {
    cy.visit(`${mainURL.preprod}risk-manager/spotvsfut`);
    cy.wait(7000);
    //
    // cy.get(".snapshot-selector > button").trigger("mouseover");
    // cy.wait(4000);
    // cy.get(".vs-dropdown--item-link").contains("Snapshot").click();
    // cy.get(".vdp-datepicker", { timeout: 10000 }).should("be.visible");
    // cy.get(".con-vs-loading", { timeout: 60000 }).should("not.exist");
    // cy.get(".vdp-datepicker > div > input").click();
    // for(;true;){
    //   if(await (this.GetText('[class="day__month_btn up"]'))=="Nov 2021"){
    //     break;
    //   }
    //   cy.get('[class=prev]').eq(0).click()
    // }

    //
    // cy.get("span[class='cell day selected highlighted today']").last().click();
    // cy.get(".time-selector", { timeout: 60000 }).should("be.visible");
    // cy.get(".time-selector").trigger("mouseover", { force: true });
    // cy.get(".vs-dropdown--menu", { timeout: 60000 }).should("be.visible");
    // cy.get(".vs-dropdown--menu").children().first().click();
    // cy.get(".con-vs-loading", { timeout: 60000 }).should("not.exist");
    // cy.wait(10000);
    // Switch to Master(QA) account
    cy.get("button").contains("Accounts").trigger("mouseover", { force: true });
    cy.get(".vs-dropdown--item").contains("Master(QA)").click();
    cy.wait(3000);
  }

  SwitchToLive() {
    cy.visit(`${mainURL.preprod}risk-manager/spotvsfut`);
    cy.wait(7000);
    cy.get("button[class='vs-con-dropdown parent-dropdown ml-auto']>a").trigger(
      "mouseover",
      { force: true }
    );
    cy.get(".vs-dropdown--item").contains("Safeh").click();
    cy.wait(3000);
  }

  // Check Summary values for client
  CheckSummaryHeaders() {
    cy.get("table")
      .eq(0)
      .find("thead")
      .then((el) => {
        const collumnHeaders = [
          "Client Name",
          "Discount Group",
          "Status",
          "Leverage Ratio",
          "Available",
          "Hedged Margin",
          "Unhedged Margin",
          "Maintenance Margin",
          "Hedged Position",
          "Unhedged Position",
          "Total Position",
          "Total Loans",
          "total Assets",
          "Collateral Value",
          "Old Collateral Value",
          "discount Collateral",
          "MTA",
          "Risk Ratio",
          "RRi",
          "RRL",
          "Free Value",
          "Old Free Value",
        ];
        for (let i of collumnHeaders) {
          expect(el).to.contain(i);
        }
      });
  }

  // Extract value from the field by selector
  GetText(selector) {
    return new Promise((resolve) => {
      cy.get(selector)
        .invoke("text")
        .then((txt) => resolve(txt.toString()));
    });
  }

  convertDate() {
    var dateNow = new Date();
    var dd = dateNow.getDate();
    var monthSingleDigit = dateNow.getMonth() + 1,
      mm = monthSingleDigit < 10 ? "0" + monthSingleDigit : monthSingleDigit;
    var yy = dateNow.getFullYear().toString();
    var formattedDate = dd + "/" + mm + "/" + yy;
    return formattedDate;
  }

  async checkClient() {
    let clientName = await this.GetTextByIndex(".tr-values", 0);
    cy.get(".vs-con-dropdown.parent-dropdown.ml-auto")
      .find("a")
      .then((account) => {
        expect(account.clone().children().remove().end().text().trim()).to.eq(
          clientName
        );
      });
  }

  // Check Discount Group
  async discountGroup() {
    // Get Discount Group from Summarry table
    let discountGroup = await this.GetTextByIndex(".tr-values", 1);

    cy.GetAccessToken(mainURL.autotest).then((response) => {
      cy.request({
        url: `${mainURL.autotest}api/v1/marginGroup`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + response.body.access_token,
        },
        timeout: 50000,
      }).then((response) => {
        // Check Discout Group with the marginGroup from Test Dashboard
        expect(response.body[1].name).to.eq(discountGroup);
      });
    });

    // cy.GetAccessToken(mainURL.preprod).then((response) => {
    //   cy.request({
    //     url: `${mainURL.preprod}api/v1/snapshot`,
    //     method: "POST",
    //     headers: {
    //       Authorization: "Bearer " + response.body.access_token,
    //     },
    //     body: {
    //       date: this.convertDate(),
    //       time: "0:00",
    //     },
    //     timeout: 50000,
    //   }).then((response) => {
    //     // Check Discout Group with the data marginGroup for Account
    //     expect(response.body.data.accounts[3].marginGroup).to.eq(discountGroup);
    //   });
    // });
  }

  // Check Status
  async CheckStatus() {
    let riskRatio = await this.GetTextByIndex(".tr-values", 17);

    let rri = await this.GetTextByIndex(".tr-values", 18);
    let rrl = await this.GetTextByIndex(".tr-values", 19);
    let status = await this.GetTextByIndex(".tr-values", 2);
    if (parseFloat(riskRatio) < parseFloat(rri)) {
      expect(status).to.eq("Active");
    } else if (
      parseFloat(riskRatio) > parseFloat(rri) &&
      parseFloat(riskRatio) < parseFloat(rrl)
    ) {
      expect(status).to.eq("Restricted");
    } else if (parseFloat(riskRatio) > parseFloat(rrl)) {
      expect(status).to.eq("Liquidating");
    }
  }

  // Leverage Ratio
  async LeverageRatio() {
    let LeverageRatio = parseFloat(await this.GetTextByIndex(".tr-values", 3));
    let CollateralValue = parseFloat(
      await this.GetTextByIndex(".tr-values", 13)
    );
    let TotalLoans = parseFloat(await this.GetTextByIndex(".tr-values", 11));
    let ExpectedLeverageRatio = TotalLoans / (CollateralValue - TotalLoans);
    expect(LeverageRatio.toFixed(4)).to.eq(ExpectedLeverageRatio.toFixed(4));
  }

  // Available
  async Available() {
    let Available = parseFloat(await this.GetTextByIndex(".tr-values", 4));
    let TotalLoans = parseFloat(await this.GetTextByIndex(".tr-values", 11));
    let DiscountCollateral = parseFloat(
      await this.GetTextByIndex(".tr-values", 15)
    );
    let ExpectAvailable =
      Math.ceil(
        (DiscountCollateral.toFixed(4) -
          TotalLoans.toFixed(4) +
          Number.EPSILON) *
          1000000
      ) / 1000000;
    expect(ExpectAvailable.toFixed(2)).to.eq(Available.toFixed(2));
  }

  // CheckTotals (hedgedMargin, unhedgedMargin,)
  async checkTotals(summaryCell, totalCell) {
    let totalSummary = parseFloat(
      await this.GetTextByIndex(".tr-values", summaryCell)
    );
    let tempTotal = 0;

    let items = await this.getTextByCellIndex(totalCell);

    for (let item in items) {
      if (!isNaN(item)) {
        let value = Cypress.$(items[item]).text();
        if (value !== "") {
          tempTotal += parseFloat(value.toString().replace(/,/g, ""));
        }
      }
    }
    expect(parseFloat(totalSummary.toFixed(5))).to.eq(
      parseFloat(tempTotal.toFixed(5))
    );
  }

  //MaintanceMargin
  async MaintanceMargin() {
    let MaintenanceMargin = parseFloat(
      await this.GetTextByIndex(".tr-values", 7)
    );
    let HedgedMargin = parseFloat(await this.GetTextByIndex(".tr-values", 5));
    let UnhedgedMargin = parseFloat(await this.GetTextByIndex(".tr-values", 6));
    expect(MaintenanceMargin.toFixed(4)).to.eq(
      (HedgedMargin + UnhedgedMargin).toFixed(4)
    );
  }

  //Total Position
  async TotalPosition() {
    let TotalPosition = parseFloat(await this.GetTextByIndex(".tr-values", 10));
    let HedgedPosition = parseFloat(await this.GetTextByIndex(".tr-values", 8));
    let UnhedgedPosition = parseFloat(
      await this.GetTextByIndex(".tr-values", 9)
    );
    expect(TotalPosition.toFixed(4)).to.eq(
      (HedgedPosition + UnhedgedPosition).toFixed(4)
    );
  }

  //Total Assests
  async TotalAssests() {
    let TotalAssests = parseFloat(await this.GetTextByIndex(".tr-values", 12));

    // Get TotalAssests
    let items = await this.getTextByCellIndex(3);
    let tempTotal = 0;
    for (let item in items) {
      if (!isNaN(item)) {
        let value = Cypress.$(items[item]).text();
        console.log(value);
        if (value !== "") {
          tempTotal += parseFloat(value.toString().replace(/,/g, ""));
        }
      }
    }
    // WHY AFTER BALACNES CALCULATION THE SUM RESULT IS SLIGHT DIFFERENT?
    // THAT'S WHY WE SHORTEN THE RESULT TO 4 DECIMAL PLACES
    expect(parseFloat(tempTotal.toFixed(4))).to.eq(
      parseFloat(TotalAssests.toFixed(4))
    );

    // cy.GetAccessToken(mainURL.stage).then((response) => {
    //   cy.request({
    //     url: `${mainURL.stage}api/v1/snapshot`,
    //     method: "POST",
    //     headers: {
    //       Authorization: "Bearer " + response.body.access_token,
    //     },
    //     body: {
    //       date: this.convertDate(),
    //       time: "0:00",
    //     },
    //     timeout: 50000,
    //   }).then((response) => {
    //     console.log(response.body);
    //     expect(
    //       Math.ceil(
    //         response.body.data.accounts[3].marketData.totalDiscountsBalances
    //           .total.BTC * 1000000
    //       ) / 1000000
    //     ).to.eq(TotalAssests);
    //   });
    // });
  }

  // OldCollateral Initial
  async OldCollateral() {
    // Get OldCollateral
    let OldCollateral =
      Math.round(
        parseFloat(await this.GetTextByIndex(".tr-values", 14)) * 10000
      ) / 10000;

    cy.GetAccessToken(mainURL.stage).then((response) => {
      cy.request({
        url: `${mainURL.stage}api/v1/snapshot`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + response.body.access_token,
        },
        body: {
          date: this.convertDate(),
          time: "0:00",
        },
        timeout: 50000,
      }).then((response) => {
        let expectedOldCollateral = parseFloat(
          (
            response.body.data.accounts[3].risk.assetCollateral.BTC +
            response.body.data.accounts[3].risk.collateralValue.BTC
          ).toFixed(4)
        );
        expect(expectedOldCollateral).to.eq(OldCollateral);
      });
    });
  }

  //Discount Collateral
  async DiscountCollateral() {
    let DiscountCollateral = parseFloat(
      await this.GetTextByIndex(".tr-values", 15)
    );
    let CollateralValue = parseFloat(
      await this.GetTextByIndex(".tr-values", 13)
    );
    let MaintenanceMargin = parseFloat(
      await this.GetTextByIndex(".tr-values", 7)
    );
    expect(DiscountCollateral.toFixed(5)).to.eq(
      (CollateralValue - MaintenanceMargin).toFixed(5)
    );
  }

  //Free Value
  async freeValue() {
    let FreeValue = parseFloat(await this.GetTextByIndex(".tr-values", 20));

    //FORMULA:  Discounted Collaterals - (Total Loans)/10 - Total Loans

    let tempFreeValue =
      parseFloat(await this.GetTextByIndex(".tr-values", 15)) -
      parseFloat(await this.GetTextByIndex(".tr-values", 11)) / 10 -
      parseFloat(await this.GetTextByIndex(".tr-values", 11));

    // Get FreeValue
    // cy.GetAccessToken(mainURL.preprod).then((response) => {
    //   cy.request({
    //     url: `${mainURL.preprod}api/v1/snapshot`,
    //     method: "POST",
    //     headers: {
    //       Authorization: "Bearer " + response.body.access_token,
    //     },
    //     body: {
    //       date: this.convertDate(),
    //       time: "0:00",
    //     },
    //     timeout: 50000,
    //   }).then((response) => {
    //     expect(
    //       Math.ceil(
    //         response.body.data.accounts[3].marketData.totalDiscountsBalances
    //           .freeValue.BTC * 1000000
    //       ) / 1000000
    //     ).to.eq(FreeValue);
    //   });
    // });
  }

  // MTA
  async MTA() {
    cy.GetAccessToken(mainURL.preprod).then((response) => {
      cy.request({
        url: `${mainURL.preprod}api/v1/client`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + response.body.access_token,
        },
      }).then((response) => {
        console.log(response.body);
      });
    });
  }

  async RRi() {}

  async RRL() {}

  // RiskRatio
  async RiskRatio() {
    let TotalLoans = parseFloat(await this.GetTextByIndex(".tr-values", 11));
    let DiscountCollateral = parseFloat(
      await this.GetTextByIndex(".tr-values", 15)
    );
    let CalculatedRiskRatio = Math.round(
      (TotalLoans / DiscountCollateral) * 100
    );
    let RiskRatio = parseFloat(await this.GetTextByIndex(".tr-values", 17));
    expect(RiskRatio).to.eq(CalculatedRiskRatio);
  }

  // oldFreeValue
  async OldFreeValue() {
    let OldFreeValue = parseFloat(await this.GetTextByIndex(".tr-values", 21));
    let TotalLoans = parseFloat(await this.GetTextByIndex(".tr-values", 11));
    // Get Collateral Current
    cy.GetAccessToken(mainURL.preprod).then((response) => {
      cy.request({
        url: `${mainURL.preprod}api/v1/snapshot`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + response.body.access_token,
        },
        body: {
          date: this.convertDate(),
          time: "0:00",
        },
        timeout: 50000,
      }).then((response) => {
        console.log(response);
        expect(
          (
            response.body.data.accounts[3].risk.collateralCurrent.BTC -
            TotalLoans
          ).toFixed(4)
        ).to.eq(OldFreeValue.toFixed(4));
      });
    });
  }

  CheckSummaryValues() {
    this.checkClient();
    // this.discountGroup(); // to do double check the API request
    this.CheckStatus();
    this.LeverageRatio();
    this.Available();
    this.checkTotals(5, 10); // hedgedMargin
    this.checkTotals(6, 11); // unhedgedMargin
    this.MaintanceMargin();
    this.checkTotals(8, 7); // hedgedPosition
    this.checkTotals(9, 8); // unhedgedPosition
    this.TotalPosition();
    this.checkTotals(11, 2); // totalLoans
    this.TotalAssests();
    this.checkTotals(13, 4); // Collateral
    // this.OldCollateral(); -  // to do need to check formula!
    this.DiscountCollateral();
    // this.MTA() -to do
    this.RiskRatio();
    // this.RRi() - to do
    // this.RRL() - to do
    // this.freeValue() -- to do (need to check formula!)
    // this.OldFreeValue(); // - to do (double check how to calculate!)
  }
}

export default SummaryTable;
