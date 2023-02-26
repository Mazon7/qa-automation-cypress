///<reference types="Cypress"  />
class AccessToken {
  GetLoginAccessToken(mail, password) {
    return new Promise((resolve) => {
      cy.request({
        url: Cypress.env("stage_url") + "api/v2/login",
        method: "POST",
        body: { email: mail, password: password },
      }).then((response) => {
        resolve(response.body.token);
      });
    });
  }

  GenerateOTP(secret2FA) {
    return new Promise((resolve) => {
      cy.task("generateOTP", secret2FA).then((token) => {
        resolve(token);
      });
    });
  }
  async GetCodeNumber(mail, password, secret2FA) {
    let loginAccessToken = await this.GetLoginAccessToken(mail, password);
    cy.log(loginAccessToken + " loginAccessToken...");
    let codeNumber = await this.GenerateOTP(secret2FA);
    cy.log(codeNumber + " code number...");
    return codeNumber;
  }

  async GetLogin2FaAccessToken(mail, password, secret2FA) {
    let loginAccessToken = await this.GetLoginAccessToken(mail, password);
    cy.log(loginAccessToken + " loginAccessToken...");
    let authorization = `bearer ${loginAccessToken}`;
    let codeNumber = await this.GenerateOTP(secret2FA);
    cy.log(codeNumber + " code number...");
    return new Promise((resolve) => {
      cy.request({
        url: Cypress.env("stage_url") + "api/2fa/login",
        method: "POST",
        failOnStatusCode: false,
        headers: {
          authorization,
        },
        body: {
          code: codeNumber,
        },
      }).then((response) => {
        cy.log(response.body.token + " loginAccessToken SECOND...");
        resolve(response.body.token);
      });
    });
  }
}

export default AccessToken;
