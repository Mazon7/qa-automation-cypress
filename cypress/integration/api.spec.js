import APIrequests from "./pageObjects/api_requests.js";

describe("Public API tests", function () {
  const api_requests = new APIrequests();

  it("Creates user", function () {
    api_requests.CreateUser();
  });

  it("Fetch v1 acc", function () {
    api_requests.FetchAccountsV1();
  });

  it("Check API currencties", function () {
    api_requests.checkAPIcurrencies();
  });

  it.skip("Fetch balance history", function () {
    api_requests.BalanceHistoryV2();
  });

  it("Fetch V1 balance", function () {
    api_requests.FetchBalanceV1();
  });

  it("Fetch V2 balance", function () {
    api_requests.FetchBalanceV2();
  });

  it("Fetch V2 accounts", function () {
    api_requests.FetchAccountsV2();
  });

  it("Fetch V2 transfers", function () {
    api_requests.FetchTransfersV2();
  });

  it.skip("Makes transfer with AccountType", function () {
    api_requests.MakeTransferAccountType();
  });

  it("Makes transfer with limit", function () {
    api_requests.TransfersV2Limit();
  });

  it("Makes transfer with offset", function () {
    api_requests.TransfersV2LimitOffset();
  });

  it("Makes transfer with offset -1 error 400", function () {
    api_requests.TransfersV2LimitOffsetError();
  });
});
