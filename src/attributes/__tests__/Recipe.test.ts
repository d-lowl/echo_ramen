import Recipe from '../Recipe';
import Ingredient from '../../ingredients/Ingredient';
import { BasicEffect, AmplifyEffect, BalanceEffect, NeutralizeEffect, SpecialEffect } from '../Effects';
import Attribute from '../Attribute';
import Request from '../Request';

describe('Recipe', () => {
  // Constructor Tests
  describe('Constructor', () => {
    it('should initialize with empty ingredients list', () => {
      const recipe = new Recipe();
      
      // We can't directly test private field ingredients, so we'll use a workaround
      // by adding an ingredient and checking effects
      const originalValues = {
        Richness: recipe.attributes['Richness'].value,
        Spiciness: recipe.attributes['Spiciness'].value,
        Sweetness: recipe.attributes['Sweetness'].value
      };
      
      recipe.addIngredient(new Ingredient('Test', [new BasicEffect('Richness', 1)]));
      
      // If this increases by 1, it means the list was originally empty
      expect(recipe.attributes['Richness'].value).toBe(originalValues.Richness + 1);
    });

    it('should initialize with default attributes', () => {
      const recipe = new Recipe();
      
      expect(recipe.attributes['Richness'].value).toBe(0);
      expect(recipe.attributes['Richness'].min).toBe(-10);
      expect(recipe.attributes['Richness'].max).toBe(10);
      
      expect(recipe.attributes['Spiciness'].value).toBe(0);
      expect(recipe.attributes['Spiciness'].min).toBe(-10);
      expect(recipe.attributes['Spiciness'].max).toBe(10);
      
      expect(recipe.attributes['Sweetness'].value).toBe(0);
      expect(recipe.attributes['Sweetness'].min).toBe(-10);
      expect(recipe.attributes['Sweetness'].max).toBe(10);
    });
  });

  // Ingredient Management Tests
  describe('Ingredient Management', () => {
    it('addIngredient() should add ingredient and apply its effects', () => {
      const recipe = new Recipe();
      const ingredient = new Ingredient('Rice', [
        new BasicEffect('Richness', 2),
        new BasicEffect('Sweetness', 1)
      ]);
      
      recipe.addIngredient(ingredient);
      
      expect(recipe.attributes['Richness'].value).toBe(2);
      expect(recipe.attributes['Sweetness'].value).toBe(1);
      expect(recipe.attributes['Spiciness'].value).toBe(0);
    });

    it('resetAttributes() should set all attributes back to 0', () => {
      const recipe = new Recipe();
      recipe.attributes['Richness'].setValue(5);
      recipe.attributes['Spiciness'].setValue(3);
      recipe.attributes['Sweetness'].setValue(-2);
      
      recipe.resetAttributes();
      
      expect(recipe.attributes['Richness'].value).toBe(0);
      expect(recipe.attributes['Spiciness'].value).toBe(0);
      expect(recipe.attributes['Sweetness'].value).toBe(0);
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
      recipe.attributes['Richness'].setValue(5);
      recipe.attributes['Spiciness'].setValue(3);
      recipe.attributes['Sweetness'].setValue(-2);
      
      const customerRequest = new Request({
        "Richness": new Attribute("Richness", 5, -10, 10),
        "Spiciness": new Attribute("Spiciness", 3, -10, 10),
        "Sweetness": new Attribute("Sweetness", -2, -10, 10)
      });
      
      const result = recipe.compareWithRequest(customerRequest);
      expect(result.matchPercentage).toBe(100);
      
      // Check details
      expect(result.details.Richness.diff).toBe(0);
      expect(result.details.Richness.match).toBe(100);
      
      expect(result.details.Spiciness.diff).toBe(0);
      expect(result.details.Spiciness.match).toBe(100);
      
      expect(result.details.Sweetness.diff).toBe(0);
      expect(result.details.Sweetness.match).toBe(100);
    });

    it('should handle partial match correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['Richness'].setValue(5);
      recipe.attributes['Spiciness'].setValue(3);
      recipe.attributes['Sweetness'].setValue(-10);
      
      const customerRequest = new Request({
        "Richness": new Attribute("Richness", 7, -10, 10),
        "Spiciness": new Attribute("Spiciness", 3, -10, 10),
        "Sweetness": new Attribute("Sweetness", 1, -10, 10)
      });
      
      const result = recipe.compareWithRequest(customerRequest);
      
      // Differencees: richness = 2, spiciness = 0, sweetness = 3, total = 5
      // Maximum possible difference = 60, so match = 100 - (5/60)*100 = 91.67%, rounded to 92%
      expect(result.matchPercentage).toBe(63);
      
      // Details checks
      expect(result.details.Richness.diff).toBe(2);
      expect(Math.round(result.details.Richness.match)).toBe(88); // 100 - (2/17)*100
      
      expect(result.details.Spiciness.diff).toBe(0);
      expect(Math.round(result.details.Spiciness.match)).toBe(100);
      
      expect(result.details.Sweetness.diff).toBe(11);
      expect(Math.round(result.details.Sweetness.match)).toBe(0); // 
    });

    it('should handle complete mismatch correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['Richness'].setValue(10);
      recipe.attributes['Spiciness'].setValue(10);
      recipe.attributes['Sweetness'].setValue(10);
      
      const customerRequest = new Request({
        "Richness": new Attribute("Richness", -10, -10, 10),
        "Spiciness": new Attribute("Spiciness", -10, -10, 10),
        "Sweetness": new Attribute("Sweetness", -10, -10, 10)
      });
      
      const result = recipe.compareWithRequest(customerRequest);
      
      // Differences: richness = 20, spiciness = 20, sweetness = 20, total = 60
      // Maximum possible difference = 60, so match = 100 - (60/60)*100 = 0%
      expect(result.matchPercentage).toBe(0);
      
      // Details checks
      expect(result.details.Richness.diff).toBe(20);
      expect(result.details.Richness.match).toBe(0);
      
      expect(result.details.Spiciness.diff).toBe(20);
      expect(result.details.Spiciness.match).toBe(0);
      
      expect(result.details.Sweetness.diff).toBe(20);
      expect(result.details.Sweetness.match).toBe(0);
    });
  });
}); 