class BinanceExchange {
  CheckBalance() {
    let exchangeBalance;
    let dbBalance;
    cy.task("gueryExchangeBalanceBinance").then((resExchange) => {
      exchangeBalance = resExchange;
      console.log(resExchange);
    });
    const query =
      "SELECT balance FROM day_balances WHERE api_key_id = 40 ORDER BY day DESC";
    cy.task("queryDatabaseBalance", query).then((resDB) => {
      dbBalance = JSON.parse(resDB[0].balance).USDT;
      cy.log(typeof dbBalance);
      console.log(resDB);
      expect(parseFloat(dbBalance)).to.eq(exchangeBalance);
    });
  }
  SellEOS() {
    const symbol = "EOS/USDT";
    const amount = 3.6;
    cy.task("querySellEOSBinance", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
  BuyEOS() {
    const symbol = "EOS/USDT";
    const amount = 3.6;
    cy.task("queryBuyEOSBinance", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }

  percentDiff(a, b) {
    return (100 * Math.abs(a - b)) / ((a + b) / 2);
  }

  // Check aggregated_params value from DB for Coin USDⓈ-M and COIN-M
  DatabaseChecks(apiKeyId, currency) {
    // let aggParams;
    let totalAvailable;
    let collateralAvailable;
    let assetBalance;
    let totalCollateral;
    let totalInitialMargin;
    let unrealizedPl;

    const query = `SELECT total_available, total_collateral, total_initial_margin, unrealized_pl FROM aggregated_params WHERE apiKeyId = ${apiKeyId} AND currency = '${currency}'`;
    cy.task("queryDatabaseBalance", query).then((resDB) => {
      totalAvailable = resDB[0].total_available;
      totalCollateral = resDB[0].total_collateral;
      totalInitialMargin = resDB[0].total_initial_margin;
      unrealizedPl = resDB[0].unrealized_pl;

      // Check aggregated_params.total_available = aggregated_params.total_collateral-aggregated_params.total_initial_margin
      // expect(totalAvailable).to.eq(totalCollateral - totalInitialMargin);
      expect(
        this.percentDiff(totalAvailable, totalCollateral - totalInitialMargin)
      ).to.be.lessThan(0.5);
    });
    const assetBalanceQuery = `SELECT balance, available FROM collateral WHERE apiKeyId = ${apiKeyId} AND asset = '${currency}'`;
    cy.task("queryDatabaseBalance", assetBalanceQuery).then((resDB) => {
      assetBalance = resDB[0].balance;
      collateralAvailable = resDB[0].available;

      // Check difference between aggregated_params.total_available and SUM (collateral.available) in %
      // expect(
      //   this.percentDiff(totalAvailable, collateralAvailable)
      // ).to.be.lessThan(0.1);

      // Using soft assertion instead
      cy.softTrue(
        this.percentDiff(totalAvailable, collateralAvailable) < 0.1,
        "Suspicious % difference! Please check!"
      );

      // ----
      // expect(
      //   this.percentDiff(
      //     totalCollateral,
      //     parseFloat((assetBalance + unrealizedPl).toFixed(8))
      //   )
      // ).to.be.lessThan(0.1);

      // Using soft assertion instead
      cy.softTrue(
        this.percentDiff(
          totalCollateral,
          parseFloat((assetBalance + unrealizedPl).toFixed(8))
        ) < 0.1,
        "Suspicious % difference! Please check!"
      );
    });
    const positionsQuery = `select aggregated_params.exchangeId, aggregated_params.apiKeyId, aggregated_params.currency, aggregated_params.total_collateral, aggregated_params.total_available, aggregated_params.total_initial_margin, aggregated_params.total_maintenance_margin, aggregated_params.unrealized_pl, aggregated_params.realized_pl, aggregated_params.total_pl, agg_pos.pos_initial_margin, agg_pos.pos_maintenance_margin, agg_pos.pos_realized_pl, agg_pos.pos_unrealized_pl, agg_pos.pos_total_pl from aggregated_params left join (SELECT exchangeId, contract_type, margin_asset AS currency, sum(balance) as pos_balance, sum(initial_margin) as pos_initial_margin, sum(maintenance_margin) as pos_maintenance_margin, sum(unrealized_pl) as pos_unrealized_pl, sum(realized_pl) as pos_realized_pl, sum(total_pl) as pos_total_pl FROM (SELECT positions.*, instruments.margin_asset FROM positions LEFT JOIN instruments ON positions.contract = instruments.contract AND positions.exchangeId = instruments.exchangeId AND positions.contract_type = instruments.contract_type WHERE balance != 0 AND apiKeyId = ${apiKeyId}) AS pos GROUP BY exchangeId, contract_type, margin_asset) agg_pos on agg_pos.exchangeId = aggregated_params.exchangeId and agg_pos.currency = aggregated_params.currency where aggregated_params.apiKeyId = ${apiKeyId} and aggregated_params.currency = '${currency}'`;
    cy.task("queryDatabaseBalance", positionsQuery).then((resDB) => {
      let positionsInitialMargin = resDB[0].pos_initial_margin;
      // Check equality Total Initial Margin between aggregated_params and postions tables
      expect(totalInitialMargin).to.eq(positionsInitialMargin);
    });
  }

  // Coin USDⓈ-M and COIN-M
  futuresTrade(taskName, symbol, amount) {
    cy.task(taskName, { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
      const tradeQuery = `select quantity from Trades where orderId=${order.id}`;
      cy.task("queryDatabaseBalance", tradeQuery).then((resDB) => {
        // Check trade quantity
        let quantity = 0;
        for (let i of resDB) {
          quantity += i.quantity;
        }
        expect(quantity).to.eq(amount);
      });
    });
  }

  // Just check autotrades
  CheckEOS_USDM() {
    const symbol = "EOS/USDT";
    const amount = 2;
    cy.task("queryCheckEOSBinanceUSD_M", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }

  CheckEOS_COINM() {
    const symbol = "EOS/USD";
    const amount = 1;
    cy.task("queryCheckEOSBinanceCOIN_M", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
}
export default BinanceExchange;
