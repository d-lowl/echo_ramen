# TICKET-003: Implement attribute system

## Description
Create the core attribute system for Ramen Balance Master that will track and calculate the three main attributes: Richness, Spiciness, and Sweetness. This system will be fundamental to the gameplay mechanics and will be used to evaluate how well a player's recipe matches customer requests.

## Tasks
- ✅ Create data structures to represent the three main attributes (Richness vs. Lightness, Spiciness vs. Mildness, Sweetness vs. Savory)
- ✅ Implement methods to update attribute values based on ingredients
- ✅ Implement attribute comparison system to evaluate match with customer requests

## Acceptance Criteria
- ✅ Attributes can be modified by adding/removing ingredients
- ✅ Attribute calculations correctly balance opposing values
- ✅ System accurately tracks current recipe attribute state
- ✅ Attribute values are bounded within meaningful ranges (from -10 to 10, Richness 10 to Lightness 10)
- ✅ Comparison logic correctly determines match percentage between recipe and customer request

## Implementation Details

### Data Structure
```javascript
// Attribute class structure
class Attribute {
    constructor(name, value = 0, min = -10, max = 10) {
        this.name = name;
        this.value = value;
        this.min = min;
        this.max = max;
    }
    
    // Methods for modifying and constraining values
}

// Recipe attributes structure
class RecipeAttributes {
    constructor() {
        this.richness = new Attribute('Richness');  // Positive = Rich, Negative = Light
        this.spiciness = new Attribute('Spiciness'); // Positive = Spicy, Negative = Mild
        this.sweetness = new Attribute('Sweetness'); // Positive = Sweet, Negative = Savory
    }
}

// Ingredient effect structure
class Ingredient {
    constructor(name, effects, specialEffect = null) {
        this.name = name;
        this.effects = effects; // { richness: number, spiciness: number, sweetness: number }
        this.specialEffect = specialEffect;
    }
}
```

### Calculation Rules
- When adding an ingredient, its attribute effects are added to the current recipe attributes
- When removing an ingredient, its attribute effects are subtracted from the recipe
- Attribute values should always be constrained between min and max values (-10 to 10)
- Special effects from ingredients may modify these calculations (see Special Effects section)

### Attribute Comparison
- Customer requests will specify desired values for each attribute
- Match percentage should be calculated as: 
  ```
  matchPercentage = 100 - (sum of absolute differences / maximum possible difference) * 100
  ```
- A perfect match (100%) occurs when all attributes exactly match the request
- The minimum acceptable match for basic satisfaction should be 70%

### Special Effects
Implement support for these basic special effects:
- Amplify: Doubles the effect of one attribute from the next ingredient added
- Balance: Brings one attribute closer to 0 by a certain amount
- Neutralize: Cancels out negative effects from the next ingredient

### Integration
- Create the AttributeManager class in the src/managers directory
- The manager should be initialized in the GameScene
- Implement event-based communication between the AttributeManager and the UI components
- Create visualization feedback when attributes change

## Status
COMPLETED - All functionality has been implemented in TypeScript:
- Created Attribute, Recipe, Ingredient, Effects, and Request classes
- Implemented special effects system with Amplify, Balance, and Neutralize effects
- Added comparison system to evaluate recipe match with customer requests
- Added display methods for UI integration

## Completion Date
Completed on: September 15, 2023

## Story Points
3 