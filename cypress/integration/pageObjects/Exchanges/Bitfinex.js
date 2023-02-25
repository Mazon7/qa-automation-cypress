class BitfinexExchange {
  CheckBalance() {
    let exchangeBalance;
    let dbBalance;
    cy.task("gueryExchangeBalanceBitfinex").then((resExchange) => {
      exchangeBalance = parseFloat(resExchange.toFixed(7));
      console.log(exchangeBalance);
    });
    // const dbName = "reports";
    const query =
      "SELECT balance FROM day_balances WHERE api_key_id = 48 ORDER BY day DESC";
    cy.task("queryDatabaseBalance", query).then((resDB) => {
      dbBalance = parseFloat(JSON.parse(resDB.rows[0].balance).UST).toFixed(7);
      console.log(parseFloat(dbBalance));
      expect(parseFloat(dbBalance)).to.eq(exchangeBalance);
    });
  }

  // NEED TO UNDERSTAND MINIMUM AMMOUNT FOR THE TRADE
  SellEOS() {
    const symbol = "EOS/USDT";
    const amount = 2;
    cy.task("querySellEOSBitfinex", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
  BuyEOS() {
    const symbol = "EOS/USDT";
    const amount = 2;
    cy.task("queryBuyEOSBitfinex", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
}
export default BitfinexExchange;
