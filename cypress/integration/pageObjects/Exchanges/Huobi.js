class HuobiExchange {
  CheckBalance() {
    let exchangeBalance;
    let dbBalance;
    cy.task("gueryExchangeBalanceHuobi").then((resExchange) => {
      exchangeBalance = resExchange.USDT.total;
    });

    const query =
      "SELECT balance FROM DayBalances where apiKeyId = 51 ORDER BY day DESC";
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
    const amount = 1;
    cy.task("querySellEOSHuobi", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }
  BuyEOS() {
    const symbol = "EOS/USDT";
    const amount = 5;
    cy.task("queryBuyEOSHuobi", { symbol, amount }).then((order) => {
      cy.log(JSON.stringify(order));
    });
  }

  dateConvert() {
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate().toString().padStart(2, "0");
    let month = (date_ob.getMonth() + 1).toString().padStart(2, "0");
    let year = date_ob.getFullYear().toString().slice(-2);

    // Returns date & time in YYMMDD format
    return year + month + date;
  }

  // Coin USD-M Contracts and COIN-M Futures/Swaps
  futuresTrade(
    taskName,
    defaultType,
    defaultSubType,
    symbol,
    amount,
    direction,
    offset
  ) {
    cy.task(taskName, {
      defaultType,
      defaultSubType,
      symbol,
      amount,
      direction,
      offset,
    }).then((order) => {
      cy.log(JSON.stringify(order));
      // Quantity is not checked because
      const tradeQuery = `select quantity from Trades where orderId=${order.id}`;
      cy.task("queryDatabaseBalance", tradeQuery).then((resDB) => {
        console.log(resDB);
        // Check trade quantity
        let quantity = 0;
        for (let i of resDB) {
          quantity += i.quantity;
        }
        expect(quantity).to.eq(amount);
      });
    });
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
}
export default HuobiExchange;
