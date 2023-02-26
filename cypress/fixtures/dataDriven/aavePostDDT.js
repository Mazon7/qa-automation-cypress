import { AAVE_POSTS } from "../json_schemas";
import { USER_DATA } from "../test_data";

export let POST_AAVE = {
  POST_AAVE_APPROVE: [
    {
      URL:
        Cypress.env("stage_url") +
        `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/approve`,
      REQUEST_BODY: { asset: "USDT_TEST4", maxAmount: 100 },
      STATUS: 201,
      MESSAGE: { status: "SUBMITTED" },
      SCHEMA: AAVE_POSTS.AAVE_APPROVE,
      DB_STATUS: "CONFIRMING",
    },
    {
      URL:
        Cypress.env("stage_url") +
        `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/approve`,
      REQUEST_BODY: { asset: "USDT_TEST4", maxAmount: -1 },
      STATUS: 400,
      MESSAGE: { message: '"maxAmount" must be greater than or equal to 0' },
      SCHEMA: AAVE_POSTS.ERROR_MESSAGE,
      DB_STATUS: undefined,
    },
  ],

  POST_AAVE_DELEGATION: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/approve/delegation`,
    REQUEST_BODY: {
      asset: "USDT_TEST4",
      amount: "0.0001",
      interestRateMode: 1,
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_STAKING_APPROVE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/approve`,
    REQUEST_BODY: {
      maxAmount: "1",
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_DEPOSIT: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/deposit`,
    REQUEST_BODY: {
      asset: "ETH_TEST2",
      amount: "0.00001",
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_WITHDRAW: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/withdraw`,
    REQUEST_BODY: {
      asset: "ETH_TEST2",
      amount: "0.00001",
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_BORROW: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/borrow`,
    REQUEST_BODY: {
      asset: "USDC_ETH_TEST2",
      amount: "0.01",
      interestRateMode: 1,
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_REPAY: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/repay`,
    REQUEST_BODY: {
      asset: "DAI_TEST2",
      amount: "0.01",
      rateMode: 2,
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_STAKE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/stake`,
    REQUEST_BODY: {
      amount: "0.000000001",
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_STAKING_COOLDOWN: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/cooldown`,
    REQUEST_BODY: undefined,
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_AAVE_CLAIM_REWARDS: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/claim/rewards`,
    REQUEST_BODY: {
      amount: "0.000000001",
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_DEPOSIT_USDC: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/dydx/v3/deposit/usdc`,
    REQUEST_BODY: {
      amount: "100.0",
    },
    STATUS: 200,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
  POST_DEPOSIT_USDC_APPROVE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/dydx/v3/deposit/usdc/approve`,
    REQUEST_BODY: {
      maxAmount: "100.0",
    },
    STATUS: 201,
    MESSAGE: { status: "SUBMITTED" },
    SCHEMA: AAVE_POSTS.AAVE_APPROVE,
    DB_STATUS: "CONFIRMING",
  },
};
