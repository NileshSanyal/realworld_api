/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage/unit',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  coverageReporters: ['json-summary', 'text', 'lcov', 'text-summary'],
  collectCoverageFrom: [
    '**/controllers/*.js',
    '**/error/*.js',
    '**/helpers/*.js',
    '**/middlewares/*.middleware.js',
    '**/services/*.js',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
      },
    ],
  ],
  testEnvironment: 'node',
  testMatch: ['**/*.test.{js,ts}'],
  transform: {},
  transformIgnorePatterns: ['[/\\\\\\\\]node_modules[/\\\\\\\\].+\\\\.(js|ts)$'],
};

module.exports = config;
