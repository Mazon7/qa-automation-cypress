import AaveApi from "../support/serviceObject/aave_api_service_object";
import AccessToken from "../support/serviceObject/access_token";
import * as TEST_DATA from "../fixtures/test_data";
import { GET_AAVE } from "../fixtures/dataDriven/aaveGetDDT";

describe("AAVE API GET Requests", function () {
  const aaveApi = new AaveApi();
  const accessToken = new AccessToken();
  let received2FAToken;
  before("Get token", async function () {
    received2FAToken = await accessToken.GetLogin2FaAccessToken(
      TEST_DATA.USER_DATA.MAIL,
      TEST_DATA.USER_DATA.PASSWORD,
      TEST_DATA.USER_DATA.SECRET_2FA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/deposit​/healthfactor
  it(`Provides an opportunity to get a future health factor before depositing an amount`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_DEPOSIT_HEALTHFACTOR.URL,
      GET_AAVE.GET_DEPOSIT_HEALTHFACTOR.QUERY,
      GET_AAVE.GET_DEPOSIT_HEALTHFACTOR.STATUS,
      GET_AAVE.GET_DEPOSIT_HEALTHFACTOR.SCHEMA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/withdraw​/healthfactor
  it(`Provides an opportunity to get a future health factor before withdrawing an amount`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_WITHDRAW_HEALTHFACTOR.URL,
      GET_AAVE.GET_WITHDRAW_HEALTHFACTOR.QUERY,
      GET_AAVE.GET_WITHDRAW_HEALTHFACTOR.STATUS,
      GET_AAVE.GET_WITHDRAW_HEALTHFACTOR.SCHEMA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/borrow​/healthfactor
  it(`Provides an opportunity to get a future health factor before borrowing an amount`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_BORROW_HEALTHFACTOR.URL,
      GET_AAVE.GET_BORROW_HEALTHFACTOR.QUERY,
      GET_AAVE.GET_BORROW_HEALTHFACTOR.STATUS,
      GET_AAVE.GET_BORROW_HEALTHFACTOR.SCHEMA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/repay​/healthfactor
  it(`Provides an opportunity to get a future health factor before repaying an amount`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_REPAY_HEALTHFACTOR.URL,
      GET_AAVE.GET_REPAY_HEALTHFACTOR.QUERY,
      GET_AAVE.GET_REPAY_HEALTHFACTOR.STATUS,
      GET_AAVE.GET_REPAY_HEALTHFACTOR.SCHEMA
    );
  });
  // GET defi/{apiKeyUUID}/aave/v2/withdraw/tokens
  it(`Provides a list of tokens for AAVE withdraw`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_WITHDRAW_TOKENS.URL,
      GET_AAVE.GET_WITHDRAW_TOKENS.QUERY,
      GET_AAVE.GET_WITHDRAW_TOKENS.STATUS,
      GET_AAVE.GET_WITHDRAW_TOKENS.SCHEMA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/supply​/tokens
  it(`Provides a list of tokens for AAVE supply`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_SUPPLY_TOKENS.URL,
      GET_AAVE.GET_SUPPLY_TOKENS.QUERY,
      GET_AAVE.GET_SUPPLY_TOKENS.STATUS,
      GET_AAVE.GET_SUPPLY_TOKENS.SCHEMA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/borrow/tokens
  it(`Provides a list of tokens for AAVE borrow`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_BORROW_TOKENS.URL,
      GET_AAVE.GET_BORROW_TOKENS.QUERY,
      GET_AAVE.GET_BORROW_TOKENS.STATUS,
      GET_AAVE.GET_BORROW_TOKENS.SCHEMA
    );
  });
  //GET /defi​/{apiKeyUUID}​/aave​/v2​/repay/tokens
  it(`Provides a list of tokens for AAVE repay`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_REPAY_TOKENS.URL,
      GET_AAVE.GET_REPAY_TOKENS.QUERY,
      GET_AAVE.GET_REPAY_TOKENS.STATUS,
      GET_AAVE.GET_REPAY_TOKENS.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/deposit/allowance
  it(`Checks the allowance of AAVE deposit`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_DEPOSIT_ALLOWANCE.URL,
      GET_AAVE.GET_DEPOSIT_ALLOWANCE.QUERY,
      GET_AAVE.GET_DEPOSIT_ALLOWANCE.STATUS,
      GET_AAVE.GET_DEPOSIT_ALLOWANCE.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/withdraw/allowance
  it(`Checks the allowance of AAVE withdraw`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_WITHDRAW_ALLOWANCE.URL,
      GET_AAVE.GET_WITHDRAW_ALLOWANCE.QUERY,
      GET_AAVE.GET_WITHDRAW_ALLOWANCE.STATUS,
      GET_AAVE.GET_WITHDRAW_ALLOWANCE.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/repay/allowance
  it(`Checks the allowance of AAVE repay`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_REPAY_ALLOWANCE.URL,
      GET_AAVE.GET_REPAY_ALLOWANCE.QUERY,
      GET_AAVE.GET_REPAY_ALLOWANCE.STATUS,
      GET_AAVE.GET_REPAY_ALLOWANCE.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/borrow/allowance
  it(`Checks the allowance of AAVE borrow`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_BORROW_ALLOWANCE.URL,
      GET_AAVE.GET_BORROW_ALLOWANCE.QUERY,
      GET_AAVE.GET_BORROW_ALLOWANCE.STATUS,
      GET_AAVE.GET_BORROW_ALLOWANCE.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/staking/stake/allowance
  it(`Checks the allowance of AAVE staking`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_STAKE_ALLOWANCE.URL,
      GET_AAVE.GET_STAKE_ALLOWANCE.QUERY,
      GET_AAVE.GET_STAKE_ALLOWANCE.STATUS,
      GET_AAVE.GET_STAKE_ALLOWANCE.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/staking/cooldown/info
  it(`Checks the allowance of AAVE cooldown status`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_COOLDOWN_STATUS_ALLOWANCE.URL,
      GET_AAVE.GET_COOLDOWN_STATUS_ALLOWANCE.QUERY,
      GET_AAVE.GET_COOLDOWN_STATUS_ALLOWANCE.STATUS,
      GET_AAVE.GET_COOLDOWN_STATUS_ALLOWANCE.SCHEMA
    );
  });
  //GET defi/{apiKeyUUID}/aave/v2/staking/rewards/balance
  it(`Checks the allowance of AAVE staking rewards`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_REWARDS_BALANCE.URL,
      GET_AAVE.GET_REWARDS_BALANCE.QUERY,
      GET_AAVE.GET_REWARDS_BALANCE.STATUS,
      GET_AAVE.GET_REWARDS_BALANCE.SCHEMA
    );
  });

  //GET defi/{apiKeyUUID}/dydx/v3/deposit/usdc/allowance
  it(`Checks the allowance of DyDx USDC deposit`, function () {
    aaveApi.GetRequestAaveAPI(
      received2FAToken,
      GET_AAVE.GET_USDC_ALLOWANCE.URL,
      GET_AAVE.GET_USDC_ALLOWANCE.QUERY,
      GET_AAVE.GET_USDC_ALLOWANCE.STATUS,
      GET_AAVE.GET_USDC_ALLOWANCE.SCHEMA
    );
  });
});
