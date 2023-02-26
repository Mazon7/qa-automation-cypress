// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
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

///<reference types="Cypress"  />

import * as TEST_DATA from "../fixtures/test_data";

Cypress.Commands.add("GetAccessToken", () => {
  // Get client_id & client_secret
  cy.request({
    url: Cypress.env("stage_url") + "api/v2/login",
    method: "POST",
    body: {
      email: TEST_DATA.USER_DATA.MAIL,
      password: TEST_DATA.USER_DATA.PASSWORD,
    },
  });
});

import "cypress-waitfor";
