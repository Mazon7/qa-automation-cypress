class HitBTCExchange {
  CheckBalance() {
    let exchangeBalance;
    let dbBalance;
    cy.task("gueryExchangeBalanceHitBTC").then((resExchange) => {
      exchangeBalance = resExchange.USDT.total;
      console.log(resExchange);
    });

    // const dbName = "reports";
    const query =
      "SELECT balance FROM day_balances where api_key_id = 139 ORDER BY day DESC";
    cy.task("queryDatabaseBalance", query).then((resDB) => {
      dbBalance = parseFloat(JSON.parse(resDB.rows[0].balance).USD).toFixed(7);
      console.log(resDB);

      // FIX BALANCE DIFFERENCE
      expect(parseFloat(dbBalance)).to.eq(exchangeBalance);
    });
  }
  SellEOS() {
    const symbol = "EOS/USDT";
    const amount = 1;
    cy.task("querySellEOSHitBTC", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
  BuyEOS() {
    const symbol = "EOS/USDT";
    const amount = 1;
    cy.task("queryBuyEOSHitBTC", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
}
export default HitBTCExchange;
