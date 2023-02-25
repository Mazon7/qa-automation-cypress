// const BequantExchange = require('../pageObjects/Exchanges/Bequant_page')
import BequantExchange from "../pageObjects/Exchanges/Bequant.js";
import BinanceExchange from "../pageObjects/Exchanges/Binance.js";
import BitfinexExchange from "../pageObjects/Exchanges/Bitfinex.js";
import OkexExchange from "../pageObjects/Exchanges/Okex.js";
import HuobiExchange from "../pageObjects/Exchanges/Huobi.js";
import HitBTCExchange from "../pageObjects/Exchanges/HitBTC.js";

describe("User transfer tests", function () {
  const bequantExchange = new BequantExchange();
  const binanceExchange = new BinanceExchange();
  const bitfinexExchange = new BitfinexExchange();
  const okexExchange = new OkexExchange();
  const huobiExchange = new HuobiExchange();
  const hitBTCExchange = new HitBTCExchange();

  it("User can make EOS spot buy on Bequant", function () {
    bequantExchange.CheckBalance();
    bequantExchange.BuyEOS();
    cy.wait(5000);
    bequantExchange.CheckBalance();
    bequantExchange.SellEOS();
    cy.wait(5000);
    bequantExchange.CheckBalance();
  });

  it("User can make EOS spot buy on Binance", function () {
    binanceExchange.CheckBalance();
    binanceExchange.BuyEOS();
    cy.wait(5000);
    binanceExchange.CheckBalance();
    binanceExchange.SellEOS();
    cy.wait(5000);
    binanceExchange.CheckBalance();
  });

  it.only("User can make EOS spot buy on Bitfinex", function () {
    bitfinexExchange.CheckBalance();
    bitfinexExchange.BuyEOS();
    cy.wait(5000);
    bitfinexExchange.CheckBalance();
    bitfinexExchange.SellEOS();
    cy.wait(5000);
    bitfinexExchange.CheckBalance();
  });

  it("User can make USDⓈ-M & COIN-M trades on Binance", function () {
    binanceExchange.CheckEOS_USDM();
    binanceExchange.CheckEOS_COINM();
  });

  it("User can make EOS spot buy on Okex", function () {
    okexExchange.CheckBalance();
    okexExchange.BuyEOS();
    cy.wait(5000);
    okexExchange.CheckBalance();
    okexExchange.SellEOS();
    cy.wait(5000);
    okexExchange.CheckBalance();
  });

  it("User can make EOS spot buy on Huobi", function () {
    huobiExchange.CheckBalance();
    huobiExchange.BuyEOS();
    cy.wait(5000);
    huobiExchange.CheckBalance();
    huobiExchange.SellEOS();
    cy.wait(5000);
    huobiExchange.CheckBalance();
  });

  it("User can make EOS spot buy on HitBTC", function () {
    hitBTCExchange.CheckBalance();
    hitBTCExchange.BuyEOS();
    cy.wait(5000);
    hitBTCExchange.CheckBalance();
    hitBTCExchange.SellEOS();
    cy.wait(5000);
    hitBTCExchange.CheckBalance();
  });
});
