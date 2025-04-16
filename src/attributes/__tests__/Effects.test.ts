import { BasicEffect, AmplifyEffect, BalanceEffect, NeutralizeEffect } from '../Effects';
import Recipe from '../Recipe';

describe('Effects', () => {
  // BasicEffect Tests
  describe('BasicEffect', () => {
    it('should construct with attribute and value', () => {
      const effect = new BasicEffect('richness', 5);
      expect(effect.attribute).toBe('richness');
      expect(effect.value).toBe(5);
    });

    it('apply() should modify the attribute by the correct amount', () => {
      const recipe = new Recipe();
      const effect = new BasicEffect('richness', 5);
      
      effect.apply(recipe);
      expect(recipe.attributes['richness'].value).toBe(5);
      
      const negativeEffect = new BasicEffect('richness', -3);
      negativeEffect.apply(recipe);
      expect(recipe.attributes['richness'].value).toBe(2);
    });

    it('display() should return readable description', () => {
      const positiveEffect = new BasicEffect('richness', 5);
      expect(positiveEffect.display()).toBe('Richness 5');
      
      const negativeEffect = new BasicEffect('richness', -5);
      expect(negativeEffect.display()).toBe('Lightness 5');
    });
  });

  // AmplifyEffect Tests
  describe('AmplifyEffect', () => {
    it('applySpecial() should double the value', () => {
      const effect = new AmplifyEffect();
      expect(effect.applySpecial(5)).toBe(10);
      expect(effect.applySpecial(-3)).toBe(-6);
      expect(effect.applySpecial(0)).toBe(0);
    });

    it('apply() should register the special effect', () => {
      const recipe = new Recipe();
      const amplifyEffect = new AmplifyEffect();
      
      // Mock the registerSpecialEffect method
      recipe.registerSpecialEffect = jest.fn();
      
      amplifyEffect.apply(recipe);
      
      expect(recipe.registerSpecialEffect).toHaveBeenCalledWith(amplifyEffect);
    });

    it('display() should return readable description', () => {
      const effect = new AmplifyEffect();
      expect(effect.display()).toBe('Amplify');
    });
  });

  // BalanceEffect Tests
  describe('BalanceEffect', () => {
    it('should balance positive values correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(5);
      
      const effect = new BalanceEffect('richness');
      effect.apply(recipe);
      
      expect(recipe.attributes['richness'].value).toBe(2); // Default amount is 3
    });

    it('should balance negative values correctly', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(-7);
      
      const effect = new BalanceEffect('richness');
      effect.apply(recipe);
      
      expect(recipe.attributes['richness'].value).toBe(-4); // Default amount is 3
    });

    it('should respect the amount parameter', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(8);
      
      const effect = new BalanceEffect('richness', 5);
      effect.apply(recipe);
      
      expect(recipe.attributes['richness'].value).toBe(3);
    });

    it('should not modify zero values', () => {
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(0);
      
      const effect = new BalanceEffect('richness');
      effect.apply(recipe);
      
      expect(recipe.attributes['richness'].value).toBe(0);
    });

    it('display() should return readable description', () => {
      const effect = new BalanceEffect('richness');
      expect(effect.display()).toBe('Balance');
    });
  });

  // NeutralizeEffect Tests
  describe('NeutralizeEffect', () => {
    it('applySpecial() should neutralize negative values only', () => {
      const effect = new NeutralizeEffect();
      
      expect(effect.applySpecial(5)).toBe(5);    // Positive value should not change
      expect(effect.applySpecial(-3)).toBe(0);   // Negative value should become 0
      expect(effect.applySpecial(0)).toBe(0);    // Zero should remain zero
    });

    it('display() should return readable description', () => {
      const effect = new NeutralizeEffect();
      expect(effect.display()).toBe('Neutralize');
    });
  });
}); 