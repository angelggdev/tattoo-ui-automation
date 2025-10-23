const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://tattoo-ui-three.vercel.app',
    env: {
      apiUrl: 'https://adicto-tattoo.onrender.com/api',
    },
  },
  responseTimeout: 1000000
});
