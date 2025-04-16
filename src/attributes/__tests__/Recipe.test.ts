import Recipe from '../Recipe';
import Ingredient from '../Ingredient';
import { BasicEffect, AmplifyEffect, BalanceEffect, NeutralizeEffect, SpecialEffect } from '../Effects';

describe('Recipe', () => {
  // Constructor Tests
  describe('Constructor', () => {
    it('should initialize with empty ingredients list', () => {
      const recipe = new Recipe();
      
      // We can't directly test private field ingredients, so we'll use a workaround
      // by adding an ingredient and checking effects
      const originalValues = {
        richness: recipe.attributes['richness'].value,
        spiciness: recipe.attributes['spiciness'].value,
        sweetness: recipe.attributes['sweetness'].value
      };
      
      recipe.addIngredient(new Ingredient('Test', [new BasicEffect('richness', 1)]));
      
      // If this increases by 1, it means the list was originally empty
      expect(recipe.attributes['richness'].value).toBe(originalValues.richness + 1);
    });

    it('should initialize with default attributes', () => {
      const recipe = new Recipe();
      
      expect(recipe.attributes['richness'].value).toBe(0);
      expect(recipe.attributes['richness'].min).toBe(-10);
      expect(recipe.attributes['richness'].max).toBe(10);
      
      expect(recipe.attributes['spiciness'].value).toBe(0);
      expect(recipe.attributes['spiciness'].min).toBe(-10);
      expect(recipe.attributes['spiciness'].max).toBe(10);
      
      expect(recipe.attributes['sweetness'].value).toBe(0);
      expect(recipe.attributes['sweetness'].min).toBe(-10);
      expect(recipe.attributes['sweetness'].max).toBe(10);
    });
  });

  // Ingredient Management Tests
  describe('Ingredient Management', () => {
    it('addIngredient() should add ingredient and apply its effects', () => {
      const recipe = new Recipe();
      const ingredient = new Ingredient('Rice', [
        new BasicEffect('richness', 2),
        new BasicEffect('sweetness', 1)
      ]);
      
      recipe.addIngredient(ingredient);
      
      expect(recipe.attributes['richness'].value).toBe(2);
      expect(recipe.attributes['sweetness'].value).toBe(1);
      expect(recipe.attributes['spiciness'].value).toBe(0);
    });

    it('resetAttributes() should set all attributes back to 0', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(5);
      recipe.attributes['spiciness'].setValue(3);
      recipe.attributes['sweetness'].setValue(-2);
      
      recipe.resetAttributes();
      
      expect(recipe.attributes['richness'].value).toBe(0);
      expect(recipe.attributes['spiciness'].value).toBe(0);
      expect(recipe.attributes['sweetness'].value).toBe(0);
    });
  });

  // Special Effect Handling Tests
  describe('Special Effect Handling', () => {
    it('registerSpecialEffect() should add effect to queue', () => {
      const recipe = new Recipe();
      const specialEffect = new AmplifyEffect();
      
      recipe.registerSpecialEffect(specialEffect);
      
      // Test that the effect works by applying a basic effect
      const testValue = 5;
      expect(recipe.applySpecialEffects(testValue)).toBe(testValue * 2);
    });

    it('applySpecialEffects() should correctly modify values', () => {
      const recipe = new Recipe();
      
      // Test with no special effects
      expect(recipe.applySpecialEffects(5)).toBe(5);
      
      // Add an AmplifyEffect
      const amplifyEffect = new AmplifyEffect();
      recipe.registerSpecialEffect(amplifyEffect);
      expect(recipe.applySpecialEffects(5)).toBe(10);
      
      // Add a NeutralizeEffect (should still be doubled because amplify comes first)
      const neutralizeEffect = new NeutralizeEffect();
      recipe.registerSpecialEffect(neutralizeEffect);
      expect(recipe.applySpecialEffects(-5)).toBe(0); // -5 * 2 = -10, but then neutralized to 0
    });

    it('clearSpecialEffects() should empty the queue', () => {
      const recipe = new Recipe();
      
      recipe.registerSpecialEffect(new AmplifyEffect());
      expect(recipe.applySpecialEffects(5)).toBe(10);
      
      recipe.clearSpecialEffects();
      expect(recipe.applySpecialEffects(5)).toBe(5);
    });
  });

  // Comparison Tests
  describe('Comparison Tests', () => {
    it('compareWithRequest() should calculate match percentage correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(5);
      recipe.attributes['spiciness'].setValue(3);
      recipe.attributes['sweetness'].setValue(-2);
      
      const customerRequest = {
        richness: 5,
        spiciness: 3,
        sweetness: -2
      };
      
      const result = recipe.compareWithRequest(customerRequest);
      expect(result.matchPercentage).toBe(100);
      
      // Check details
      expect(result.details.richness.diff).toBe(0);
      expect(result.details.richness.match).toBe(100);
      
      expect(result.details.spiciness.diff).toBe(0);
      expect(result.details.spiciness.match).toBe(100);
      
      expect(result.details.sweetness.diff).toBe(0);
      expect(result.details.sweetness.match).toBe(100);
    });

    it('should handle partial match correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(5);
      recipe.attributes['spiciness'].setValue(3);
      recipe.attributes['sweetness'].setValue(-2);
      
      const customerRequest = {
        richness: 7,
        spiciness: 3,
        sweetness: 1
      };
      
      const result = recipe.compareWithRequest(customerRequest);
      
      // Differencees: richness = 2, spiciness = 0, sweetness = 3, total = 5
      // Maximum possible difference = 60, so match = 100 - (5/60)*100 = 91.67%, rounded to 92%
      expect(result.matchPercentage).toBe(92);
      
      // Details checks
      expect(result.details.richness.diff).toBe(2);
      expect(result.details.richness.match).toBe(90); // 100 - (2/20)*100
      
      expect(result.details.spiciness.diff).toBe(0);
      expect(result.details.spiciness.match).toBe(100);
      
      expect(result.details.sweetness.diff).toBe(3);
      expect(result.details.sweetness.match).toBe(85); // 100 - (3/20)*100
    });

    it('should handle complete mismatch correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(10);
      recipe.attributes['spiciness'].setValue(10);
      recipe.attributes['sweetness'].setValue(10);
      
      const customerRequest = {
        richness: -10,
        spiciness: -10,
        sweetness: -10
      };
      
      const result = recipe.compareWithRequest(customerRequest);
      
      // Differences: richness = 20, spiciness = 20, sweetness = 20, total = 60
      // Maximum possible difference = 60, so match = 100 - (60/60)*100 = 0%
      expect(result.matchPercentage).toBe(0);
      
      // Details checks
      expect(result.details.richness.diff).toBe(20);
      expect(result.details.richness.match).toBe(0);
      
      expect(result.details.spiciness.diff).toBe(20);
      expect(result.details.spiciness.match).toBe(0);
      
      expect(result.details.sweetness.diff).toBe(20);
      expect(result.details.sweetness.match).toBe(0);
    });
  });
}); 