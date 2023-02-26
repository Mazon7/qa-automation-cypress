import { AAVE_GETS } from "../json_schemas";
import { USER_DATA } from "../test_data";

export let GET_AAVE = {
  GET_DEPOSIT_HEALTHFACTOR: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/deposit/healthfactor`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_HEALTHFACTOR,
  },
  GET_WITHDRAW_HEALTHFACTOR: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/withdraw/healthfactor`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_HEALTHFACTOR,
  },
  GET_BORROW_HEALTHFACTOR: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/borrow/healthfactor`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_HEALTHFACTOR,
  },
  GET_REPAY_HEALTHFACTOR: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/repay/healthfactor`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_HEALTHFACTOR,
  },
  GET_WITHDRAW_TOKENS: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/withdraw/tokens`,
    QUERY: {},
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_WITHDRAW_TOKENS,
  },
  GET_SUPPLY_TOKENS: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/supply/tokens`,
    QUERY: {},
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_SUPPLY_TOKENS,
  },
  GET_BORROW_TOKENS: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/borrow/tokens`,
    QUERY: {},
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_BORROW_TOKENS,
  },
  GET_REPAY_TOKENS: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/repay/tokens`,
    QUERY: {},
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_REPAY_TOKENS,
  },
  GET_DEPOSIT_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/deposit/allowance`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
      amount: 10,
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_ALLOWANCE,
  },
  GET_WITHDRAW_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/withdraw/allowance`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
      amount: 10,
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_ALLOWANCE,
  },
  GET_REPAY_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/repay/allowance`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
      amount: 10,
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_ALLOWANCE,
  },
  GET_BORROW_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/borrow/allowance`,
    QUERY: {
      asset: "USDC_ETH_TEST2",
      amount: 10,
      interestRateMode: 1,
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_ALLOWANCE,
  },
  GET_STAKE_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/stake/allowance`,
    QUERY: {
      amount: 10,
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_ALLOWANCE,
  },
  GET_COOLDOWN_STATUS_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/cooldown/info`,
    QUERY: {},
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_COOLDOWN_STATUS,
  },
  GET_REWARDS_BALANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/aave/v2/staking/rewards/balance`,
    QUERY: {},
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_REWARDS_BALANCE,
  },
  GET_USDC_ALLOWANCE: {
    URL:
      Cypress.env("stage_url") +
      `api/defi/${USER_DATA.ACCOUNT_ID}/dydx/v3/deposit/usdc/allowance`,
    QUERY: {
      amount: 100,
    },
    STATUS: 200,
    SCHEMA: AAVE_GETS.GET_ALLOWANCE,
  },
};
