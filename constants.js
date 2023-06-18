export const usersStage = {
  STAGE_LOGIN: env.STAGE_LOGIN,
  STAGE_PASS: env.STAGE_PASS,
};

export const portfolioIDs = {
  ID_1: "a763ebdd-a4d1-11ea-a830-0242ac130003",
};

export const usersAPI = {
  API_USERNAME: env.API_USERNAME,
  API_PASS: env.API_PASS,
};

export const CALLS = {
  BALANCE_HISTORY_V2:
    env.STAGE_OPEARATOR_URL +
    "backend/v2/my/balance-history?portfolioId=a763ebdd-a4d1-11ea-a830-0242ac130003",
  ACCOUNTS_V2: env.STAGE_OPEARATOR_URL + "uapi/v2/accounts",
};
