module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "*.js",
    "!node_modules/**",
    "!coverage/**",
    "!jest.config.js",
  ],
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.test.js"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
