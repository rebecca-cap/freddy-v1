const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'os1sht',
  reporter: 'cypress-multi-reporters',
  viewportWidth: 1440,
  viewportHeight: 900,
  reporterOptions: {
    configFile: 'reporter-config.json',
    toConsole: true,
  },
  e2e: {
    baseUrl: 'http://localhost:3000/',
    component: {
      devServer: {
        framework: 'react',
        bundler: 'vite',
      },
    },
  },
  env: {
    EXTERNAL_API: 'https://gravitate-core-test-api.gravitatedev.fay.cap/api',
    login_url: '/login',
    products_url: '/products',
  },
})
