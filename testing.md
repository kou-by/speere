# Test Implementation Guide

## Basic Policy

Test code is an essential element for ensuring application quality.
This guideline explains the implementation methodology for test code.
We will use vitest.

## Test Naming Convention

Test names follow this format:

```
"When {situation}, performing {action} results in {outcome}"
```

Examples:

- "When a user is not logged in, accessing the my page redirects to the login screen"
- "When accessing the API with an invalid token, a 401 error is returned"

## Test Implementation Procedure

### 1. Test Case Design

1. Determine the test name according to the naming convention
2. Write the expected result (assertion) first
3. Request reviewers to confirm the expected result

### 2. Test Code Implementation

Test code is implemented using the "reverse-engineer from results" approach.
In this approach, we start with the expected result (assertion),
and from there deduce the necessary preparation (Arrange) and operations (Act).

#### Implementation Flow

1. **Define the result (Assert)**

   ```typescript
   expect(result.isSuccess()).toBe(true);
   expect(result.getValue()).toEqual({
     id: "user-1",
     name: "Test User",
   });
   ```

2. **Implement operations to obtain the result (Act)**

   ```typescript
   // Consider the operations needed to get the `result` expected in the assertion
   const result = await userService.create(userData);
   ```

3. **Implement preparation needed for operations (Arrange)**
   ```typescript
   // Prepare the data needed for the create operation
   const userData = {
     name: "Test User",
     email: "test@example.com",
   };
   ```

Completed test code:

```typescript
it("When creating with valid user data, the user is registered", () => {
  // Arrange: Prepare data needed for the operation
  const userData = {
    name: "Test User",
    email: "test@example.com",
  };

  // Act: Execute the operation being tested
  const result = await userService.create(userData);

  // Assert: Verify the expected results
  expect(result.isSuccess()).toBe(true);
  expect(result.getValue()).toEqual({
    id: "user-1",
    name: "Test User",
  });
});
```

### 3. Test Implementation Steps

1. Implement assertions (Assert) first

   - Clearly describe the expected results
   - Ask reviewers for confirmation
   - Identify required data structures from assertions

2. Execute and confirm test failure

   - Confirm that the test fails as intended before implementation
   - Ask reviewers to confirm the failure content

3. Implement test code
   - Implement Act (operation): Implement operations to get the results needed for assertions
   - Implement Arrange (preparation): Prepare data needed for operations
   - Add comments at the boundary of each step

## Code Quality Management

### Refactoring Criteria

Consider refactoring test code in the following cases:

1. Similar test setup is repeated 3 or more times
2. Test data preparation code exceeds 20 lines
3. Similar assertions are used in multiple tests

### Refactoring Proposal

When refactoring is deemed necessary:

1. Propose the need for refactoring to reviewers with specific reasons
2. Present refactoring plan
3. Implement refactoring after approval

## Review Criteria

The following points are checked during test code review:

1. Does the test name follow the naming convention?
2. Is the 3A pattern clearly separated?
3. Are the assertions appropriate?
4. Is the test preparation code minimized?
5. Does the test focus on a single functionality?

## Concrete Examples

### Good Example: Reverse-Engineering Approach

```typescript
describe("User Authentication", () => {
  it("When logging in with a valid token, user information is returned", () => {
    // Assert: First define the expected result
    const expectedUser = {
      id: 1,
      name: "Test User",
    };

    // Act: Identify operations needed to get the result
    const result = await auth.login(validToken);

    // Arrange: Implement preparation needed for the operation
    const validToken = "valid-token";

    // Final assertion
    expect(result).toEqual(expectedUser);
  });
});
```

### Example Needing Improvement

```typescript
describe("Authentication", () => {
  it("Login test", () => {
    // × Does not follow naming convention
    const token = "token";
    const result = auth.login(token); // × Not reverse-engineered from the result
    expect(result).toBeTruthy(); // × Assertion is ambiguous
  });
});
```
