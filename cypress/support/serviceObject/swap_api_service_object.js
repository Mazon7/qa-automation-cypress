///<reference types="Cypress"  />
import DBConnection from "../serviceObject/data_base_connection";

class SwapAPI {
  constructor() {
    this.dbConnection = new DBConnection();
  }

  GetRequestSwapAPI(
    accessToken2FA,
    urls,
    portfolio,
    status,
    schema,
    errorMessage
  ) {
    cy.request({
      url: urls,
      method: "GET",
      failOnStatusCode: false,
      headers:
        accessToken2FA !== undefined
          ? {
              authorization: `bearer ${accessToken2FA}`,
            }
          : {},
      qs:
        portfolio !== undefined
          ? {
              portfolioId: portfolio,
            }
          : {},
    }).then((response) => {
      expect(response.status).to.eq(status);
      if (errorMessage != undefined)
        expect(response.body.message).to.be.eq(errorMessage);
      if (schema != undefined)
        expect(response.body).to.be.jsonSchema(JSON.parse(schema));
    });
  }
  PostRequestSwapAPI(
    accessToken2FA,
    urls,
    requestBody,
    status,
    schema,
    message,
    statusInDB
  ) {
    cy.request({
      url: urls,
      method: "POST",
      failOnStatusCode: false,
      headers: {
        authorization: `bearer ${accessToken2FA}`,
      },
      body: requestBody,
    }).then((response) => {
      cy.log(response.body);
      expect(response.status).to.eq(status);
      if (message != undefined) expect(response.body).to.has.contain(message);
      expect(response.body).to.be.jsonSchema(JSON.parse(schema));
      if (response.status == 201) {
        this.dbConnection.waitUntillStatusWillBeChanged(
          response.body.id,
          statusInDB,
          10
        );
      }
    });
  }
}
export default SwapAPI;
