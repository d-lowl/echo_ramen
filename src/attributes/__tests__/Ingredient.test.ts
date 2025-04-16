import Ingredient from '../Ingredient';
import { BasicEffect, AmplifyEffect, SpecialEffect } from '../Effects';
import Recipe from '../Recipe';

describe('Ingredient', () => {
  // Constructor Tests
  describe('Constructor', () => {
    it('should create ingredient with name and effects', () => {
      const effects = [new BasicEffect('richness', 5)];
      const ingredient = new Ingredient('Rice', effects);
      
      expect(ingredient.getName()).toBe('Rice');
      expect(ingredient.getEffects()).toEqual(effects);
    });

    it('should handle empty effects array', () => {
      const ingredient = new Ingredient('Water', []);
      
      expect(ingredient.getName()).toBe('Water');
      expect(ingredient.getEffects()).toEqual([]);
    });
  });

  // Effect Application Tests
  describe('Effect Application', () => {
    it('applyEffects() should apply all effects to a recipe', () => {
      const recipe = new Recipe();
      const effects = [
        new BasicEffect('richness', 3),
        new BasicEffect('spiciness', 2),
        new BasicEffect('sweetness', -1)
      ];
      const ingredient = new Ingredient('Pork', effects);
      
      ingredient.applyEffects(recipe);
      
      expect(recipe.attributes['richness'].value).toBe(3);
      expect(recipe.attributes['spiciness'].value).toBe(2);
      expect(recipe.attributes['sweetness'].value).toBe(-1);
    });

    it('should apply special effect correctly', () => {
      const recipe = new Recipe();
      const effects = [
        new AmplifyEffect(),
        new BasicEffect('richness', 3)
      ];
      const ingredient = new Ingredient('Chili Oil', effects);
      
      // Mock the special effect methods
      recipe.registerSpecialEffect = jest.fn();
      recipe.clearSpecialEffects = jest.fn();
      
      ingredient.applyEffects(recipe);
      
      expect(recipe.registerSpecialEffect).toHaveBeenCalledTimes(1);
      expect(recipe.clearSpecialEffects).toHaveBeenCalledTimes(1);
    });

    it('should clear special effects after applying non-special effects', () => {
      const recipe = new Recipe();
      const effects = [
        new BasicEffect('richness', 3),
        new AmplifyEffect()
      ];
      const ingredient = new Ingredient('Garlic', effects);
      
      // Mock the special effect methods
      recipe.registerSpecialEffect = jest.fn();
      recipe.clearSpecialEffects = jest.fn();
      
      ingredient.applyEffects(recipe);
      
      expect(recipe.registerSpecialEffect).toHaveBeenCalledTimes(1);
      expect(recipe.clearSpecialEffects).toHaveBeenCalledTimes(1);
    });

    it('should clear special effects when all effects have been applied', () => {
      const recipe = new Recipe();
      const effects = [
        new BasicEffect('richness', 3)
      ];
      const ingredient = new Ingredient('Garlic', effects);
      
      // Mock the special effect methods
      recipe.clearSpecialEffects = jest.fn();
      
      ingredient.applyEffects(recipe);
      
      expect(recipe.clearSpecialEffects).toHaveBeenCalledTimes(1);
    });
  });

  // Getters Tests
  describe('Getters', () => {
    it('getName() should return the correct name', () => {
      const ingredient = new Ingredient('Noodles', []);
      expect(ingredient.getName()).toBe('Noodles');
    });

    it('getEffects() should return a copy of the effects array', () => {
      const effects = [new BasicEffect('richness', 5)];
      const ingredient = new Ingredient('Egg', effects);
      
      const returnedEffects = ingredient.getEffects();
      expect(returnedEffects).toEqual(effects);
      
      // Verify it's a copy by modifying the returned array
      returnedEffects.push(new BasicEffect('spiciness', 2));
      expect(ingredient.getEffects()).toEqual(effects);
    });
  });
}); 