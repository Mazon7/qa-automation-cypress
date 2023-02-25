import { itbit } from "ccxt";
import BinanceExchange from "../pageObjects/Exchanges/Binance.js";
import HuobiExchange from "../pageObjects/Exchanges/Huobi.js";

describe("Futures trades tests", function () {
  const binanceExchange = new BinanceExchange();
  const huobiExchange = new HuobiExchange();
  it("Binance USDM trades test", function () {
    binanceExchange.DatabaseChecks(40, "USDT");
    // Open position by making a trade (BUY EOS)
    binanceExchange.futuresTrade("queryBuyEOSBinanceUSD_M", "EOS/USDT", 2);
    cy.wait(10000);

    binanceExchange.DatabaseChecks(40, "USDT");

    // Close position by making a trade (SELL EOS)
    binanceExchange.futuresTrade("querySellEOSBinanceUSD_M", "EOS/USDT", 2);
    cy.wait(10000);

    binanceExchange.DatabaseChecks(40, "USDT");

    // Get all previously failed assertions
    // If some of the test parts fails, other will continue to execute
    cy.softAssertAll();
  });

  it("Binance COINM trades test", function () {
    binanceExchange.DatabaseChecks(40, "EOS");

    // Open position by making a trade
    binanceExchange.futuresTrade("queryBuyEOSBinanceCOIN_M", "EOS/USD", 1);
    cy.wait(10000);
    binanceExchange.DatabaseChecks(40, "EOS");

    // Close position by making a trade
    binanceExchange.futuresTrade("querySellEOSBinanceCOIN_M", "EOS/USD", 1);
    cy.wait(10000);
    binanceExchange.DatabaseChecks(40, "EOS");

    // Get all previously failed assertions
    // If some of the test parts fails, other will continue to execute
    cy.softAssertAll();
  });

  // Add database checks. Currently not working (should be same as for binance)
  it("Huobi USDM Swap linear trades test", function () {
    huobiExchange.DatabaseChecks(51, "USDT");
    // Open position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "swap",
      "linear",
      "EOS/USDT:USDT",
      1,
      "buy",
      "open"
    );

    cy.wait(10000);

    huobiExchange.DatabaseChecks(51, "USDT");
    // Close position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "swap",
      "linear",
      "EOS/USDT:USDT",
      1,
      "sell",
      "close"
    );
    cy.wait(10000);
    huobiExchange.DatabaseChecks(51, "USDT");

    // Get all previously failed assertions
    // If some of the test parts fails, other will continue to execute
    cy.softAssertAll();
  });

  it("Huobi USDM Future linear trades test", function () {
    const date = huobiExchange.dateConvert();

    huobiExchange.DatabaseChecks(51, "USDT");
    // Open position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "future",
      "linear",
      `ETH/USDT:USDT-${date}`,
      1,
      "buy",
      "open"
    );
    cy.wait(10000);

    huobiExchange.DatabaseChecks(51, "USDT");
    // Close position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "future",
      "linear",
      `ETH/USDT:USDT-${date}`,
      1,
      "sell",
      "close"
    );

    cy.wait(10000);
    // binanceExchange.DatabaseChecks(51, "USDT");
    // Get all previously failed assertions
    // If some of the test parts fails, other will continue to execute
    cy.softAssertAll();
  });

  it("Huobi COINM Swap inverse trades test", function () {
    const date = huobiExchange.dateConvert();

    huobiExchange.DatabaseChecks(51, "EOS");
    // Open position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "swap",
      "inverse",
      "EOS/USD:EOS",
      1,
      "buy",
      "open"
    );
    cy.wait(10000);

    huobiExchange.DatabaseChecks(51, "EOS");
    // Close position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "swap",
      "inverse",
      "EOS/USD:EOS",
      1,
      "sell",
      "close"
    );
    cy.wait(10000);

    huobiExchange.DatabaseChecks(51, "EOS");

    // Get all previously failed assertions
    // If some of the test parts fails, other will continue to execute
    cy.softAssertAll();
  });

  it("Huobi COINM Future inverse trades test", function () {
    huobiExchange.DatabaseChecks(51, "EOS");
    // Open position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "future",
      "inverse",
      `EOS/USD:EOS-${date}`,
      1,
      "buy",
      "open"
    );
    cy.wait(10000);
    huobiExchange.DatabaseChecks(51, "EOS");

    // Close position by making a trade
    huobiExchange.futuresTrade(
      "queryTradeHuobiFutures",
      "future",
      "inverse",
      `EOS/USD:EOS-${date}`,
      1,
      "sell",
      "close"
    );
    cy.wait(10000);
    huobiExchange.DatabaseChecks(51, "EOS");

    // Get all previously failed assertions
    // If some of the test parts fails, other will continue to execute
    cy.softAssertAll();
  });
});
