class OkexExchange {
  CheckBalance() {
    let exchangeBalance;
    let dbBalance;
    cy.task("gueryExchangeBalanceOkex").then((resExchange) => {
      exchangeBalance = resExchange;
    });

    // const dbName = "reports";
    const query =
      "SELECT balance FROM DayBalances where apiKeyId = 132 ORDER BY day DESC";
    cy.task("queryDatabaseBalance", query)
      .then((resDB) => {
        dbBalance = JSON.parse(resDB[0].balance).USDT;
        cy.log(typeof dbBalance);
      })
      .then(() => {
        expect(parseFloat(dbBalance)).to.eq(exchangeBalance);
      });
  }
  SellEOS() {
    const symbol = "EOS/USDT";
    const amount = 0.5;
    cy.task("querySellEOSOkex", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
  BuyEOS() {
    const symbol = "EOS/USDT";
    const amount = 0.5;
    cy.task("queryBuyEOSOkex", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
}
export default OkexExchange;
