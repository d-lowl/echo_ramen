# Attribute System Tests

This directory contains unit and integration tests for the attribute system. The tests ensure that all classes in the `src/attributes/` directory function correctly both individually and in combination.

## Test Structure

The tests are organized as follows:

- `Attribute.test.ts` - Tests for the Attribute class
- `Effects.test.ts` - Tests for all effect classes (BasicEffect, AmplifyEffect, etc.)
- `Ingredient.test.ts` - Tests for the Ingredient class
- `Recipe.test.ts` - Tests for the Recipe class
- `Request.test.ts` - Tests for the Request class
- `AttributeSystem.test.ts` - Integration tests for the entire attribute system

## Running Tests

To run all tests, use the following command from the project root:

```bash
npm test
```

To run tests in a specific file, use:

```bash
npm test -- src/attributes/__tests__/Attribute.test.ts
```

To run tests with the coverage report:

```bash
npm test -- --coverage
```

## Test Coverage

These tests aim to achieve at least 90% code coverage for all classes in the attribute system. The test coverage report can be viewed by running the tests with the `--coverage` flag.

## Edge Cases

The tests cover various edge cases, including:
- Values at or beyond min/max boundaries
- Empty recipes
- Special effects with different application orders
- Perfect match, partial match, and complete mismatch scenarios between recipes and requests 