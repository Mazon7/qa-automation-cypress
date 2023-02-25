/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

// module.exports = (on, config) => {
//     // `on` is used to hook into various events Cypress emits
//     // `config` is the resolved Cypress config
// }

// const { prototype } = require('cypress/types/bluebird')

require("dotenv").config();
const ENV = process.env;

const { Client } = require("pg");
const ccxt = require("ccxt");
const _ = require("lodash");
const BigNumber = require("bignumber.js");

const exchange = new ccxt.bequant({
  apiKey: ENV.BEQUANT_API,
  secret: ENV.BEQUANT_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

const binance = new ccxt.binance({
  apiKey: ENV.BINANCE_API,
  secret: ENV.BINANCE_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

const binanceusdm = new ccxt.binanceusdm({
  apiKey: ENV.BINANCE_API,
  secret: ENV.BINANCE_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

const binancecoinm = new ccxt.binancecoinm({
  apiKey: ENV.BINANCE_API,
  secret: ENV.BINANCE_SECRET,
  enableRateLimit: true,
  timeout: 6000,
});

const okex5 = new ccxt.okex5({
  password: ENV.OKEX5_PASS,
  apiKey: ENV.OKEX5_API,
  secret: ENV.OKEX5_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

const bitfinex = new ccxt.bitfinex({
  apiKey: ENV.BITFINEX_API,
  secret: ENV.BITFINEX_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

const hitbtc = new ccxt.hitbtc({
  apiKey: ENV.HITBTC_API,
  secret: ENV.HITBTC_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

// HUOBI
const huobi = new ccxt.huobipro({
  apiKey: ENV.HUOBI_API,
  secret: ENV.HUOBI_SECRET,
  enableRateLimit: true,
  timeout: 60000,
});

function huobiFutures(defaultType, defaultSubType) {
  return new ccxt.huobi({
    apiKey: ENV.HUOBI_FUTURES_API,
    secret: ENV.HUOBI_FUTURES_SECRET,
    options: {
      defaultType: defaultType,
      defaultSubType: defaultSubType,
    },
    enableRateLimit: true,
    timeout: 60000,
  });
}

// the connection strings for different databases
// come from a config file, or from environment variables

const client = new Client({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
});

client.connect();

// querying the database from Node
function getBalanceFromDB(connectionInfo, query) {
  // const connection = mysql.createConnection(connectionInfo);
  // connection.connect();
  return new Promise((resolve, reject) => {
    client.query(query, (err, res) => {
      if (err) {
        return reject(err);
      }
      // client.end();
      return resolve(res);
    });
  });
}

//for Bequant
function getBalaceFromExchange() {
  "use strict";
  return new Promise((resolve) => {
    // exchange.verbose = true;
    exchange.fetchBalance().then((balance) => {
      // let usdtBefore = balance.info.filter(function (el) {
      //   console.log(el);
      //   return el.currency === "USD";
      // });
      // let exchangeBalance = balance[0].available;
      return resolve(balance);
    });
  });
}

async function getBalaceFromExchange() {
  const [mainBalance, tradingBalance] = await Promise.all([
    exchange.privateGetAccountBalance(),
    exchange.privateGetTradingBalance(),
  ]);
  return _.chain(mainBalance)
    .concat(tradingBalance)
    .reduce((res, item) => {
      const { currency } = item; // .toLowerCase()
      res[currency] = BigNumber(res[currency] || 0)
        .plus(item.available)
        .plus(item.reserved)
        .toNumber();
      return res;
    }, {})
    .pickBy((val) => !BigNumber(val).isZero())
    .value();
}

function buyEOS(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // exchange.verbose = true;
    exchange
      .fetchOrderBook("EOS/USDT")
      .then((orderbook) => {
        return orderbook.asks.length ? orderbook.asks[0] : undefined;
      })
      .then((price) => {
        return exchange.createMarketBuyOrder(symbol, amount, price);
      })
      .then((order) => {
        return resolve(order);
      });
  });
}

function sellEOS(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // exchange.verbose = true;
    exchange
      .fetchOrderBook("EOS/USDT")
      .then((orderbook) => {
        return orderbook.bids.length ? orderbook.bids[0] : undefined;
      })
      .then((price) => {
        return exchange.createMarketSellOrder(symbol, amount, price);
      })
      .then((order) => {
        return resolve(order);
      });
  });
}

//for Okex v5
function getBalaceFromOkex() {
  "use strict";
  return new Promise((resolve) => {
    // okex5.verbose = true;
    okex5.fetchBalance().then((balance) => {
      let exchangeBalance = balance.USDT.total;
      console.log(exchangeBalance);
      return resolve(exchangeBalance);
    });
  });
}

function buyEOSOkex(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // okex5.verbose = true;
    okex5
      .fetchOrderBook("EOS/USDT")
      .then((orderbook) => {
        return orderbook.asks.length ? orderbook.asks[0][0] : undefined;
      })
      .then((price) => {
        return okex5.createMarketOrder(symbol, "buy", amount, price);
      })
      .then((order) => {
        return resolve(order);
      });
  });
}

function sellEOSOkex(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // okex5.verbose = true;
    okex5
      .fetchOrderBook("EOS/USDT")
      .then((orderbook) => {
        return orderbook.bids.length ? orderbook.bids[0][0] : undefined;
      })
      .then((price) => {
        return okex5.createMarketOrder(symbol, "sell", amount, price);
      })
      .then((order) => {
        return resolve(order);
      });
  });
}

// For BINANCE

function getBalaceFromExchangeBinance() {
  "use strict";
  return new Promise((resolve) => {
    binance.fetchBalance().then((balance) => {
      let exchangeBalance = balance.USDT.total;
      return resolve(exchangeBalance);
    });
  });
}

function buyEOSBinance(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binance.verbose = true;
    return binance
      .createOrder(symbol, "market", "buy", amount)
      .then((order) => {
        return resolve(order);
      });
  });
}

function sellEOSBinance(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    return binance
      .createOrder(symbol, "market", "sell", amount)
      .then((order) => {
        return resolve(order);
      });
  });
}

// Binance futures Orders USDⓈ-M and COIN-M
function buyEOSBinanceUSD_M(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binanceusdm.verbose = true;
    binanceusdm
      .createOrder(symbol, "market", "buy", amount, undefined, {
        positionSide: "LONG",
      })
      .then((order) => {
        resolve(order);
      });
  });
}

function sellEOSBinanceUSD_M(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binanceusdm.verbose = true;
    binanceusdm
      .createOrder(symbol, "market", "sell", amount, undefined, {
        positionSide: "LONG",
      })
      .then((order) => {
        resolve(order);
      });
  });
}

function buyEOSBinanceCOIN_M(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binancecoinm.verbose = true;
    binancecoinm
      .createOrder(symbol, "market", "buy", amount, undefined, {
        positionSide: "LONG",
      })
      .then((order) => {
        return resolve(order);
      });
  });
}

function sellEOSBinanceCOIN_M(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binancecoinm.verbose = true;
    binancecoinm
      .createOrder(symbol, "market", "sell", amount, undefined, {
        positionSide: "LONG",
      })
      .then((order) => {
        return resolve(order);
      });
  });
}

// Buy and Sell in a one function
function checkEOSBinanceUSD_M(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binanceusdm.verbose = true;
    binanceusdm
      .createOrder(symbol, "market", "buy", amount, undefined, {
        positionSide: "LONG",
      })
      .then((orderbuy) => {
        binanceusdm
          .createOrder(symbol, "market", "sell", amount, undefined, {
            positionSide: "LONG",
          })
          .then((ordersell) => {
            return resolve(orderbuy, ordersell);
          });
      });
  });
}

// Buy and Sell in a one function
function checkEOSBinanceCOIN_M(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    // binancecoinm.verbose = true;
    binancecoinm
      .createOrder(symbol, "market", "buy", amount, undefined, {
        positionSide: "LONG",
      })
      .then((orderbuy) => {
        binancecoinm
          .createOrder(symbol, "market", "sell", amount, undefined, {
            positionSide: "LONG",
          })
          .then((ordersell) => {
            return resolve(orderbuy, ordersell);
          });
      });
  });
}

// For Bitfinex
function getBalaceFromBitfinex() {
  "use strict";
  return new Promise((resolve) => {
    bitfinex.fetchBalance().then((balance) => {
      let usdtMargin = balance.info.find(
        (el) => el.type == "trading" && el.currency == "ust"
      );
      let exchangeBalance =
        parseFloat(balance.USDT.free) + parseFloat(usdtMargin.available);
      return resolve(exchangeBalance);
    });
  });
}

function buyEOSBitfinex(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    return bitfinex
      .createOrder(symbol, "market", "buy", amount)
      .then((order) => {
        return resolve(order);
      });
  });
}

function sellEOSBitfinex(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    return bitfinex
      .createOrder(symbol, "market", "sell", amount)
      .then((order) => {
        return resolve(order);
      });
  });
}

// For Huobi

function getBalanceFromHuobi() {
  "use strict";
  return new Promise((resolve) => {
    huobi.fetchBalance().then((balance) => {
      // let usdtMargin = balance.info.find(
      //   (el) => el.type == "trading" && el.currency == "ust"
      // );
      // let exchangeBalance =
      //   parseFloat(balance.USDT.free) + parseFloat(usdtMargin.available);
      return resolve(balance);
    });
  });
}

function buyEOSHuobi(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    huobi.options["createMarketBuyOrderRequiresPrice"] = false;
    return huobi.createOrder(symbol, "market", "buy", amount).then((order) => {
      return resolve(order);
    });
  });
}

function sellEOSHuobi(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    return huobi.createOrder(symbol, "market", "sell", amount).then((order) => {
      return resolve(order);
    });
  });
}

// swap linear
// client_order_id: clientOrderId,
// Huobi futures Orders USDⓈ-M, COIN-M Futures, COIN-M Swaps
function tradeHuobiFutures(
  defaultType,
  defaultSubType,
  symbol,
  amount,
  direction,
  offset
) {
  "use strict";
  return new Promise((resolve) => {
    let clientOrderId = Math.floor(Math.random() * 100000);
    huobiFutures(defaultType, defaultSubType)
      .createOrder(symbol, "opponent", direction, amount, undefined, {
        offset: offset,
        lever_rate: 5,
        positionSide: "LONG",
        client_order_id: clientOrderId,
      })
      .then((order) => {
        resolve(order);
      });
  });
}

// For HitBTC
function getBalanceFromHitBTC() {
  "use strict";
  return new Promise((resolve) => {
    hitbtc.fetchBalance().then((balance) => {
      // let usdtMargin = balance.info.find(
      //   (el) => el.type == "trading" && el.currency == "ust"
      // );
      // let exchangeBalance =
      //   parseFloat(balance.USDT.free) + parseFloat(usdtMargin.available);
      return resolve(balance);
    });
  });
}

function buyEOSHitBTC(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    return hitbtc.createOrder(symbol, "market", "buy", amount).then((order) => {
      return resolve(order);
    });
  });
}

function sellEOSHitBTC(symbol, amount) {
  "use strict";
  return new Promise((resolve) => {
    return hitbtc
      .createOrder(symbol, "market", "sell", amount)
      .then((order) => {
        return resolve(order);
      });
  });
}

module.exports = (on, config) => {
  on("task", {
    // destructure the argument into the individual fields
    queryDatabaseBalance(query) {
      const connectionInfo = client;

      if (!connectionInfo) {
        throw new Error(`Do not have DB connection under name`);
      }

      return getBalanceFromDB(connectionInfo, query);
    },

    // Bequant
    gueryExchangeBalance() {
      return getBalaceFromExchange();
    },
    queryBuyEOS({ symbol, amount }) {
      return buyEOS(symbol, amount);
    },
    querySellEOS({ symbol, amount }) {
      return sellEOS(symbol, amount);
    },
    // Binance
    gueryExchangeBalanceBinance() {
      return getBalaceFromExchangeBinance();
    },
    queryBuyEOSBinance({ symbol, amount }) {
      return buyEOSBinance(symbol, amount);
    },
    querySellEOSBinance({ symbol, amount }) {
      return sellEOSBinance(symbol, amount);
    },
    // Binance COINM USDM trades
    queryBuyEOSBinanceUSD_M({ symbol, amount }) {
      return buyEOSBinanceUSD_M(symbol, amount);
    },
    querySellEOSBinanceUSD_M({ symbol, amount }) {
      return sellEOSBinanceUSD_M(symbol, amount);
    },
    queryCheckEOSBinanceUSD_M({ symbol, amount }) {
      return checkEOSBinanceUSD_M(symbol, amount);
    },
    queryBuyEOSBinanceCOIN_M({ symbol, amount }) {
      return buyEOSBinanceCOIN_M(symbol, amount);
    },
    querySellEOSBinanceCOIN_M({ symbol, amount }) {
      return sellEOSBinanceCOIN_M(symbol, amount);
    },
    queryCheckEOSBinanceCOIN_M({ symbol, amount }) {
      return checkEOSBinanceCOIN_M(symbol, amount);
    },
    // Bitfinex
    gueryExchangeBalanceBitfinex() {
      return getBalaceFromBitfinex();
    },
    queryBuyEOSBitfinex({ symbol, amount }) {
      return buyEOSBitfinex(symbol, amount);
    },
    querySellEOSBitfinex({ symbol, amount }) {
      return sellEOSBitfinex(symbol, amount);
    },
    // Okex V5
    gueryExchangeBalanceOkex() {
      return getBalaceFromOkex();
    },
    queryBuyEOSOkex({ symbol, amount }) {
      return buyEOSOkex(symbol, amount);
    },
    querySellEOSOkex({ symbol, amount }) {
      return sellEOSOkex(symbol, amount);
    },
    // Huobi
    gueryExchangeBalanceHuobi() {
      return getBalanceFromHuobi();
    },
    queryBuyEOSHuobi({ symbol, amount }) {
      return buyEOSHuobi(symbol, amount);
    },
    querySellEOSHuobi({ symbol, amount }) {
      return sellEOSHuobi(symbol, amount);
    },
    queryTradeHuobiFutures({
      defaultType,
      defaultSubType,
      symbol,
      amount,
      direction,
      offset,
    }) {
      return tradeHuobiFutures(
        defaultType,
        defaultSubType,
        symbol,
        amount,
        direction,
        offset
      );
    },

    // HitBTC
    gueryExchangeBalanceHitBTC() {
      return getBalanceFromHitBTC();
    },
    queryBuyEOSHitBTC({ symbol, amount }) {
      return buyEOSHitBTC(symbol, amount);
    },
    querySellEOSHitBTC({ symbol, amount }) {
      return sellEOSHitBTC(symbol, amount);
    },
  });
  // return config;
};
