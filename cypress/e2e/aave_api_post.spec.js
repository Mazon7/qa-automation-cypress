///<reference types="Cypress"  />
import AaveApi from "../support/serviceObject/aave_api_service_object";
import AccessToken from "../support/serviceObject/access_token";
import * as TEST_DATA from "../fixtures/test_data";
import { POST_AAVE } from "../fixtures/dataDriven/aavePostDDT";

describe("AAVE API POST Requests", function () {
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

  //POST /defi/{apiKeyUUID}/aave/v2/approve
  POST_AAVE.POST_AAVE_APPROVE.forEach((DDT) => {
    it(`Creates a transaction for defi AAVE to approve a maximum amount for a specific asset}  ==> ${DDT.MESSAGE}`, function () {
      aaveApi.PostRequestAaveAPI(
        received2FAToken,
        DDT.URL,
        DDT.REQUEST_BODY,
        DDT.STATUS,
        DDT.SCHEMA,
        DDT.MESSAGE,
        DDT.DB_STATUS
      );
    });
  });
  //POST /defi/{apiKeyUUID}/aave/v2/staking/deligation
  it.skip(`Creates a transaction for defi AAVE to approve delegation of amount for a specific asset and interestRateMode`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_DELEGATION.URL,
      POST_AAVE.POST_AAVE_DELEGATION.REQUEST_BODY,
      POST_AAVE.POST_AAVE_DELEGATION.STATUS,
      POST_AAVE.POST_AAVE_DELEGATION.SCHEMA,
      POST_AAVE.POST_AAVE_DELEGATION.MESSAGE,
      POST_AAVE.POST_AAVE_DELEGATION.DB_STATUS
    );
  });
  //POST /defi/{apiKeyUUID}/aave/v2/staking/approve
  it.skip(`Creates a transaction for defi AAVE to approve a maximum amount for an AAVE asset`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_STAKING_APPROVE.URL,
      POST_AAVE.POST_AAVE_STAKING_APPROVE.REQUEST_BODY,
      POST_AAVE.POST_AAVE_STAKING_APPROVE.STATUS,
      POST_AAVE.POST_AAVE_STAKING_APPROVE.SCHEMA,
      POST_AAVE.POST_AAVE_STAKING_APPROVE.MESSAGE,
      POST_AAVE.POST_AAVE_STAKING_APPROVE.DB_STATUS
    );
  });

  //POST /defi/{apiKeyUUID}/aave/v2/deposit
  it(`Creates an AAVE deposit request`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_DEPOSIT.URL,
      POST_AAVE.POST_AAVE_DEPOSIT.REQUEST_BODY,
      POST_AAVE.POST_AAVE_DEPOSIT.STATUS,
      POST_AAVE.POST_AAVE_DEPOSIT.SCHEMA,
      POST_AAVE.POST_AAVE_DEPOSIT.MESSAGE,
      POST_AAVE.POST_AAVE_DEPOSIT.DB_STATUS
    );
  });
  //POST /defi/{apiKeyUUID}/aave/v2/withdraw
  it(`Creates an AAVE withdraw request`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_WITHDRAW.URL,
      POST_AAVE.POST_AAVE_WITHDRAW.REQUEST_BODY,
      POST_AAVE.POST_AAVE_WITHDRAW.STATUS,
      POST_AAVE.POST_AAVE_WITHDRAW.SCHEMA,
      POST_AAVE.POST_AAVE_WITHDRAW.MESSAGE,
      POST_AAVE.POST_AAVE_WITHDRAW.DB_STATUS
    );
  });

  //POST /defi/{apiKeyUUID}/aave/v2/borrow
  it(`Creates an AAVE borrow request`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_BORROW.URL,
      POST_AAVE.POST_AAVE_BORROW.REQUEST_BODY,
      POST_AAVE.POST_AAVE_BORROW.STATUS,
      POST_AAVE.POST_AAVE_BORROW.SCHEMA,
      POST_AAVE.POST_AAVE_BORROW.MESSAGE,
      POST_AAVE.POST_AAVE_BORROW.DB_STATUS
    );
  });

  //POST /defi/{apiKeyUUID}/aave/v2/repay
  it(`Creates an AAVE borrow repay`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_REPAY.URL,
      POST_AAVE.POST_AAVE_REPAY.REQUEST_BODY,
      POST_AAVE.POST_AAVE_REPAY.STATUS,
      POST_AAVE.POST_AAVE_REPAY.SCHEMA,
      POST_AAVE.POST_AAVE_REPAY.MESSAGE,
      POST_AAVE.POST_AAVE_REPAY.DB_STATUS
    );
  });
  //POST /defi/{apiKeyUUID}/aave/v2/staking/stake
  it(`Creates an AAVE stake request`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_REPAY.URL,
      POST_AAVE.POST_AAVE_REPAY.REQUEST_BODY,
      POST_AAVE.POST_AAVE_REPAY.STATUS,
      POST_AAVE.POST_AAVE_REPAY.SCHEMA,
      POST_AAVE.POST_AAVE_REPAY.MESSAGE,
      POST_AAVE.POST_AAVE_REPAY.DB_STATUS
    );
  });

  //POST /defi/{apiKeyUUID}/aave/v2/staking/claim/rewards
  it(`Creates an AAVE claim rewards request`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_AAVE_CLAIM_REWARDS.URL,
      POST_AAVE.POST_AAVE_CLAIM_REWARDS.REQUEST_BODY,
      POST_AAVE.POST_AAVE_CLAIM_REWARDS.STATUS,
      POST_AAVE.POST_AAVE_CLAIM_REWARDS.SCHEMA,
      POST_AAVE.POST_AAVE_CLAIM_REWARDS.MESSAGE,
      POST_AAVE.POST_AAVE_CLAIM_REWARDS.DB_STATUS
    );
  });
  // POST /defi/{apiKeyUUID}/aave/v2/staking/cooldown
  // POST /defi/{apiKeyUUID}/aave/v2/staking/redeem

  //POST /defi/{apiKeyUUID}/aave/v3/deposit/usdc/approve
  it(`Creates a transaction for DxDy USDC to approve a maximum amount`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_DEPOSIT_USDC_APPROVE.URL,
      POST_AAVE.POST_DEPOSIT_USDC_APPROVE.REQUEST_BODY,
      POST_AAVE.POST_DEPOSIT_USDC_APPROVE.STATUS,
      POST_AAVE.POST_DEPOSIT_USDC_APPROVE.SCHEMA,
      POST_AAVE.POST_DEPOSIT_USDC_APPROVE.MESSAGE,
      POST_AAVE.POST_DEPOSIT_USDC_APPROVE.DB_STATUS
    );
  });
  //POST /defi/{apiKeyUUID}/aave/v3/deposit/usdc
  it.skip(`Creates the DyDx deposit of USDC request`, function () {
    aaveApi.PostRequestAaveAPI(
      received2FAToken,
      POST_AAVE.POST_DEPOSIT_USDC.URL,
      POST_AAVE.POST_DEPOSIT_USDC.REQUEST_BODY,
      POST_AAVE.POST_DEPOSIT_USDC.STATUS,
      POST_AAVE.POST_DEPOSIT_USDC.SCHEMA,
      POST_AAVE.POST_DEPOSIT_USDC.MESSAGE,
      POST_AAVE.POST_DEPOSIT_USDC.DB_STATUS
    );
  });
});
