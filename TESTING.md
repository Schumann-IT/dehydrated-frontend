# Testing Strategy for Dehydrated Frontend

## Overview

This document outlines the testing strategy for the Dehydrated Frontend application, a React Admin-based domain management system with certificate monitoring capabilities.

## Testing Framework Setup

We use **Vitest** as our testing framework with the following setup:

- **Vitest**: Fast unit testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **jsdom**: DOM environment for testing
- **@vitest/ui**: Visual test runner interface
- **@vitest/coverage-v8**: Code coverage reporting

## Test Structure

```
src/
├── __tests__/                    # Integration and main tests
│   ├── dataProvider.test.ts     # Data provider routing tests
│   └── integration.test.tsx     # End-to-end integration tests
├── pages/__tests__/             # Page component tests
│   └── Home.test.tsx           # Home page tests
├── resources/domains/utils/__tests__/  # Utility function tests
│   └── certificateUtils.test.ts # Certificate utility tests
└── test/
    └── setup.ts                 # Global test configuration
```

## What to Test (Priority Order)

### 1. **Utility Functions (High Priority)** ✅
**File**: `src/resources/domains/utils/certificateUtils.ts`

These functions contain critical business logic for certificate validation:

- **`checkCertificateValidity()`**: Tests certificate expiration logic
  - Valid certificates (current date within range)
  - Expired certificates (past expiration date)
  - Future certificates (not yet valid)
  - Certificates expiring soon (within 30 days)
  - Invalid date handling

- **`getOpenSSLStatus()`**: Tests OpenSSL certificate parsing
  - Error handling for invalid metadata
  - Certificate, chain, and fullchain validation
  - Multiple certificate type handling

- **`getNetScalerStatus()`**: Tests NetScaler certificate parsing
  - Dev and prod environment handling
  - Error status reporting
  - Date validation for different environments

- **`formatDate()`**: Tests date formatting
  - NetScaler GMT format parsing
  - ISO date format parsing
  - Invalid date handling

- **`getStatusColor()`**: Tests status color mapping
  - Valid status colors
  - Case-insensitive handling
  - Default fallback values

### 2. **Data Provider (High Priority)** ✅
**File**: `src/dataProvider.ts`

Tests the combined data provider routing logic:

- **Resource Routing**: Verify requests are routed to correct providers
- **Error Handling**: Test error cases for unknown resources
- **Method Support**: Test all CRUD operations (getList, getOne, create, update, delete, etc.)
- **MSAL Integration**: Test provider creation with and without MSAL instance

### 3. **React Components (Medium Priority)** ✅
**File**: `src/pages/home/Home.tsx`

Component rendering and interaction tests:

- **Home Component**: Test rendering, button interactions, and conditional MSAL logic
- **Domain List Component**: Test data display, grouping, and status rendering
- **Form Components**: Test validation and user interactions

### 4. **Integration Tests (Medium Priority)** ✅
**File**: `src/__tests__/integration.test.tsx`

End-to-end user flow tests:

- **Page Navigation**: Test routing between pages
- **Component Integration**: Test components work together
- **User Interactions**: Test button clicks and form submissions

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Scripts

- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode for development
- `npm run test:ui`: Open Vitest UI for visual test management
- `npm run test:coverage`: Generate coverage report

## Test Coverage Goals

### Current Coverage
- **Utility Functions**: ~95% (comprehensive business logic testing)
- **Data Provider**: ~90% (routing and error handling)
- **Components**: ~70% (rendering and basic interactions)
- **Integration**: ~60% (basic user flows)

### Target Coverage
- **Utility Functions**: 95%+ (critical business logic)
- **Data Provider**: 90%+ (core functionality)
- **Components**: 80%+ (user-facing features)
- **Integration**: 70%+ (key user flows)

## Testing Best Practices

### 1. **Test Structure**
```typescript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### 2. **Component Testing**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### 3. **Mocking Strategy**
- **External Dependencies**: Mock API calls and external services
- **React Admin Components**: Mock complex RA components for unit testing
- **MSAL**: Mock authentication for component testing
- **Theme**: Mock theme loading for consistent tests

## Future Testing Enhancements

### 1. **E2E Testing**
Consider adding Playwright or Cypress for:
- Complete user workflows
- Cross-browser testing
- Visual regression testing

### 2. **Performance Testing**
- Component render performance
- Bundle size monitoring
- Memory leak detection

### 3. **Accessibility Testing**
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation

### 4. **API Contract Testing**
- OpenAPI specification validation
- Response format verification
- Error handling consistency

## Common Test Patterns

### 1. **Certificate Status Testing**
```typescript
it('should handle expired certificates', () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const result = checkCertificateValidity(pastDate, pastDate);
  expect(result.status).toBe('expired');
});
```

### 2. **Component Rendering Testing**
```typescript
it('should render with correct props', () => {
  render(<DomainList data={mockData} />);
  expect(screen.getByText('example.com')).toBeInTheDocument();
});
```

### 3. **Error Handling Testing**
```typescript
it('should handle API errors gracefully', async () => {
  mockApi.mockRejectedValue(new Error('Network error'));
  render(<DomainList />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **Module Resolution**: Ensure `@` alias is properly configured in `vitest.config.ts`
2. **React Admin Mocks**: Complex RA components may need specific mocking strategies
3. **MSAL Integration**: Authentication state needs proper mocking for component tests
4. **Theme Loading**: Async theme loading requires proper test setup

### Debugging Tests

```bash
# Run specific test file
npm test certificateUtils.test.ts

# Run tests with verbose output
npm test -- --reporter=verbose

# Debug failing tests
npm test -- --reporter=verbose --run
```

## Conclusion

This testing strategy provides comprehensive coverage of critical business logic while maintaining a balance between thoroughness and maintainability. The focus on utility functions and data provider ensures that core functionality is well-tested, while component and integration tests verify the user experience.

Regular test maintenance and updates should be part of the development workflow to ensure tests remain relevant as the application evolves. 