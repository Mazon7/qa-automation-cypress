import { SWAP_SCHEMAS } from "../fixtures/json_schemas";
require("dotenv").config();

export let USER_DATA = {
  MAIL: process.env.LOGIN_1,
  PASSWORD: process.env.PASS_1,
  SECRET_2FA: process.env.SECRET_1,
  SECOND_USER: {
    MAIL: process.env.LOGIN_2,
    PASSWORD: process.env.PASS_2,
    SECRET_2FA: process.env.SECRET_2,
  },

  PORTFOLIO_ID: process.env.PORTFOLIO_ID,
  ACCOUNT_ID: process.env.ACCOUNT_ID,
};
