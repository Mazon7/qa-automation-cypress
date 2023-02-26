import { SWAP_SCHEMAS } from "../json_schemas";
import { USER_DATA } from "../test_data";
require("dotenv").config();

export let UNISWAP_GET_REQUEST_PARAMS = {
  GET_CUSTODY_BALANCES_LIST: {
    URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
    PORTFILIO: USER_DATA.PORTFOLIO_ID,
    STATUS: 200,
    SCHEMA: SWAP_SCHEMAS.CUSTODY_BALANCES_LIST,
    MESSAGE: undefined,
  },
  TOKEN_VERIFICATION_GET_CUSTODY_BALANCES_LIST: [
    {
      TOKEN: process.env.TOKEN_EXPIRED,
      URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
      PORTFILIO: USER_DATA.PORTFOLIO_ID,
      STATUS: 401,
      SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
      MESSAGE: "Token expired",
    },
    {
      TOKEN: process.env.TOKEN_INVALID,
      URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
      PORTFILIO: USER_DATA.PORTFOLIO_ID,
      STATUS: 401,
      SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
      MESSAGE: "Invalid token",
    },
    {
      TOKEN: undefined,
      URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
      PORTFILIO: USER_DATA.PORTFOLIO_ID,
      STATUS: 401,
      SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
      MESSAGE: "Authorization token not provided",
    },
  ],
  PORTFILIO_VERIFICATION_GET_CUSTODY_BALANCES_LIST: [
    {
      URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
      PORTFILIO: "aa763ecf2-a4d1-11ea-a830-0242ac1300033",
      STATUS: 400,
      SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
      MESSAGE: '"portfolioId" must be a valid GUID',
    },
    {
      URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
      PORTFILIO: "",
      STATUS: 400,
      SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
      MESSAGE: '"portfolioId" is not allowed to be empty',
    },
    {
      URL: Cypress.env("stage_url") + "api/defi/my/custody/balances",
      PORTFILIO: undefined,
      STATUS: 400,
      SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
      MESSAGE: '"portfolioId" is required',
    },
  ],
  GET_CUSTODY_TRANSACTION: {
    URL: Cypress.env("stage_url") + "api/defi/my/custody/transactions",
    PORTFILIO: USER_DATA.PORTFOLIO_ID,
    STATUS: 200,
    SCHEMA: undefined,
    MESSAGE: undefined,
  },
  GET_CUSTODY_SPOT_BALANCES: {
    URL: Cypress.env("stage_url") + "api/defi/my/balance/spot",
    PORTFILIO: USER_DATA.PORTFOLIO_ID,
    STATUS: 200,
    SCHEMA: SWAP_SCHEMAS.DEFI_SPOT_BALANCES,
    MESSAGE: undefined,
  },

  GET_CUSTODY_TOKEN_LIST: {
    URL: Cypress.env("stage_url") + "api/defi​/uniswap​/v3​/swap​/tokens",
    PORTFILIO: undefined,
    STATUS: 200,
    SCHEMA: SWAP_SCHEMAS.CUSTODY_TOKEN_LIST,
    MESSAGE: undefined,
  },
};

export let UNISWAP_POST_REQUEST_PARAMS = {
  POST_UNISWAP_APPROVE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/uniswap/v3/approve`,
    REQUEST_BODY: { asset: "DAI_TEST2", maxAmount: "0", feeLevel: "HIGH" },
    STATUS: 201,
    SCHEMA: SWAP_SCHEMAS.UNISWAP_APPROVE,
    MESSAGE: { status: "SUBMITTED" },
    DB_STATUS: "CONFIRMING",
  },
  SECURITY_CHECK_POST_UNISWAP_APPROVE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/uniswap/v3/approve`,
    REQUEST_BODY: { asset: "DAI_TEST2", maxAmount: "0" },
    STATUS: 403,
    SCHEMA: SWAP_SCHEMAS.ERROR_MESSAGE,
    MESSAGE: { message: "Access is not allowed" },
    DB_STATUS: undefined,
  },
  POST_UNISWAP_ROUTE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/uniswap/v3/swap/route`,
    REQUEST_BODY: {
      amount: {
        currency: "USDT_TEST4",
        currencyAmount: "111",
      },
      quoteCurrency: "AUSDC_ETH_TEST2",
      tradeType: "EXACT_INPUT",
      swapConfig: {
        slippageTolerance: 0.05,
        deadline: 1657111900,
      },
      feeLevel: "HIGH",
    },
    STATUS: 201,
    SCHEMA: SWAP_SCHEMAS.UNISWAP_APPROVE,
    MESSAGE: { status: "SUBMITTED" },
    DB_STATUS: "CONFIRMING",
  },
  POST_UNISWAP_SWAP_PRICES: {
    URL: Cypress.env("stage_url") + `api/defi/uniswap/v3/swap/price`,
    REQUEST_BODY: {
      amount: {
        currency: "USDT_TEST4",
        currencyAmount: "100",
      },
      quoteCurrency: "ETH_TEST2",
      tradeType: "EXACT_INPUT",
      swapConfig: {
        slippageTolerance: 0.0005,
      },
      feeLevel: "HIGH",
    },
    STATUS: 200,
    SCHEMA: SWAP_SCHEMAS.SWAP_PRICES,
    MESSAGE: undefined,
    DB_STATUS: undefined,
  },
};
