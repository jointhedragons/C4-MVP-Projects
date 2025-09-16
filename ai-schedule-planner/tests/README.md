# Tests Directory

This directory contains all test files for the AI Schedule Planner MVP project.

## Test Structure

### Backend Tests (`backend/__tests__/`)

- **`rules.test.js`** - Unit tests for rule-based scheduling engine
  - Time conversion functions
  - Range overlap detection
  - Slot finding algorithms
  - Input validation
- **`gemini.test.js`** - Tests for Gemini AI integration
  - AI response parsing
  - Fallback mechanisms
  - Error handling
  - Response validation
- **`api.test.js`** - Integration tests for API endpoints
  - Health check endpoint
  - Scheduling endpoint
  - Error handling
  - Request/response validation

### Frontend Tests (`frontend/src/__tests__/`)

- **`App.test.jsx`** - Main application component tests
  - User interactions
  - State management
  - API integration
  - Error handling
- **`AvailabilityInput.test.jsx`** - JSON input component tests
  - Input validation
  - Error display
  - Example loading
- **`QueryInput.test.jsx`** - Natural language input tests
  - Input handling
  - Placeholder display
- **`ResultsDisplay.test.jsx`** - Results display component tests
  - Table rendering
  - AI enhancement indicators
  - Empty state handling
- **`api.test.js`** - Frontend API client tests
  - API calls
  - Error handling
  - Data validation

## Test Framework

- **Backend**: Jest + Supertest
- **Frontend**: Jest + React Testing Library + @testing-library/user-event
- **Coverage**: Jest coverage reports

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### All Tests

```bash
# From project root
cd backend && npm test && cd ../frontend && npm test
```

## Test Coverage

### Backend Coverage Targets

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Frontend Coverage

- Component rendering
- User interactions
- API integration
- Error scenarios

## Test Guidelines

### Writing Tests

- Write tests for all new features
- Test both happy path and error scenarios
- Use descriptive test names
- Keep tests independent and isolated
- Mock external dependencies

### Test Structure

- **Arrange**: Set up test data and mocks
- **Act**: Execute the function/component
- **Assert**: Verify the expected outcome

### Mocking Strategy

- **Backend**: Mock external APIs (Gemini)
- **Frontend**: Mock API calls and user interactions
- **Integration**: Use real components with mocked dependencies

## Test Data

### Backend Test Data

```javascript
// Example availability data for tests
const testAvailability = {
  Alice: [["09:00", "17:00"]],
  Bob: [["12:00", "20:00"]],
  Charlie: [
    ["08:00", "12:00"],
    ["14:00", "18:00"],
  ],
};

// Example AI response
const mockAIResponse = {
  slots: [
    {
      start: "12:00 UTC",
      end: "13:00 UTC",
      members: ["Alice", "Bob"],
    },
  ],
  explanation: "12:00 UTC works for all members.",
};
```

### Frontend Test Data

- Mock API responses
- Test user input scenarios
- Error state testing
- Loading state testing

## Continuous Integration

### Pre-commit Hooks

- Run tests before committing
- Check code coverage
- Lint code

### Pull Request Checks

- All tests must pass
- Coverage thresholds met
- No linting errors

### Test Reports

- Coverage reports generated
- Test results published
- Performance benchmarks

## Debugging Tests

### Backend Debugging

```bash
# Run specific test file
npm test -- rules.test.js

# Run with verbose output
npm test -- --verbose

# Run with coverage
npm test -- --coverage
```

### Frontend Debugging

```bash
# Run tests in watch mode
npm test

# Run specific test
npm test -- --testNamePattern="App Component"

# Debug mode
npm test -- --runInBand --detectOpenHandles
```

## Test Best Practices

### Backend Testing

- Test all API endpoints
- Mock external services
- Test error scenarios
- Validate input/output formats

### Frontend Testing

- Test user interactions
- Test component rendering
- Test state changes
- Test error handling

### Integration Testing

- Test complete workflows
- Test API integration
- Test error propagation
- Test fallback mechanisms

## Future Test Enhancements

### Planned Additions

- [ ] End-to-end tests with Playwright
- [ ] Performance testing
- [ ] Visual regression testing
- [ ] Accessibility testing
- [ ] Load testing for API endpoints

### Test Automation

- [ ] Automated test generation
- [ ] Test data factories
- [ ] Parallel test execution
- [ ] Test result reporting
