class BequantExchange {
  CheckBalance() {
    let exchangeBalance;
    let dbBalance;
    cy.task("gueryExchangeBalance").then((resExchange) => {
      console.log(resExchange);
      exchangeBalance = parseFloat(resExchange.USD.toFixed(7));
    });

    const query =
      "SELECT balance FROM day_balances where api_key_id = 47 ORDER BY day DESC";
    cy.task("queryDatabaseBalance", query).then((resDB) => {
      console.log(resDB);
      dbBalance = parseFloat(JSON.parse(resDB.rows[0].balance).USD).toFixed(7);
      expect(parseFloat(dbBalance)).to.eq(exchangeBalance);
    });
  }
  SellEOS() {
    const symbol = "EOS/USDT";
    const amount = 0.5;
    cy.task("querySellEOS", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
  BuyEOS() {
    const symbol = "EOS/USDT";
    const amount = 0.5;
    cy.task("queryBuyEOS", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
}
export default BequantExchange;
