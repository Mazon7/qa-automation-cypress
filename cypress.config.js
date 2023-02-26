const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  projectId: "wjv1va",
  numTestsKeptInMemory: 0,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    env: {
      stage_url: process.env.STAGE,
    },
  },
});
