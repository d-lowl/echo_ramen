# TICKET-T001: Unit Testing for Attribute System

## Description
Create comprehensive unit tests for the attribute system classes to ensure they function correctly and maintain functionality as development continues. The tests should cover all classes in the `src/attributes/` directory and verify that they work both individually and in combination.

## Tasks
- Set up a testing framework and directory structure
- Create unit tests for each class in the attribute system
- Test key functionality and edge cases
- Create integration tests for interactions between components

## Test Strategy

### Testing Framework
- Use Jest as the testing framework
- Create a `__tests__` directory inside `src/attributes/` for test files
- Name test files with the pattern `[ClassName].test.ts`
- Use TypeScript for writing tests

### Tests by Component

#### Attribute Class (`Attribute.test.ts`)
- **Constructor Tests:**
  - Should create an attribute with default values
  - Should create an attribute with specified values
  - Should respect min/max bounds for initial values

- **Value Modification Tests:**
  - `addValue()` should correctly add positive and negative values
  - `addValue()` should respect min/max bounds
  - `setValue()` should set value directly and respect bounds

- **Display Methods Tests:**
  - `getOppositeName()` should return correct opposite names
  - `getDisplayName()` should return the appropriate name based on value sign
  - `getDisplayValue()` should return absolute value

#### Recipe Class (`Recipe.test.ts`)
- **Constructor Tests:**
  - Should initialize with empty ingredients list
  - Should initialize with default attributes

- **Ingredient Management Tests:**
  - `addIngredient()` should add ingredient and apply its effects
  - `removeIngredient()` should remove an ingredient and recalculate attributes
  - When ingredients with special effects are involved, calculations should be correct

- **Special Effect Handling Tests:**
  - `registerSpecialEffect()` should add effect to queue
  - `applySpecialEffects()` should correctly modify values
  - `clearSpecialEffects()` should empty the queue

- **Comparison Tests:**
  - `compareWithRequest()` should calculate match percentage correctly
  - Edge cases: perfect match, no match, partial match

#### Ingredient Class (`Ingredient.test.ts`)
- **Constructor Tests:**
  - Should create ingredient with name and effects
  - Should handle optional special effect parameter

- **Effect Application Tests:**
  - `applyEffects()` should apply all effects to a recipe
  - Should apply special effect if present

- **Getters Tests:**
  - `getName()`, `getEffects()`, and `getSpecialEffect()` should return correct values

#### Effects Classes (`Effects.test.ts`)
- **BasicEffect Tests:**
  - Should construct with attribute and value
  - `apply()` should modify the attribute by the correct amount
  - `display()` should return readable description

- **AmplifyEffect Tests:**
  - `applySpecial()` should double the value
  - Special effect should be properly registered when applied
  - `display()` should return readable description

- **BalanceEffect Tests:**
  - Should balance positive and negative values correctly
  - Should respect the amount parameter
  - `display()` should return readable description

- **NeutralizeEffect Tests:**
  - `applySpecial()` should neutralize negative values only
  - `display()` should return readable description

#### Request Class (`Request.test.ts`)
- **Constructor Tests:**
  - Should create with provided attributes

- **Factory Method Tests:**
  - `createRandom()` should generate random valid attributes
  - `create()` should use provided values

- **Comparison Tests:**
  - `compareWithRecipe()` should calculate match percentage correctly
  - Should handle edge cases (perfect match, no match)

- **Utility Method Tests:**
  - `serialize()` should return correct object format
  - `getDescription()` should generate readable descriptions

### Integration Tests (`AttributeSystem.test.ts`)
- **Recipe and Ingredient Interaction:**
  - Recipe with multiple ingredients should calculate attributes correctly

- **Special Effects Chain:**
  - Multiple special effects should apply in the correct order

- **Full Customer Request Scenario:**
  - Test a full scenario with a customer request and recipe match

### Edge Cases to Test
- Values at or beyond min/max boundaries
- Empty recipes
- Removing non-existent ingredients
- Special effects with no applicable attributes
- Zero-value effects

## Acceptance Criteria
- All tests pass consistently
- Test coverage of at least 90% for all attribute system classes
- Tests verify both normal operations and edge cases
- Documentation for how to run tests is provided

## Story Points
5 