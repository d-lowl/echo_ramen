import Request from '../Request';
import Recipe from '../Recipe';
import Attribute from '../Attribute';

describe('Request', () => {
  // Constructor Tests
  describe('Constructor', () => {
    it('should create with provided attributes', () => {
      const attributes = {
        "richness": new Attribute("Richness", 5, -10, 10),
        "spiciness": new Attribute("Spiciness", 3, -10, 10),
        "sweetness": new Attribute("Sweetness", -2, -10, 10),
      };
      
      const request = new Request(attributes);
      
      expect(request.attributes).toEqual(attributes);
    });
  });

  // Factory Method Tests
  describe('Factory Methods', () => {
    it('createRandom() should generate random valid attributes', () => {
      const request = Request.createRandom();
      
      // Check that all attributes exist
      expect(request.attributes).toHaveProperty('richness');
      expect(request.attributes).toHaveProperty('spiciness');
      expect(request.attributes).toHaveProperty('sweetness');
      
      // Check that all values are within valid range
      expect(request.attributes['richness'].value).toBeGreaterThanOrEqual(-10);
      expect(request.attributes['richness'].value).toBeLessThanOrEqual(10);
      
      expect(request.attributes['spiciness'].value).toBeGreaterThanOrEqual(-10);
      expect(request.attributes['spiciness'].value).toBeLessThanOrEqual(10);
      
      expect(request.attributes['sweetness'].value).toBeGreaterThanOrEqual(-10);
      expect(request.attributes['sweetness'].value).toBeLessThanOrEqual(10);
    });

    it('create() should use provided values', () => {
      const request = Request.create(5, 3, -2);
      
      expect(request.attributes['richness'].value).toBe(5);
      expect(request.attributes['spiciness'].value).toBe(3);
      expect(request.attributes['sweetness'].value).toBe(-2);
    });
  });

  // Setter Tests
  describe('Attribute Setting', () => {
    it('setAttribute() should modify an existing attribute', () => {
      const request = Request.create(0, 0, 0);
      
      request.setAttribute('richness', 5);
      expect(request.attributes['richness'].value).toBe(5);
      
      request.setAttribute('spiciness', -3);
      expect(request.attributes['spiciness'].value).toBe(-3);
    });

    it('setAttribute() should respect attribute bounds', () => {
      const request = Request.create(0, 0, 0);
      
      request.setAttribute('richness', 15);
      expect(request.attributes['richness'].value).toBe(10);
      
      request.setAttribute('spiciness', -15);
      expect(request.attributes['spiciness'].value).toBe(-10);
    });

    it('setAttribute() should do nothing for non-existent attributes', () => {
      const request = Request.create(0, 0, 0);
      
      request.setAttribute('nonexistent', 5);
      
      // No error should be thrown, and existing attributes should remain unchanged
      expect(request.attributes['richness'].value).toBe(0);
      expect(request.attributes['spiciness'].value).toBe(0);
      expect(request.attributes['sweetness'].value).toBe(0);
    });
  });

  // Comparison Tests
  describe('Comparison Tests', () => {
    it('compareWithRecipe() should calculate match percentage correctly', () => {
      const request = Request.create(5, 3, -2);
      
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(5);
      recipe.attributes['spiciness'].setValue(3);
      recipe.attributes['sweetness'].setValue(-2);
      
      const result = request.compareWithRecipe(recipe);
      
      expect(result.matchPercentage).toBe(100);
      expect(result.details.richness.diff).toBe(0);
      expect(result.details.richness.match).toBe(100);
      
      expect(result.details.spiciness.diff).toBe(0);
      expect(result.details.spiciness.match).toBe(100);
      
      expect(result.details.sweetness.diff).toBe(0);
      expect(result.details.sweetness.match).toBe(100);
    });

    it('should handle partial match correctly', () => {
      const request = Request.create(5, 3, -2);
      
      const recipe = new Recipe();
      recipe.attributes['richness'].setValue(7);
      recipe.attributes['spiciness'].setValue(3);
      recipe.attributes['sweetness'].setValue(1);
      
      const result = request.compareWithRecipe(recipe);
      
      // Differencees: richness = 2, spiciness = 0, sweetness = 3, total = 5
      // Maximum possible difference = 60, so match = 100 - (5/60)*100 = 91.67%, rounded to 92%
      expect(result.matchPercentage).toBe(92);
      
      expect(result.details.richness.diff).toBe(2);
      expect(result.details.richness.match).toBe(90); // 100 - (2/20)*100
      
      expect(result.details.spiciness.diff).toBe(0);
      expect(result.details.spiciness.match).toBe(100);
      
      expect(result.details.sweetness.diff).toBe(3);
      expect(result.details.sweetness.match).toBe(85); // 100 - (3/20)*100
    });
  });

  // Utility Method Tests
  describe('Utility Methods', () => {
    it('serialize() should return correct object format', () => {
      const request = Request.create(5, 3, -2);
      
      const serialized = request.serialize();
      
      expect(serialized).toEqual({
        richness: 5,
        spiciness: 3,
        sweetness: -2
      });
    });

    it('getDescription() should generate readable descriptions', () => {
      // Test slight intensity (0-3)
      const slightRequest = Request.create(2, 1, -3);
      expect(slightRequest.getDescription()).toBe('slight Richness, slight Spiciness, slight Savory');
      
      // Test medium intensity (4-6)
      const mediumRequest = Request.create(5, 4, -5);
      expect(mediumRequest.getDescription()).toBe('medium Richness, medium Spiciness, medium Savory');
      
      // Test very intensity (7-10)
      const veryRequest = Request.create(8, 9, -10);
      expect(veryRequest.getDescription()).toBe('very Richness, very Spiciness, very Savory');
      
      // Test mixed intensities
      const mixedRequest = Request.create(2, 5, -8);
      expect(mixedRequest.getDescription()).toBe('slight Richness, medium Spiciness, very Savory');
    });
  });
}); 