require("dotenv").config();

export const mainURL = {
  stage: process.env.STAGE,
  preprod: process.env.PREPROD,
  autotest: process.env.AUTOTEST,
};

export const loginInfo = {
  login: process.env.LOGIN,
  pass: process.env.PASS,
  secret_stage: process.env.SECRET_STAGE,
  secret_preprod: process.env.SECRET_PREPROD,
  login_grafana: process.env.GRAFANA_LOGIN,
};

export const portalCreds = {
  token: process.env.TOKEN,
};
