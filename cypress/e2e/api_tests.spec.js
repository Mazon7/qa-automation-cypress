import RiskAPI from "./pageObjects/requests_api.js";

describe("Public API tests", () => {
  const risk_api = new RiskAPI();

  // Decalare token variable for the Authorization for all APIs
  let token;

  before(async () => {
    token = await risk_api.getToken();
  });

  it("Check Base URL", () => {
    risk_api.BaseURL();
  });

  it("Signs up new user", () => {
    risk_api.SignUp(token);
  });

  it("Authorizes user", () => {
    risk_api.SignIn();
  });

  it("Forgot Password", () => {
    risk_api.ForgotPassword();
  });

  // ALERT: changing expiration time
  it("Validate Access Token", () => {
    risk_api.ValidateToken(token);
  });

  it("Authorize", () => {
    risk_api.Authorize();
  });

  it("Reset Token", () => {
    cy.forgotPasswordAPI().then((response) => {
      let newToken = response.body.token;
      risk_api.ResetToken(newToken);
    });
  });

  it("LogOut", () => {
    risk_api.LogOut();
  });

  it("SubscribePing", () => {
    risk_api.SubscribePing();
  });

  it("Check", () => {
    risk_api.Check(token);
  });

  it("TwoFAuthentication", () => {
    risk_api.TwoFAuthentication(token);
  });

  it("UserInfo", () => {
    risk_api.UserInfo();
  });

  it("GetRoles", () => {
    risk_api.GetRoles(token);
  });

  it("Create/Update/Remove Roles", () => {
    risk_api.CRUDRoles(token);
  });

  it("GetAccounts", () => {
    risk_api.GetAccounts(token);
  });

  it("Create/Update/Remove Account", () => {
    risk_api.CRUDAccounts(token);
  });

  it("IndividualCollateral", () => {
    risk_api.IndividualCollateral(token);
  });

  it("SyntheticCurrency", () => {
    risk_api.SyntheticCurrency(token);
  });

  it("SendMarginCall", () => {
    risk_api.SendMarginCall(token);
  });

  it("Currency", () => {
    risk_api.GetCurrency(token);
  });

  it("Create/Update/Delete Currency", () => {
    risk_api.CRUDCurrency(token);
  });

  it("Customer Portal APIs", () => {
    risk_api.CustomerPortal();
  });

  it("GetUsers", () => {
    risk_api.GetUsers(token);
  });

  it("Create/Update/Remove Users", () => {
    risk_api.CRUDUsers(token);
  });

  it("Get Emails", () => {
    risk_api.GetEmailTemplates(token);
  });

  it("Create/Update/Remove Emails", () => {
    risk_api.CRUDEmailTemplates(token);
  });

  it("CurrencyOrder", () => {
    risk_api.CurrencyOrder(token);
  });

  it("ExchangeOrder", () => {
    risk_api.ExchangeOrder(token);
  });

  it("Snapshot", () => {
    risk_api.SnapShot(token);
  });

  it("MarginGroup", () => {
    risk_api.MarginGroup(token);
  });

  it("Instruments", () => {
    risk_api.Instruments();
  });

  it("Subscribe", () => {
    risk_api.Subscribe();
  });

  // Not all types can exist on all exchanges
  it("Price", () => {
    risk_api.Price();
  });
});
