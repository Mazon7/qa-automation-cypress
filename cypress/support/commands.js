// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { mainURL, loginInfo } from "../../constants";

// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Forgot Password API request
Cypress.Commands.add("forgotPasswordAPI", () => {
  cy.request({
    url: `${mainURL.stage}api/v1/forgot-password`,
    method: "POST",
    body: {
      email: loginInfo.login,
    },
  });
});

// SignIn API request command
Cypress.Commands.add("LogInAPI", () => {
  cy.request({
    url: `${mainURL.stage}api/v1/signin`,
    method: "POST",
    body: {
      email: loginInfo.login,
      password: loginInfo.pass,
    },
  });
});

// Get AccessToken API request command
Cypress.Commands.add("GetAccessToken", (url) => {
  // Get client_id & client_secret
  cy.request({
    url: `${url}oauth/credentials?client_id=test%40bequant.io`,
    method: "GET",
  }).then((response) => {
    // Generate access token with received credentials
    cy.request({
      method: "POST",
      url: `${url}oauth/token`,
      form: true,
      body: {
        client_id: response.body.client_id,
        client_secret: response.body.client_secret,
        scope: "all",
        domain: url,
        grant_type: "client_credentials",
      },
    });
  });
});
