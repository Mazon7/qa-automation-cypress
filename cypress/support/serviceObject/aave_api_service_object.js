///<reference types="Cypress"  />
import DBConnection from "./data_base_connection";

class AaveApi {
  constructor() {
    this.dbConnection = new DBConnection();
  }
  PostRequestAaveAPI(
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
      if (message != undefined) expect(response.body).to.contain(message);
      if (schema != undefined)
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
  GetRequestAaveAPI(accessToken2FA, urls, query, status, schema) {
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
      qs: query,
    }).then((response) => {
      expect(response.status).to.eq(status);
      expect(response.body).to.be.jsonSchema(JSON.parse(schema));
    });
  }
}
export default AaveApi;
