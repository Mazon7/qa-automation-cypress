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

// Using soft-assert module
const Assertion = require("soft-assert");

// Command for soft assertions (if false, retutns an error)
Cypress.Commands.add("softTrue", (value, message) => {
  Assertion.softTrue(value, message);

  //   if (Assertion.jsonDiffArray.length) {
  //     Assertion.jsonDiffArray.forEach((diff) => {
  //       const log = Cypress.log({
  //         name: "Soft assertion error",
  //         displayName: "softAssert",
  //         message: diff.error.message,
  //       });
  //     });
  //   }
});

// Command for trigger all assertions (that previously called) --> should be used in the end of the test
Cypress.Commands.add("softAssertAll", () => Assertion.softAssertAll());
