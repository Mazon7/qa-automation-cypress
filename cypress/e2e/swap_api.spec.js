///<reference types="Cypress"  />
import SwapAPI from "../support/serviceObject/swap_api_service_object";
import AccessToken from "../support/serviceObject/access_token";
import * as TEST_DATA from "../fixtures/test_data";
import { UNISWAP_GET_REQUEST_PARAMS } from "../fixtures/dataDriven/uniSwapDDT";
import { UNISWAP_POST_REQUEST_PARAMS } from "../fixtures/dataDriven/uniSwapDDT";

describe("DEFI API Requests", function () {
  const swapAPI = new SwapAPI();
  const accessToken = new AccessToken();
  let received2FAToken;
  before("Get token", async function () {
    received2FAToken = await accessToken.GetLogin2FaAccessToken(
      TEST_DATA.USER_DATA.MAIL,
      TEST_DATA.USER_DATA.PASSWORD,
      TEST_DATA.USER_DATA.SECRET_2FA
    );
  });
  //GET /defi​/my​/custody​/balances
  it("Check Get Custody balances list positive ", function () {
    swapAPI.GetRequestSwapAPI(
      received2FAToken,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_BALANCES_LIST.URL,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_BALANCES_LIST.PORTFILIO,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_BALANCES_LIST.STATUS,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_BALANCES_LIST.SCHEMA,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_BALANCES_LIST.MESSAGE
    );
  });
  //Token check
  UNISWAP_GET_REQUEST_PARAMS.TOKEN_VERIFICATION_GET_CUSTODY_BALANCES_LIST.forEach(
    (DDT) => {
      it(`Check Get Custody balances list without/invalid/expired token ==> ${DDT.MESSAGE}`, function () {
        swapAPI.GetRequestSwapAPI(
          DDT.TOKEN,
          DDT.URL,
          DDT.PORTFILIO,
          DDT.STATUS,
          DDT.SCHEMA,
          DDT.MESSAGE
        );
      });
    }
  );
  //Portfilio check
  UNISWAP_GET_REQUEST_PARAMS.PORTFILIO_VERIFICATION_GET_CUSTODY_BALANCES_LIST.forEach(
    (DDT) => {
      it(`Check Get Custody balances list without/empty/notExist portfilio id ==> ${DDT.MESSAGE} `, function () {
        swapAPI.GetRequestSwapAPI(
          received2FAToken,
          DDT.URL,
          DDT.PORTFILIO,
          DDT.STATUS,
          DDT.SCHEMA,
          DDT.MESSAGE
        );
      });
    }
  );
  //GET /defi​/my​/balance​/transaction
  it("Get custody transactions list", function () {
    swapAPI.GetRequestSwapAPI(
      received2FAToken,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_TRANSACTION.URL,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_TRANSACTION.PORTFILIO,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_TRANSACTION.STATUS,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_TRANSACTION.SCHEMA,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_TRANSACTION.MESSAGE
    );
  });

  //GET /defi​/my​/balance​/spot
  it("Get defi spot balances", function () {
    swapAPI.GetRequestSwapAPI(
      received2FAToken,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.URL,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.PORTFILIO,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.STATUS,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.SCHEMA,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.MESSAGE
    );
  });

  //POST /defi/{apiKeyUUID}/uniswap/v3/approve
  it(`Creates a transaction for defi Uniswap to approve a maximum amount for a specific asset}`, function () {
    swapAPI.PostRequestSwapAPI(
      received2FAToken,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_APPROVE.URL,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_APPROVE.REQUEST_BODY,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_APPROVE.STATUS,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_APPROVE.SCHEMA,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_APPROVE.MESSAGE,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_APPROVE.DB_STATUS
    );
  });

  //SECURITY CHECK POST /defi/{apiKeyUUID}/uniswap/v3/approve
  it("Check access rights as regular user for Uniswap approve ", async function () {
    let received2FATokenRegualUser = await accessToken.GetLogin2FaAccessToken(
      TEST_DATA.USER_DATA.SECOND_USER.MAIL,
      TEST_DATA.USER_DATA.SECOND_USER.PASSWORD,
      TEST_DATA.USER_DATA.SECOND_USER.SECRET_2FA
    );
    swapAPI.PostRequestSwapAPI(
      received2FATokenRegualUser,
      UNISWAP_POST_REQUEST_PARAMS.SECURITY_CHECK_POST_UNISWAP_APPROVE.URL,
      UNISWAP_POST_REQUEST_PARAMS.SECURITY_CHECK_POST_UNISWAP_APPROVE
        .REQUEST_BODY,
      UNISWAP_POST_REQUEST_PARAMS.SECURITY_CHECK_POST_UNISWAP_APPROVE.STATUS,
      UNISWAP_POST_REQUEST_PARAMS.SECURITY_CHECK_POST_UNISWAP_APPROVE.SCHEMA,
      UNISWAP_POST_REQUEST_PARAMS.SECURITY_CHECK_POST_UNISWAP_APPROVE.MESSAGE,
      UNISWAP_POST_REQUEST_PARAMS.SECURITY_CHECK_POST_UNISWAP_APPROVE.DB_STATUS
    );
  });
  //POST /defi​/{apiKeyUUID}​/uniswap​/v3​/swap​/route
  it("Creates transaction for defi Uniswap exchange using extended parameters", function () {
    swapAPI.PostRequestSwapAPI(
      received2FAToken,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_ROUTE.URL,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_ROUTE.REQUEST_BODY,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_ROUTE.STATUS,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_ROUTE.SCHEMA,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_ROUTE.MESSAGE,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_ROUTE.DB_STATUS
    );
  });
  //GET /defi/uniswap/v3/swap/tokens
  it("Get list of supported tokens for uniswap swap methods", function () {
    swapAPI.GetRequestSwapAPI(
      received2FAToken,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.URL,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.PORTFILIO,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.STATUS,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.SCHEMA,
      UNISWAP_GET_REQUEST_PARAMS.GET_CUSTODY_SPOT_BALANCES.MESSAGE
    );
  });

  // POST /defi/uniswap/v3/swap/price
  it("Returns swap prices for currencies", function () {
    swapAPI.PostRequestSwapAPI(
      received2FAToken,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_SWAP_PRICES.URL,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_SWAP_PRICES.REQUEST_BODY,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_SWAP_PRICES.STATUS,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_SWAP_PRICES.SCHEMA,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_SWAP_PRICES.MESSAGE,
      UNISWAP_POST_REQUEST_PARAMS.POST_UNISWAP_SWAP_PRICES.DB_STATUS
    );
  });
});
