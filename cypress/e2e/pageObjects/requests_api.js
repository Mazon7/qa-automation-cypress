import { mainURL, loginInfo, portalCreds } from "../../../constants";

class RiskAPI {
  getToken() {
    return new Promise((resolve) => {
      cy.GetAccessToken(mainURL.stage).then((response) => {
        resolve(response.body.access_token);
      });
    });
  }

  // Public API routes

  // Base API url
  BaseURL() {
    cy.request({
      url: `${mainURL.stage}api/v1`,
      method: "GET",
    })
      .its("status")
      .should("be.ok");
  }

  // Sign Up
  SignUp(access_token) {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomString = `e2e-${randomNumToString.slice(-5)}`;
    const randomPassword = `${randomNumToString.slice(0, 8)}`;

    cy.log("**SIGN UP USER**");
    cy.request({
      url: `${mainURL.stage}api/v1/signup`,
      method: "POST",
      body: {
        name: randomString,
        email: `${randomString}@example.com`,
        password: "testpass",
        confirm: "testpass",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      let id = response.body.user.id;
      // Remove created user
      cy.request({
        url: `${mainURL.stage}api/v1/users`,
        method: "DELETE",
        body: {
          key: "remove",
          id: id,
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
        .its("status")
        .should("be.ok");
    });

    // NEGATIVE TEST: no password confirm check
    cy.log("**NO PASSWORD CONFIRM CHECK**");
    cy.request({
      url: `${mainURL.stage}api/v1/signup`,
      method: "POST",
      body: {
        name: randomString,
        email: `${randomString}@example.com`,
        password: "testpass",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      cy.fixture("sign_up_error").then((data) => {
        expect(response.body.error).to.eq(data.error);
        expect(response.body.message).to.eq(data.message);
        expect(response.body.code).to.eq(data.code);
      });
    });

    // NEGATIVE TEST: no email check
    cy.log("**NO EMAIL CHECK**");
    cy.request({
      url: `${mainURL.stage}api/v1/signup`,
      method: "POST",
      body: {
        name: randomString,
        password: "testpass",
        confirm: "testpass",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
    });
  }

  // Sign In
  SignIn() {
    cy.request({
      url: `${mainURL.stage}api/v1/signin`,
      method: "POST",
      body: {
        email: loginInfo.login,
        password: loginInfo.pass,
      },
    })
      .its("status")
      .should("be.ok");

    //  NEGATIVE TEST: no password check
    cy.request({
      url: `${mainURL.stage}api/v1/signin`,
      method: "POST",
      body: {
        email: loginInfo.login,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.statusText).to.eq("Unauthorized");
      cy.fixture("sign_in_error").then((data) => {
        expect(response.body.error).to.eq(data.error);
        expect(response.body.message).to.eq(data.message);
        expect(response.body.code).to.eq(data.code);
      });
    });
  }

  // 2F Authentication
  // API DOESN'T WORK PROPERLY, NEED to FIX (200 response when otp code is not specified in the request)
  TwoFAuthentication() {
    cy.LogInAPI().then((response) => {
      cy.task("generateOTP", loginInfo.secret_stage).then((token) => {
        cy.request({
          url: `${mainURL.stage}api/v1/2fa`,
          method: "POST",
          body: {
            code: token,
            id: response.body.user.id,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Provider API routes
  ValidateToken(access_token) {
    let token = access_token;
    cy.request({
      method: "GET",
      url: `${mainURL.stage}oauth/validate?access_token=${token}`,
    }).then((response) => {
      console.log(response.body);
      expect(response.body.access_token).equal(token);
      expect(response.body.client_id).to.eq("test@bequant.io");
      expect(response.body.user_id).to.eq("");
      expect(response.body.expires_in).to.eq(7199);
    });

    // Negative: wrong method
    cy.log("**WRONG METHOD TEST**");
    cy.request({
      method: "POST",
      url: `${mainURL.stage}oauth/validate?access_token=${token}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.code).to.eq(405);
      expect(response.body.message).to.eq(
        "method POST is not allowed, but [GET] are"
      );
    });
  }

  // Authorize
  Authorize() {
    cy.request({
      method: "GET",
      url: `${mainURL.stage}oauth/authorize?client_id=${loginInfo.login}&redirect_uri=${mainURL.stage}api/v1/callback&response_type=code&scope=all&state=xyz`,
    }).then((response) => {
      console.log(response.body);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("code");
      expect(response.body.originalUrl).to.eq(
        `/api/v1/callback?code=${response.body.code}&state=xyz`
      );
      expect(response.body.state).to.eq("xyz");
    });

    // Negative: wrong parameter
    cy.log("**WORNG PARAMETER IN THE CALLBACK**");
    cy.request({
      method: "GET",
      url: `${mainURL.stage}oauth/authorize?client_id=${loginInfo.login}o&redirect_uri=${mainURL.stage}api/v1/callback&response_type=text&scope=all&state=xyz`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
      expect(response.statusText).to.eq("Unprocessable Entity");
      expect(response.body.code).to.eq(606);
      expect(response.body.message).to.eq(
        "response_type in query should be one of [code token]"
      );
    });
  }

  // Check Access Token
  Check(access_token) {
    // Get client_id & client_secret
    // Send request with access token in header
    cy.request({
      method: "POST",
      url: `${mainURL.stage}api/v1/check`,
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
      .its("status")
      .should("be.ok");

    // Negative: Invalid token
    cy.log("**IVALID TOKEN TEST**");
    cy.request({
      method: "POST",
      url: `${mainURL.stage}api/v1/check`,
      headers: {
        Authorization: "Bearer " + access_token + 1,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.eq("invalid access token\n");
      expect(response.status).to.eq(500);
    });
  }

  // Forgot Password
  ForgotPassword() {
    cy.request({
      url: `${mainURL.stage}api/v1/forgot-password`,
      method: "POST",
      body: {
        email: loginInfo.login,
      },
    })
      .its("status")
      .should("be.ok");

    //  NEGATIVE TEST: no email check
    cy.request({
      url: `${mainURL.stage}api/v1/forgot-password`,
      method: "POST",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.message).to.eq(
        "account with that email address does not exist"
      );
    });
  }

  // Reset Token
  ResetToken(token) {
    cy.request({
      url: `${mainURL.stage}api/v1/reset/${token}`,
      method: "POST",
      body: {
        password: loginInfo.pass,
      },
    })
      .its("status")
      .should("be.ok");
  }

  // Logout
  LogOut() {
    cy.request({
      url: `${mainURL.stage}api/v1/logout`,
      method: "POST",
    })
      .its("status")
      .should("be.ok");
  }

  //Subscribe ping
  SubscribePing() {
    cy.request({
      url: `${mainURL.stage}subscribe/ping`,
      method: "GET",
    }).then((response) => {
      expect(response.body).to.have.property("uptime");
    });
  }

  // Get user info
  UserInfo() {
    cy.request({
      url: `${mainURL.stage}api/v1/userinfo`,
      method: "GET",
    }).then((response) => {
      expect(response.body).to.deep.eq({
        email: loginInfo.login_grafana,
      });
    });
  }

  // Roles
  GetRoles(access_token) {
    cy.request({
      url: `${mainURL.stage}api/v1/roles`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let responseAraay = response.body.roles;
      responseAraay.forEach((arrayItem) => {
        expect(arrayItem).to.have.property("id");
        expect(arrayItem).to.have.property("title");
        expect(arrayItem).to.have.property("status");
        // expect(arrayItem).to.have.property("description"); // field is optional it's not populated when it's unset in the DB, it can be empty '' when value was removed
      });
    });
  }

  CRUDRoles(access_token) {
    // Create the test role
    // NEED TO FIX AND MAKE title and status obligatory fields
    // IF BODY IS WRONG OR EMPTY SHOULD THROW AN ERROR
    // Currently when body is missing, it creates role with empty string which is wrong
    cy.request({
      url: `${mainURL.stage}api/v1/roles`,
      method: "POST",
      body: {
        title: "testrole",
        description: "this is a test role description",
        status: true,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      expect(response.body.role.description).equal(
        "this is a test role description"
      );
      expect(response.body.role.status).equal(true);
      expect(response.body.role.title).equal("testrole");

      // Edit the test role
      // NEED TO FIX: WHEN PASSING ONLY ID IN THE REQUEST ALL OTHER PARAMETERS ARE REMOVED
      cy.request({
        url: `${mainURL.stage}api/v1/roles`,
        method: "PUT",
        body: {
          id: response.body.role.id,
          title: "testrole changed",
          description: "this is a changed test role description",
          status: false,
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        console.log(response);
        expect(response.body.role.description).equal(
          "this is a changed test role description"
        );
        expect(response.body.role.status).equal(false);
        expect(response.body.role.title).equal("testrole changed");

        // Remove the test role
        cy.request({
          url: `${mainURL.stage}api/v1/roles`,
          method: "DELETE",
          body: {
            id: response.body.role.id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });

    // NEGATIVE UPDATE AND DELETE ROLE
    // NEED TO FIX:
    // WHEN NO BODY SPECIFIED: response is {error: true, message: 'role not found'}
    // FOR PUT AND DELETE WHEN WORNG ID SPECIFIED: response is from  Mongo DB/Mongoose
    cy.log("**NEGATIVE ROLE TEST**");
    cy.request({
      url: `${mainURL.stage}api/v1/roles`,
      method: "PUT",
      // body: {
      //   id: "5e5632bd386bf2060cf2fb1r",
      //   title: "testrole changed",
      //   description: "this is a changed test role description",
      //   status: false,
      // },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.deep.equal({
        error: true,
        message: "role not found",
      });
      expect(response.status).equal(500);

      cy.request({
        url: `${mainURL.stage}api/v1/roles`,
        method: "DELETE",
        // body: {
        //   id: "1234567890",
        // },
        headers: {
          Authorization: "Bearer " + access_token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body).to.deep.equal({
          error: true,
          message: "role not found",
        });
        expect(response.status).equal(500);
      });
    });
  }

  // Users
  GetUsers(access_token) {
    // Get All Users
    cy.request({
      url: `${mainURL.stage}api/v1/users`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      console.log(response.body);
      let items = response.body.users;
      for (let UserObject of items) {
        expect(UserObject).to.have.property("id");
        expect(UserObject).to.have.property("clientsIds");
        expect(UserObject).to.have.property("email");
        expect(UserObject).to.have.property("registered");
        expect(UserObject).to.have.property("updated");
        expect(UserObject).to.have.property("roles");
        expect(UserObject).to.have.property("status");
        expect(UserObject).to.have.property("username");
      }
    });
  }

  CRUDUsers(access_token) {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomMail = `e2e@-${randomNumToString.slice(-5)}.com`;
    const randomString = `${randomNumToString.slice(5)}`;
    const randomNewNumToString = (Math.random() * 1e20).toString(36);
    const randomNewMail = `e2e@-${randomNumToString.slice(-5)}.com`;
    const randomNewString = `${randomNumToString.slice(5)}`;
    // Create user
    cy.request({
      url: `${mainURL.stage}api/v1/users`,
      method: "POST",
      body: {
        name: randomString,
        email: randomMail,
        password: "testpass",
        confirm: "testpass",
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let UserObject = response.body.user;
      expect(response.status).to.eq(200);
      expect(UserObject.username).to.eq(randomString);
      expect(UserObject.email).to.eq(randomMail);
      expect(UserObject.status).to.eq(true);
      expect(UserObject).to.have.property("id");
      expect(UserObject).to.have.property("clientsIds");
      expect(UserObject).to.have.property("registered");
      expect(UserObject).to.have.property("updated");
      expect(UserObject).to.have.property("roles");

      // Edit created user
      cy.request({
        url: `${mainURL.stage}api/v1/users`,
        method: "PUT",
        body: {
          key: "update",
          user: {
            id: response.body.user.id,
            email: randomNewMail,
            username: randomNewString,
            status: false,
            roles: ["admin", "manager"],
          },
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let UserObject = response.body.user;
        expect(response.status).to.eq(200);
        expect(UserObject.username).to.eq(randomNewString);
        expect(UserObject.email).to.eq(randomNewMail);
        expect(UserObject.roles).to.deep.eq(["admin", "manager"]);
        expect(UserObject.status).to.eq(false);

        // Remove created user
        cy.request({
          url: `${mainURL.stage}api/v1/users`,
          method: "DELETE",
          body: {
            key: "remove",
            id: UserObject.id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Accounts
  GetAccounts(access_token) {
    Cypress.config({ responseTimeout: 50000 });
    // Get Account Info
    cy.log("Get all accounts");
    cy.request({
      url: `${mainURL.stage}api/v1/client`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      console.log(response.body);
      // Checking properties for Master (QA) client
      let firstAccountObject = response.body.accounts.find(
        (element) => element.uid === "5ea6b8a1cad53eb429052c25"
      );
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("accounts");
      expect(firstAccountObject).to.have.property("uid");
      expect(firstAccountObject).to.have.property("id");
      expect(firstAccountObject).to.have.property("nfid");
      expect(firstAccountObject).to.have.property("name");
      expect(firstAccountObject).to.have.property("type");
      expect(firstAccountObject).to.have.property("accountType");
      expect(firstAccountObject).to.have.property("swapType");
      expect(firstAccountObject).to.have.property("email");
      expect(firstAccountObject).to.have.property("managersIds");
      expect(firstAccountObject).to.have.property("individualCollateral");
      expect(firstAccountObject).to.have.property("entity");
      expect(firstAccountObject).to.have.property("exchanges");
      expect(firstAccountObject).to.have.property("customerPortalId");
      expect(firstAccountObject).to.have.property("isActive");
      expect(firstAccountObject).to.have.property("isLoan");
      expect(firstAccountObject).to.have.property("ltv");
      expect(firstAccountObject).to.have.property("swapLoans");
      expect(firstAccountObject).to.have.property("syntheticCurrency");
      expect(firstAccountObject).to.have.property("marginCall");
      expect(firstAccountObject).to.have.property("useNewLoan");
      expect(firstAccountObject).to.have.property("risk");
      expect(firstAccountObject).to.have.property("marketData");
      expect(firstAccountObject).to.have.property("marginGroup");
      expect(firstAccountObject).to.have.property("discountType");
      expect(firstAccountObject).to.have.property("leverage");
      expect(firstAccountObject).to.have.property("loans");
      expect(firstAccountObject).to.have.property("withdrawal");
    });
  }

  CRUDAccounts(access_token) {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomString = `${randomNumToString.slice(5)}`;
    // Create test account
    cy.log("Create account");
    cy.request({
      url: `${mainURL.stage}api/v1/client`,
      method: "POST",
      body: {
        id: randomString,
        name: "Test Account",
        accountType: "pro",
        email: loginInfo.login,
        managers: [loginInfo.login],
        ltv: { i: 0.85, m: 0.95 },
        risk: { leverageRatio: 4 },
        swapType: false,
        nfid: "Prime Test",
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let AccountObject = response.body.account;
      expect(response.status).to.eq(200);
      // Confirm that passed data is present in response
      expect(AccountObject.accountType).equal("pro");
      expect(AccountObject.email).equal(loginInfo.login);
      expect(AccountObject.id).equal(randomString);
      expect(AccountObject.name).equal("Test Account");
      expect(AccountObject.ltv).to.deep.equal({ i: 0.85, m: 0.95 });
      expect(AccountObject.swapType).equal(false);
      expect(AccountObject.isActive).equal(false);
      expect(AccountObject.leverageRatio).equal(4);
      expect(AccountObject.managersIds[0].email).equal("test@bequant.io");
      expect(AccountObject.withdrawal).to.deep.equal({ coefficient: 0 });
      // Confirm that other properties are in place
      expect(AccountObject).to.have.property("createdAt");
      expect(AccountObject).to.have.property("customerPortalId");
      expect(AccountObject).to.have.property("exchanges");
      expect(AccountObject).to.have.property("fid");
      expect(AccountObject).to.have.property("groups");
      expect(AccountObject).to.have.property("individualCollateral");
      expect(AccountObject).to.have.property("isActive");
      expect(AccountObject).to.have.property("loans");
      expect(AccountObject).to.have.property("marginCall");
      expect(AccountObject).to.have.property("marginGroup");
      expect(AccountObject).to.have.property("nfid");
      expect(AccountObject).to.have.property("syntheticCurrency");
      expect(AccountObject).to.have.property("updatedAt");
      expect(AccountObject).to.have.property("useNewLoan");
      expect(AccountObject).to.have.property("useNewLoan");
      expect(AccountObject).to.have.property("__v");
      expect(AccountObject).to.have.property("_id");

      // Edit test account
      cy.log("Edit account");
      cy.request({
        url: `${mainURL.stage}api/v1/client`,
        method: "PUT",
        body: {
          _id: AccountObject._id,
          id: "Account01 new",
          name: "Test Account new",
          accountType: "pro",
          email: loginInfo.login,
          managers: [loginInfo.login],
          ltv: { i: 0.87, m: 0.97 },
          risk: { leverageRatio: 3 },
          swapType: true,
          nfid: "Prime Test",
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let AccountObject = response.body.account;
        // Confirm chnaged properties
        expect(AccountObject.id).equal("Account01 new");
        expect(AccountObject.name).equal("Test Account new");
        expect(AccountObject.ltv).to.deep.equal({ i: 0.87, m: 0.97 });
        expect(AccountObject.swapType).equal(true);
        expect(AccountObject.leverageRatio).equal(3);

        // Remove test account
        cy.log("Remove account");
        cy.request({
          url: `${mainURL.stage}api/v1/client`,
          method: "DELETE",
          body: {
            id: AccountObject._id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  }

  // Individual Collateral
  IndividualCollateral(access_token) {
    // Create IndividualCollateral
    cy.request({
      url: `${mainURL.stage}api/v1/client/individualCollateral`,
      method: "POST",
      body: {
        currency: "DASH",
        amount: 100,
        discount: 10,
        uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let individualCollateral = response.body.individualCollateral;
      expect(individualCollateral).to.have.property("_id");
      expect(individualCollateral.currency).to.eq("DASH");
      expect(individualCollateral.amount).to.eq(100);
      expect(individualCollateral.discount).to.eq(10);

      // Edit IndividualCollateral
      cy.request({
        url: `${mainURL.stage}api/v1/client/individualCollateral`,
        method: "PUT",
        body: {
          id: individualCollateral._id,
          currency: "XRP",
          amount: 150,
          discount: 20,
          uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      })
        .then((response) => {
          let individualCollateral = response.body.individualCollateral;
          expect(individualCollateral.currency).to.eq("XRP");
          expect(individualCollateral.amount).to.eq(150);
          expect(individualCollateral.discount).to.eq(20);
          // Remove IndividualCollateral
          cy.request({
            url: `${mainURL.stage}api/v1/client/individualCollateral`,
            method: "DELETE",
            body: {
              id: individualCollateral._id,
              uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
            },
            headers: {
              Authorization: response.requestHeaders.Authorization,
            },
          });
        })
        .its("status")
        .should("be.ok");
    });

    // NEGATIVE TEST
    // FOR ALL REQUESTS: WRONG RESPONSE FROM API IF uid is not specified
    cy.log("**NEGATIVE TEST**");
    cy.request({
      url: `${mainURL.stage}api/v1/client/individualCollateral`,
      method: "POST",
      body: {
        currency: "DASH",
        amount: 100,
        discount: 10,
        uid: "5ea6b8a1cad53eb429052c25ABCD", // PUT WRONG UID
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      // Assertion if uid is not specified
      // expect(response.body).to.deep.equal({
      //   error: true,
      //   errors: { message: "account with this id does not exist" },
      // });
    });

    cy.request({
      url: `${mainURL.stage}api/v1/client/individualCollateral`,
      method: "PUT",
      body: {
        // id: "393nfk39nd0202", // wrong id for collateral
        currency: "XRP",
        amount: 150,
        discount: 20,
        uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      // Assertion if ID is not specificed in the body
      // expeect(response.body).to.deep.equal({"error": true, "errors": {"message": "individual collateral with this id does not exist"}})

      cy.request({
        url: `${mainURL.stage}api/v1/client/individualCollateral`,
        method: "DELETE",
        body: {
          id: "ilk5fjps3939",
          uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body).to.deep.equal({
          error: true,
          errors: {
            message: "individual collateral with this id does not exist",
          },
        });
      });
    });
  }

  // Synthetic Currency
  SyntheticCurrency(access_token) {
    // Create Synthetic Currency
    cy.request({
      url: `${mainURL.stage}api/v1/client/syntheticCurrency`,
      method: "POST",
      body: {
        currency: "DOGE",
        amount: 100,
        uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let syntheticCurrency = response.body;
      expect(response.status).to.eq(200);
      // expect(syntheticCurrency.amount).to.eq(100);
      // expect(syntheticCurrency.currency).to.eq("DOGE");
      // expect(syntheticCurrency).to.have.property("_id");
      // Edit created Synthetic Currency
      cy.request({
        url: `${mainURL.stage}api/v1/client/syntheticCurrency`,
        method: "PUT",
        body: {
          id: syntheticCurrency._id,
          currency: "DOGE",
          amount: 150,
          uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let syntheticCurrency = response.body;
        expect(response.status).to.eq(200);
        // expect(syntheticCurrency.amount).to.eq(150);

        // Remove Synthetic Currency
        cy.request({
          url: `${mainURL.stage}api/v1/client/syntheticCurrency`,
          method: "DELETE",
          body: {
            id: syntheticCurrency._id,
            uid: "5ea6b8a1cad53eb429052c25", // Client Name: Master (QA)
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Send Margin Call
  // NEED TO FIX - No error if the body is not specified or wrong name is specified in the array
  SendMarginCall(access_token) {
    // Send Margin Call
    cy.log("Send Margin Call");
    cy.request({
      url: `${mainURL.stage}api/v1/client/sendMarginCall`,
      method: "POST",
      body: {
        names: ["Test(QA)01"],
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      console.log(response.body);
    });
    // .its("status")
    // .should("be.ok");
    //QUESTION: Possible to confirm that is done in UI?
  }

  // Currency
  GetCurrency(access_token) {
    cy.request({
      url: `${mainURL.stage}api/v1/currency`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
      .then((response) => {
        console.log(response.body);
      })
      .its("status")
      .should("be.ok");

    // NEGATIVE - adding redundant parameter in the URL
    cy.request({
      url: `${mainURL.stage}api/v1/currency?id=6176ec9d1c63226193e73688`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body).to.deep.eq({
        error: true,
        message: "you don't have permissions to do that",
        code: "invalid credentials",
      });
    });
  }

  CRUDCurrency(access_token) {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomString = `${randomNumToString.slice(5)}`;
    cy.request({
      url: `${mainURL.stage}api/v1/currency`,
      method: "POST",
      body: {
        name: randomString,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let currency = response.body.currency;
      expect(response.status).to.eq(200);
      expect(currency.name).to.eq(randomString);
      expect(currency).to.have.property("_id");

      cy.request({
        url: `${mainURL.stage}api/v1/currency`,
        method: "PUT",
        body: {
          _id: currency._id,
          name: randomString,
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let currency = response.body.currency;
        expect(response.status).to.eq(200);
        expect(currency.name).to.eq(randomString);
        cy.request({
          url: `${mainURL.stage}api/v1/currency`,
          method: "DELETE",
          body: {
            id: currency._id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });

    // NEGATIVE CASES
    cy.log("**NEGATIVE CASES**");

    // Passing wrong type to the body parameter
    cy.request({
      url: `${mainURL.stage}api/v1/currency`,
      method: "POST",
      body: {
        name: { random: "object" },
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      // expect(response.body).to.deep.eq({
      //   error: true,
      //   message: "you don't have permissions to do that",
      //   code: "invalid credentials",
      // });
    });

    // let currency = response.body.currency;
    // expect(response.status).to.eq(200);
    // expect(currency.name).to.eq(randomString);
    // expect(currency).to.have.property("_id");

    // Passing wrong parameter
    cy.request({
      url: `${mainURL.stage}api/v1/currency`,
      method: "PUT",
      body: {
        id: "3902nb276hl",
        name: randomString,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.deep.eq({
        error: true,
        message: "currency _id is required",
        code: "invalid credentials",
      });
    });

    // Not specifing body for the request
    cy.request({
      url: `${mainURL.stage}api/v1/currency`,
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + access_token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.deep.eq({
        error: true,
        message: "currency with that client ID does not exists",
        code: "invalid credentials",
      });
    });
  }

  // Customer Portal
  CustomerPortal() {
    cy.request({
      url: `${mainURL.stage}api/portal/v1/clients`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + portalCreds.token,
      },
    }).then((response) => {
      let firtsItem = response.body[0];
      expect(response.status).to.eq(200);
      expect(firtsItem).to.have.property("clientId");
      expect(firtsItem).to.have.property("cpClientId");
      expect(firtsItem).to.have.property("currency");
      expect(firtsItem).to.have.property("date");
      expect(firtsItem).to.have.property("freeAssets");
      expect(firtsItem).to.have.property("leverage");
      expect(firtsItem).to.have.property("loans");
      expect(firtsItem).to.have.property("ltvCurrent");
      expect(firtsItem).to.have.property("ltvInitial");
      expect(firtsItem).to.have.property("ltvLiquidation");
      expect(firtsItem).to.have.property("ownAssets");
      expect(firtsItem).to.have.property("status");
      expect(firtsItem).to.have.property("totalAssets");
      expect(firtsItem).to.have.property("validAssets");
    });

    cy.request({
      url: `${mainURL.stage}api/portal/v1/loans`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + portalCreds.token,
      },
    }).then((response) => {
      // Checking all properties using Nexo2 client (it should have all possible properties)
      let firtsItem = response.body.find(
        (element) => element.clientId === "Nexo2"
      );
      expect(response.status).to.eq(200);
      expect(firtsItem).to.have.property("brokerId");
      expect(firtsItem).to.have.property("clientId");
      expect(firtsItem).to.have.property("cpClientId");
      expect(firtsItem).to.have.property("createdAt");
      expect(firtsItem).to.have.property("creditValue");
      expect(firtsItem).to.have.property("currency");
      expect(firtsItem).to.have.property("date");
      expect(firtsItem).to.have.property("dateFrom");
      expect(firtsItem).to.have.property("datePaidTo");
      expect(firtsItem).to.have.property("dateTo");
      expect(firtsItem).to.have.property("daysFromStart");
      expect(firtsItem).to.have.property("daysPaid");
      expect(firtsItem).to.have.property("daysTotal");
      expect(firtsItem).to.have.property("daysUnpaid");
      expect(firtsItem).to.have.property("interestPayableCost");
      expect(firtsItem).to.have.property("interestPayableTotal");
      expect(firtsItem).to.have.property("interestPayableUnpaid");
      expect(firtsItem).to.have.property("isActive");
      expect(firtsItem).to.have.property("isCompletePaid");
      expect(firtsItem).to.have.property("isEnded");
      expect(firtsItem).to.have.property("isPayable");
      expect(firtsItem).to.have.property("isStarted");
      expect(firtsItem).to.have.property("loanId");
      expect(firtsItem).to.have.property("name");
      expect(firtsItem).to.have.property("rate");
      expect(firtsItem).to.have.property("ratePerDay");
      expect(firtsItem).to.have.property("totalDebt");
      expect(firtsItem).to.have.property("updatedAt");
    });

    // Margin Call has a lot of data, that is why additional timeut is used (still unstable)
    Cypress.config({ responseTimeout: 60000 });
    cy.request({
      url: `${mainURL.stage}api/portal/v1/margin_calls`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + portalCreds.token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      if (response.body.length) {
        let firtsItem = response.body[0];
        expect(firtsItem).to.have.property("clientId");
        expect(firtsItem).to.have.property("collateralAssets");
        expect(firtsItem).to.have.property("cpClientId");
        expect(firtsItem).to.have.property("currency");
        expect(firtsItem).to.have.property("date");
        expect(firtsItem).to.have.property("loans");
        expect(firtsItem).to.have.property("ltvCurrent");
        expect(firtsItem).to.have.property("ltvInitial");
        expect(firtsItem).to.have.property("ltvLiquidation");
        expect(firtsItem).to.have.property("marginCallAmount");
        expect(firtsItem).to.have.property("marginCallId");
        expect(firtsItem).to.have.property("marginCallTime");
        expect(firtsItem).to.have.property("message");
        expect(firtsItem).to.have.property("status");
        expect(firtsItem).to.have.property("totalAssets");
      }
    });

    cy.request({
      url: `${mainURL.stage}api/portal/v1/tickers`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + portalCreds.token,
      },
    }).then((response) => {
      // Check the properties of first object in general object
      let checkoObj = response.body[Object.keys(response.body)[0]];
      expect(response.status).to.eq(200);
      if (checkoObj.type === "spot") {
        // Spot type should have these properties
        expect(checkoObj).to.have.property("base");
        expect(checkoObj).to.have.property("quote");
      }
      // Other types can have base and quote props optionally
      expect(checkoObj).to.have.property("exchangeId");
      expect(checkoObj).to.have.property("price");
      expect(checkoObj).to.have.property("ticker");
      expect(checkoObj).to.have.property("type");
    });

    // NEGATIVE TESTS
    // NEED TO FIX: Can not perform negative tests because of lacking of error handling
    // cy.log("**NEGATIVE TESTS**");
    // cy.request({
    //   url: `${mainURL.stage}api/portal/v1/clients?`,
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer " + portalCreds.token,
    //   },
    //   failOnStatusCode: false,
    // }).then((response) => {
    //   console.log(response.body);
    // });

    // cy.request({
    //   url: `${mainURL.stage}api/portal/v1/loans`,
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer " + portalCreds.token,
    //   },
    //   failOnStatusCode: false,
    // })

    // cy.request({
    //   url: `${mainURL.stage}api/portal/v1/margin_calls`,
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer " + portalCreds.token,
    //   },
    //   failOnStatusCode: false,
    // })

    // cy.request({
    //   url: `${mainURL.stage}api/portal/v1/tickers`,
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer " + portalCreds.token,
    //   },
    //   failOnStatusCode: false,
    // })
  }

  // Email Templates
  GetEmailTemplates(access_token) {
    // Get Email Info
    cy.log("Get all email templates");
    cy.request({
      url: `${mainURL.stage}api/v1/email`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.property("entity");
      expect(response.body[0]).to.have.property("text");
      expect(response.body[0]).to.have.property("title");
      expect(response.body[0]).to.have.property("__v");
      expect(response.body[0]).to.have.property("_id");
    });
  }

  CRUDEmailTemplates(access_token) {
    // Create Email template
    cy.request({
      url: `${mainURL.stage}api/v1/email`,
      method: "POST",
      body: {
        title: "Test Template",
        entity: "Standart",
        text: "Dear Client, With capitalised to the Digital Asset Lending Agreement entered into between you and us, as amended from time to time. Any capitalised terms used but not defined herein shall have the meaning given to them in the Terms of Business and the Lending Agreement.",
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let emailTemplate = response.body.emailTemplate;
      expect(response.status).to.eq(200);
      expect(emailTemplate).to.have.property("_id");
      expect(emailTemplate).to.have.property("title");
      expect(emailTemplate).to.have.property("entity");
      expect(emailTemplate).to.have.property("text");
      // Edit created Email template
      cy.request({
        url: `${mainURL.stage}api/v1/email`,
        method: "PUT",
        body: {
          id: emailTemplate._id,
          title: "Test Template",
          entity: "Individual",
          text: "Changed text",
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let emailTemplate = response.body.emailTemplate;
        expect(response.status).to.eq(200);
        expect(emailTemplate.entity).to.eq("Individual");
        expect(emailTemplate.text).to.eq("Changed text");

        // Remove created email
        cy.request({
          url: `${mainURL.stage}api/v1/email`,
          method: "DELETE",
          body: {
            id: emailTemplate._id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Currency Order
  CurrencyOrder(access_token) {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomString = `${randomNumToString.slice(5)}`;
    const randomNewNumToString = (Math.random() * 1e20).toString(36);
    const randomNewString = `${randomNumToString.slice(5)}`;
    // Create Order for currency
    cy.request({
      url: `${mainURL.stage}api/v1/currencyOrder`,
      method: "POST",
      body: {
        name: randomString,
        order: 10,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let currencyOrder = response.body.currencyOrder;
      expect(response.status).to.eq(200);
      expect(currencyOrder.name).to.eq(randomString);
      expect(currencyOrder.order).to.eq(10);
      expect(currencyOrder).to.have.property("_id");

      // Edit Order for currency
      cy.request({
        url: `${mainURL.stage}api/v1/currencyOrder`,
        method: "PUT",
        body: {
          _id: currencyOrder._id,
          name: randomNewString,
          order: 9,
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let currencyOrder = response.body.currencyOrder;
        expect(response.status).to.eq(200);
        expect(currencyOrder.order).to.eq(9);

        // Remove Order for currency
        cy.request({
          url: `${mainURL.stage}api/v1/currencyOrder`,
          method: "DELETE",
          body: {
            id: currencyOrder._id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Exchange Order
  ExchangeOrder(access_token) {
    // Create Order for exchange
    cy.request({
      url: `${mainURL.stage}api/v1/exchangeOrder`,
      method: "POST",
      body: {
        name: "ByBit",
        order: 7,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let exchangeOrder = response.body.exchangeOrder;
      expect(response.status).to.eq(200);
      expect(exchangeOrder.name).to.eq("ByBit");
      expect(exchangeOrder.order).to.eq(7);
      expect(exchangeOrder).to.have.property("_id");

      // Edit Order for exchange
      cy.request({
        url: `${mainURL.stage}api/v1/exchangeOrder`,
        method: "PUT",
        body: {
          _id: exchangeOrder._id,
          name: "ByBit",
          order: 10,
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let exchangeOrder = response.body.exchangeOrder;
        expect(response.status).to.eq(200);
        expect(exchangeOrder.name).to.eq("ByBit");
        expect(exchangeOrder.order).to.eq(10);

        // Remove Order for exchange
        cy.request({
          url: `${mainURL.stage}api/v1/exchangeOrder`,
          method: "DELETE",
          body: {
            id: exchangeOrder._id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Snapshot (Currently there is no snapshots)
  SnapShot(access_token) {
    // Update response timeout for SnapShot APIs
    Cypress.config({ responseTimeout: 50000 });
    // Create Snapshot
    cy.request({
      url: `${mainURL.stage}api/v1/snapshot`,
      method: "POST",
      body: {
        date: "01/05/2022",
        time: "2:00",
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let accountsObj = response.body.data.accounts[0];
      let symbolObj =
        response.body.data.symbols[Object.keys(response.body.data.symbols)[0]];
      expect(accountsObj).to.have.property("email");
      expect(accountsObj).to.have.property("name");
      expect(accountsObj).to.have.property("uid");
      expect(accountsObj).to.have.property("id");
      expect(symbolObj).to.have.property("price");
    });

    // Create Snapshot days
    cy.request({
      url: `${mainURL.stage}api/v1/snapshot/days`,
      method: "POST",
      body: {
        day: "01/05/2022",
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      let time = response.body.data;
      let value = 0;
      for (let item in time) {
        // Check the existence of 2 hour gap values per day
        expect(value.toString() + ":00").to.eq(value.toString() + ":00");
        value += 2;
      }
    });
  }

  // Margin Group
  MarginGroup(access_token) {
    const randomNumToString = (Math.random() * 1e20).toString(36);
    const randomString = `${randomNumToString.slice(5)}`;
    // Create Margin Group
    cy.request({
      url: `${mainURL.stage}api/v1/marginGroup`,
      method: "POST",
      body: {
        name: randomString,
        currencies: [
          {
            currency: "BTC",
            discountUnhedged: 20,
            discountHedged: 25,
          },
        ],
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then((response) => {
      let marginGroup = response.body.marginGroup;
      expect(response.status).to.eq(200);
      expect(marginGroup.name).to.eq(randomString);
      expect(marginGroup).to.have.property("_id");
      expect(marginGroup.currencies[0].currency).to.eq("BTC");
      expect(marginGroup.currencies[0].discountUnhedged).to.eq(20);
      expect(marginGroup.currencies[0].discountHedged).to.eq(25);
      expect(marginGroup.currencies[0]).to.have.property("_id");

      // Edit Margin Group
      cy.request({
        url: `${mainURL.stage}api/v1/marginGroup`,
        method: "PUT",
        body: {
          _id: marginGroup._id,
          name: "Test Group changed",
          currencies: [
            {
              _id: marginGroup.currencies._id,
              currency: "BTC forked",
              discountUnhedged: 120,
              discountHedged: 125,
            },
          ],
        },
        headers: {
          Authorization: response.requestHeaders.Authorization,
        },
      }).then((response) => {
        let marginGroup = response.body.marginGroup;
        expect(response.status).to.eq(200);
        expect(marginGroup.name).to.eq("Test Group changed");
        expect(marginGroup.currencies[0].currency).to.eq("BTC forked");
        expect(marginGroup.currencies[0].discountUnhedged).to.eq(120);
        expect(marginGroup.currencies[0].discountHedged).to.eq(125);

        // Remove Margin Group
        cy.request({
          url: `${mainURL.stage}api/v1/marginGroup`,
          method: "DELETE",
          body: {
            id: marginGroup._id,
          },
          headers: {
            Authorization: response.requestHeaders.Authorization,
          },
        })
          .its("status")
          .should("be.ok");
      });
    });
  }

  // Subscribe
  Subscribe() {
    cy.request({
      url: `${mainURL.stage}subscribe/portfolio?uuid=a763eda1-a4d1-11ea-a830-0242ac130003`,
      method: "GET",
    }).then((response) => {
      expect(response.status).to.eq(200);
      let firstObj = response.body["a763eda1-a4d1-11ea-a830-0242ac130003"][0];
      expect(firstObj.api_key_uuid).to.eq(
        "a7590519-a4d1-11ea-a830-0242ac130003"
      );
      expect(firstObj.derivatives.aggregated).to.eq(null);
      expect(firstObj.derivatives.collateral).to.eq(null);
      expect(firstObj.derivatives.positions).to.eq(null);
      expect(firstObj.exchange_id).to.eq("binance");
      expect(firstObj.id).to.eq("42");
      expect(firstObj.name).to.eq("Binance Master");
      expect(firstObj.portfolio_id).to.eq("5");
      expect(firstObj.robofruit_alias).to.eq("bin1");
      expect(firstObj.transactions.length).to.eq(0);
    });
  }

  // Price (checked for spot, option, future, future-coin-m, perpetual, perpetual-usdt-m)
  Price() {
    let exchanges = [
      "bequant",
      "binance",
      "okex_v5",
      "hitbtc",
      "huobi",
      "kucoin",
      "bitfinex",
      "bittrex",
      "deribit",
      "ftx",
      "bitmex",
      "bybit",
      "kraken",
    ];
    let types = [
      "spot",
      "option",
      "future",
      "future-coin-m",
      "perpetual",
      "perpetual-usdt-m",
    ];

    for (let exchange of exchanges) {
      types.forEach((type) => {
        cy.request({
          url: `${mainURL.stage}price/symbols?exchanges=${exchange}&type=${type}`,
          method: "GET",
        }).then((response) => {
          expect(response.status).to.eq(200);
          if (response.body.length === 0) {
            // If no data in response throw a log message in Cypress
            cy.log(
              `No tickers for **${type}** type for **${exchange}** exchange`
            );
          } else {
            if (type === "spot") {
              // Spot type should have these properties
              expect(response.body[0]).to.have.property("base");
              expect(response.body[0]).to.have.property("quote");
            }
            // Other types can have base and quote props optionally
            expect(response.body[0].exchangeId).to.eq(exchange);
            expect(response.body[0].type).to.eq(type);
            expect(response.body[0]).to.have.property("price");
            expect(response.body[0]).to.have.property("ticker");
          }
        });
      });
    }
  }

  Instruments() {
    cy.request({
      url: `${mainURL.stage}oauth/metrics`,
      method: "GET",
    })
      .its("status")
      .should("be.ok");

    cy.request({
      url: `${mainURL.stage}subscribe/metrics`,
      method: "GET",
    })
      .its("status")
      .should("be.ok");

    cy.request({
      url: `${mainURL.stage}price/metrics`,
      method: "GET",
    })
      .its("status")
      .should("be.ok");
  }
}

export default RiskAPI;
