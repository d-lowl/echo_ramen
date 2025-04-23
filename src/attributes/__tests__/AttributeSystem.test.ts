import Recipe from '../Recipe';
import Ingredient from '../../ingredients/Ingredient';
import Request from '../Request';
import { BasicEffect, AmplifyEffect, BalanceEffect, NeutralizeEffect } from '../Effects';

describe('Attribute System Integration', () => {
  // Recipe and Ingredient Interaction
  describe('Recipe and Ingredient Interaction', () => {
    it('Recipe with multiple ingredients should calculate attributes correctly', () => {
      const recipe = new Recipe();
      
      const rice = new Ingredient('Rice', [
        new BasicEffect('Richness', 2),
        new BasicEffect('Sweetness', 1)
      ]);
      
      const pork = new Ingredient('Pork', [
        new BasicEffect('Richness', 3),
        new BasicEffect('Spiciness', -1)
      ]);
      
      const chili = new Ingredient('Chili', [
        new BasicEffect('Spiciness', 5)
      ]);
      
      recipe.addIngredient(rice);
      recipe.addIngredient(pork);
      recipe.addIngredient(chili);
      
      expect(recipe.attributes['Richness'].value).toBe(5);  // 2 + 3
      expect(recipe.attributes['Spiciness'].value).toBe(4); // -1 + 5
      expect(recipe.attributes['Sweetness'].value).toBe(1); // 1 + 0 + 0
    });
    
    it('should handle attribute bound constraints correctly', () => {
      const recipe = new Recipe();
      
      // Add ingredients that would push Richness over maximum
      const rich1 = new Ingredient('Rich Item 1', [new BasicEffect('Richness', 8)]);
      const rich2 = new Ingredient('Rich Item 2', [new BasicEffect('Richness', 8)]);
      
      recipe.addIngredient(rich1);
      recipe.addIngredient(rich2);
      
      expect(recipe.attributes['Richness'].value).toBe(10); // Capped at max value
      
      // Add ingredients that would push Spiciness below minimum
      recipe.resetAttributes();
      const mild1 = new Ingredient('Mild Item 1', [new BasicEffect('Spiciness', -8)]);
      const mild2 = new Ingredient('Mild Item 2', [new BasicEffect('Spiciness', -8)]);
      
      recipe.addIngredient(mild1);
      recipe.addIngredient(mild2);
      
      expect(recipe.attributes['Spiciness'].value).toBe(-10); // Capped at min value
    });
  });

  // Special Effects Chain
  describe('Special Effects Chain', () => {
    it('Multiple special effects should apply in the correct order', () => {
      const recipe = new Recipe();
      
      const amplifier = new Ingredient('Amplifier', [new AmplifyEffect()]);
      const neutralizer = new Ingredient('Neutralizer', [new NeutralizeEffect()]);
      const spicy = new Ingredient('Spicy', [new BasicEffect('Spiciness', -5)]);
      
      // Apply AmplifyEffect then Neutralize, then apply spicy with -5
      // Expected: AmplifyEffect doubles to -10, NeutralizeEffect changes to 0
      recipe.addIngredient(amplifier);
      recipe.addIngredient(neutralizer);
      recipe.addIngredient(spicy);
      
      // The spicy effect should be doubled then neutralized
      expect(recipe.attributes['Spiciness'].value).toBe(0);
      
      // Reset and try a different order
      recipe.resetAttributes();
      
      // Apply Neutralize then Amplify, then apply spicy with -5
      // Expected: NeutralizeEffect zeros out -5, AmplifyEffect has no effect on 0
      recipe.addIngredient(neutralizer);
      recipe.addIngredient(amplifier);
      recipe.addIngredient(spicy);
      
      // The spicy effect should be neutralized to 0, then doubled (still 0)
      expect(recipe.attributes['Spiciness'].value).toBe(0);
    });
    
    it('Special effects should be cleared after applying', () => {
      const recipe = new Recipe();
      
      const amplifier = new Ingredient('Amplifier', [new AmplifyEffect()]);
      const spicy1 = new Ingredient('Spicy1', [new BasicEffect('Spiciness', 3)]);
      const spicy2 = new Ingredient('Spicy2', [new BasicEffect('Spiciness', 2)]);
      
      // Apply AmplifyEffect then spicy1 with 3
      // Expected: spicy1 is doubled to 6
      recipe.addIngredient(amplifier);
      recipe.addIngredient(spicy1);
      
      // The spicy effect should be amplified
      expect(recipe.attributes['Spiciness'].value).toBe(6);
      
      // Add another spicy ingredient - should NOT be amplified
      recipe.addIngredient(spicy2);
      
      // The second effect should not be amplified, so total should be 6 + 2 = 8
      expect(recipe.attributes['Spiciness'].value).toBe(8);
    });
  });

  // Full Customer Request Scenario
  describe('Full Customer Request Scenario', () => {
    it('Test a full scenario with a customer request and recipe match', () => {
      // Create a customer request
      const request = Request.create(5, 3, -2);
      
      // Create a recipe with ingredients that approximately match the request
      const recipe = new Recipe();
      
      const ingredient1 = new Ingredient('Ingredient1', [
        new BasicEffect('Richness', 3),
        new BasicEffect('Spiciness', 2)
      ]);
      
      const ingredient2 = new Ingredient('Ingredient2', [
        new BasicEffect('Richness', 2),
        new BasicEffect('Spiciness', 1),
        new BasicEffect('Sweetness', -1)
      ]);
      
      const ingredient3 = new Ingredient('Ingredient3', [
        new BasicEffect('Sweetness', -1)
      ]);
      
      // Add ingredients to the recipe
      recipe.addIngredient(ingredient1);
      recipe.addIngredient(ingredient2);
      recipe.addIngredient(ingredient3);
      
      // Final recipe values should be:
      // Richness: 5 (3 + 2)
      // Spiciness: 3 (2 + 1)
      // Sweetness: -2 (-1 + -1)
      
      // Compare recipe with request
      const comparison = recipe.compareWithRequest(request);
      
      // Should be a perfect match
      expect(comparison.matchPercentage).toBe(100);
      
      // Check all attributes match exactly
      expect(recipe.attributes['Richness'].value).toBe(request.attributes['Richness'].value);
      expect(recipe.attributes['Spiciness'].value).toBe(request.attributes['Spiciness'].value);
      expect(recipe.attributes['Sweetness'].value).toBe(request.attributes['Sweetness'].value);
    });
    
    it('should handle partial matches correctly', () => {
      // Create a customer request
      const request = Request.create(7, 2, -3);
      
      // Create a recipe with ingredients that partially match the request
      const recipe = new Recipe();
      
      const ingredient1 = new Ingredient('Ingredient1', [
        new BasicEffect('Richness', 5),
        new BasicEffect('Spiciness', 1)
      ]);
      
      const ingredient2 = new Ingredient('Ingredient2', [
        new BasicEffect('Richness', 1),
        new BasicEffect('Spiciness', 0),
        new BasicEffect('Sweetness', -2)
      ]);
      
      // Add ingredients to the recipe
      recipe.addIngredient(ingredient1);
      recipe.addIngredient(ingredient2);
      
      // Final recipe values should be:
      // Richness: 6 (5 + 1) - Request was 7
      // Spiciness: 1 (1 + 0) - Request was 2
      // Sweetness: -2 (-2) - Request was -3
      
      // Compare recipe with request
      const comparison = recipe.compareWithRequest(request);
      
      // Not a perfect match, but close
      expect(comparison.matchPercentage).toBeLessThan(100);
      expect(comparison.matchPercentage).toBeGreaterThan(80); // Should be a good match
      
      // Check details
      expect(comparison.details.Richness.diff).toBe(1);  // Off by 1
      expect(comparison.details.Spiciness.diff).toBe(1); // Off by 1
      expect(comparison.details.Sweetness.diff).toBe(1); // Off by 1
    });
  });
}); 