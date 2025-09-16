// Jest setup file for backend tests
// This file is run before each test file

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Suppress console warnings and errors during tests to reduce noise
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.GEMINI_API_KEY = "test-api-key-for-tests";
