import Attribute from '../Attribute';

describe('Attribute', () => {
  // Constructor Tests
  describe('Constructor', () => {
    it('should create an attribute with default values', () => {
      const attribute = new Attribute('Richness', 0, -10, 10);
      expect(attribute.name).toBe('Richness');
      expect(attribute.value).toBe(0);
      expect(attribute.min).toBe(-10);
      expect(attribute.max).toBe(10);
    });

    it('should create an attribute with specified values', () => {
      const attribute = new Attribute('Spiciness', 5, -10, 10);
      expect(attribute.name).toBe('Spiciness');
      expect(attribute.value).toBe(5);
      expect(attribute.min).toBe(-10);
      expect(attribute.max).toBe(10);
    });

  });

  // Value Modification Tests
  describe('Value Modification', () => {
    it('addValue() should correctly add positive and negative values', () => {
      const attribute = new Attribute('Richness', 0, -10, 10);
      
      attribute.addValue(5);
      expect(attribute.value).toBe(5);
      
      attribute.addValue(-3);
      expect(attribute.value).toBe(2);
    });

    it('addValue() should respect min/max bounds', () => {
      const attribute = new Attribute('Richness', 0, -10, 10);
      
      attribute.addValue(15);
      expect(attribute.value).toBe(10);
      
      attribute.addValue(-25);
      expect(attribute.value).toBe(-10);
    });

    it('setValue() should set value directly and respect bounds', () => {
      const attribute = new Attribute('Richness', 0, -10, 10);
      
      attribute.setValue(7);
      expect(attribute.value).toBe(7);
      
      attribute.setValue(-5);
      expect(attribute.value).toBe(-5);
      
      attribute.setValue(20);
      expect(attribute.value).toBe(10);
      
      attribute.setValue(-15);
      expect(attribute.value).toBe(-10);
    });
  });

  // Display Methods Tests
  describe('Display Methods', () => {
    it('getOppositeName() should return correct opposite names', () => {
      const richness = new Attribute('Richness', 0, -10, 10);
      const spiciness = new Attribute('Spiciness', 0, -10, 10);
      const sweetness = new Attribute('Sweetness', 0, -10, 10);
      const other = new Attribute('Other', 0, -10, 10);
      
      expect(richness.getOppositeName()).toBe('Lightness');
      expect(spiciness.getOppositeName()).toBe('Mildness');
      expect(sweetness.getOppositeName()).toBe('Savory');
      expect(other.getOppositeName()).toBe('Not Other');
    });

    it('getDisplayName() should return the appropriate name based on value sign', () => {
      const richness = new Attribute('Richness', 5, -10, 10);
      expect(richness.getDisplayName()).toBe('Richness');
      
      richness.setValue(-5);
      expect(richness.getDisplayName()).toBe('Lightness');
      
      richness.setValue(0);
      expect(richness.getDisplayName()).toBe('Richness');
    });

    it('getDisplayValue() should return absolute value', () => {
      const attribute = new Attribute('Richness', 5, -10, 10);
      expect(attribute.getDisplayValue()).toBe(5);
      
      attribute.setValue(-7);
      expect(attribute.getDisplayValue()).toBe(7);
      
      attribute.setValue(0);
      expect(attribute.getDisplayValue()).toBe(0);
    });
  });
}); 