import { CALLS, usersAPI } from "../../../constants";

class APIrequests {
  PUT() {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomName = `${randomNumToString.slice(0, 8)}.test`;

    cy.request({
      url:
        env.DEV_URL +
        "backend/api/my/apikeys/a75903c5-a4d1-11ea-a830-0242ac130003?portfolioId=a763ecf2-a4d1-11ea-a830-0242ac130003",
      method: "PUT",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },

      body: {
        name: randomName,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response).to.have.property("headers");
    });
  }

  POST() {
    cy.request({
      url:
        env.DEV_URL +
        "backend/api/my/apikeys/a75903c5-a4d1-11ea-a830-0242ac130003?portfolioId=a763ecf2-a4d1-11ea-a830-0242ac130003",
      method: "POST",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },

      body: {
        name: "jhjhjhjh1111111",
        exchangeId: "8ef4bd2a-4d33-42a6-a41b-2e9ce1399827",
        accountType: "spot",
        amountReadOnlyApiKeys: "2",
        amountTradingApiKeys: "2",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response).to.have.property("headers");
    });
  }

  GET() {
    cy.request({
      url:
        env.DEV_URL +
        "backend/api/my/apikeys/a75903c5-a4d1-11ea-a830-0242ac130003?portfolioId=a763ecf2-a4d1-11ea-a830-0242ac130003",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
    });
  }

  CreateUser() {
    cy.request({
      url: env.DEV_URL + "backend/uapi/v2/accounts",
      method: "POST",

      auth: {
        Cookie:
          "session.id=s%3AMKPjdc8WKJuUSGyFch47DL6MWdFqsX4U.wB4F9xuHyqeUYSpOG%2FmC0XUhbZy6EYTC6brRJSqjs14",
      },

      body: {
        id: "600aad00c3e5a918e75616ff",
        name: "john smith",
        email: env.TEST_EMAIL,
      },
    });
  }

  FetchBalanceV1() {
    cy.request({
      url:
        env.DEV_URL +
        "uapi/v1/account/cae57c4b-1138-490f-8bc2-e43f5f2e1c32/balance",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
    });
  }

  FetchBalanceV2() {
    cy.request({
      url:
        env.DEV_URL +
        "uapi/v2/account/cae57c4b-1138-490f-8bc2-e43f5f2e1c32/balance",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
    });
  }

  BalanceHistoryV2() {
    cy.request({
      url: CALLS.BALANCE_HISTORY_V2,

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
    });
  }

  FetchAccountsV2() {
    cy.request({
      url: CALLS.ACCOUNTS_V2,

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body[0].id).to.exist;
      expect(response.body[0].name).to.exist;
      expect(response.body[0].exchange).to.exist;
      expect(response.body[0].accountType).to.exist;

      expect(response).to.have.property("headers");
    });
  }

  FetchAccountsV1() {
    cy.request({
      url: env.DEV_URL + "uapi/v1/accounts",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body[0].id).to.exist;
      expect(response.body[0].name).to.exist;
      expect(response.body[0].exchange).to.exist;
      expect(response.body[0].accountType).to.exist;

      expect(response).to.have.property("headers");
    });
  }

  FetchTransfersV2() {
    cy.request({
      url: env.DEV_URL + "uapi/v2/transfers",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body[0].jobId).to.exist;
      expect(response.body[0].instrument).to.exist;
      expect(response.body[0].amount).to.exist;
      expect(response.body[0].status).to.exist;
      expect(response.body[0].fromAccountId).to.exist;
      expect(response.body[0].fromExchangeId).to.exist;
      expect(response.body[0].toAccountId).to.exist;
      expect(response.body[0].toExchangeId).to.exist;
      expect(response.body[0].speed).to.exist;
      expect(response.body[0].fees).to.exist;
      expect(response.body[0].labels).to.exist;
      expect(response.body[0].createdAt).to.exist;
      expect(response.body[0].createdAtTimestamp).to.exist;

      expect(response).to.have.property("headers");
    });
  }

  TransfersV2Limit() {
    cy.request({
      url: env.DEV_URL + "uapi/v2/transfers?limit=2",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body[0].jobId).to.exist;
      expect(response.body[1].jobId).to.exist;
      expect(response.body[2]).to.not.exist; // check filter

      expect(response).to.have.property("headers");
    });
  }

  TransfersV2LimitOffset() {
    cy.request({
      url: env.DEV_URL + "uapi/v2/transfers?limit=2&offset=1",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body[0].jobId).to.exist;
      expect(response.body[1].jobId).to.exist;
      expect(response.body[2]).to.not.exist; // check filter

      expect(response).to.have.property("headers");
    });
  }

  TransfersV2LimitOffsetError() {
    cy.request({
      url: env.DEV_URL + "uapi/v2/transfers?limit=2&offset=-2",
      failOnStatusCode: false,

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response).to.have.property("headers");
    });
  }

  MakeTransferAccountType() {
    cy.request({
      url: env.DEV_URL + "uapi/v1/transfer",
      method: "POST",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },

      body: {
        fromAccountId: "8e81e83b-5194-4bf7-a048-9e46925e8b14",
        toAccountId: "a75903c5-a4d1-11ea-a830-0242ac130003",
        instrument: "EOS",
        amount: 1,
        accountType: "spot",
      },
    })
      .its("status")
      .should("be.ok");
  }

  checkAPIcurrencies() {
    cy.request({
      url: env.DEV_URL + "uapi/v1/instruments",

      auth: {
        username: usersAPI.API_USERNAME,
        password: usersAPI.API_PASS,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response).to.have.property("headers");
    });
  }
}

export default APIrequests;
