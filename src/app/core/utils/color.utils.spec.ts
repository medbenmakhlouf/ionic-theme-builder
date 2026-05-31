import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  hexToRgbString,
  generateShade,
  generateTint,
  generateContrast,
  generateIonicColorVariables,
  generateSteppedColors,
} from './color.utils';

describe('color.utils', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#4c8dff')).toEqual({ r: 76, g: 141, b: 255 });
    });

    it('should handle hex without #', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('xyz')).toBeNull();
    });
  });

  describe('hexToRgbString', () => {
    it('should return comma-separated RGB string', () => {
      expect(hexToRgbString('#4c8dff')).toBe('76, 141, 255');
    });
  });

  describe('generateShade', () => {
    it('should generate a darker color (12% darker)', () => {
      const shade = generateShade('#4c8dff');
      expect(shade).toBe('#437ce0');
    });
  });

  describe('generateTint', () => {
    it('should generate a lighter color (10% toward white)', () => {
      const tint = generateTint('#4c8dff');
      expect(tint).toBe('#5e98ff');
    });
  });

  describe('generateContrast', () => {
    it('should return white for dark colors', () => {
      expect(generateContrast('#000000')).toBe('#ffffff');
      expect(generateContrast('#333333')).toBe('#ffffff');
    });

    it('should return black for light colors', () => {
      expect(generateContrast('#ffffff')).toBe('#000000');
      expect(generateContrast('#f2f2f2')).toBe('#000000');
    });
  });

  describe('generateIonicColorVariables', () => {
    it('should return all 6 Ionic color variables', () => {
      const vars = generateIonicColorVariables('primary', '#4c8dff');
      expect(vars['--ion-color-primary']).toBe('#4c8dff');
      expect(vars['--ion-color-primary-rgb']).toBe('76, 141, 255');
      expect(vars['--ion-color-primary-contrast']).toBe('#000000');
      expect(vars['--ion-color-primary-contrast-rgb']).toBeDefined();
      expect(vars['--ion-color-primary-shade']).toBeDefined();
      expect(vars['--ion-color-primary-tint']).toBeDefined();
    });
  });

  describe('generateSteppedColors', () => {
    it('should generate 19 stepped colors (50 to 950)', () => {
      const steps = generateSteppedColors('#ffffff', '#000000');
      expect(Object.keys(steps)).toHaveLength(19);
      expect(steps['50']).toBeDefined();
      expect(steps['500']).toBe('#808080');
      expect(steps['950']).toBeDefined();
    });

    it('should return empty object for invalid colors', () => {
      const steps = generateSteppedColors('invalid', '#000000');
      expect(Object.keys(steps)).toHaveLength(0);
    });

    it('step 500 should be midpoint between base and target', () => {
      const steps = generateSteppedColors('#000000', '#ffffff');
      expect(steps['500']).toBe('#808080');
    });
  });
});
