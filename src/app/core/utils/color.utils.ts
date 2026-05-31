/**
 * Converts a hex color string to RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Converts RGB components to a hex color string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

/**
 * Returns the RGB string (e.g., "56, 128, 255") for a hex color.
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '0, 0, 0';
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

/**
 * Generates a shade (darker) variant of the given hex color.
 * Ionic uses 12% darker.
 */
export function generateShade(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(
    Math.round(rgb.r * 0.88),
    Math.round(rgb.g * 0.88),
    Math.round(rgb.b * 0.88)
  );
}

/**
 * Generates a tint (lighter) variant of the given hex color.
 * Ionic uses 10% lighter toward white.
 */
export function generateTint(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * 0.1),
    Math.round(rgb.g + (255 - rgb.g) * 0.1),
    Math.round(rgb.b + (255 - rgb.b) * 0.1)
  );
}

/**
 * Determines the appropriate contrast color (black or white) for text
 * based on the luminance of the background color.
 */
export function generateContrast(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  // W3C relative luminance formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generates the full set of Ionic color variables for a given color.
 */
export function generateIonicColorVariables(
  name: string,
  hex: string
): Record<string, string> {
  const contrast = generateContrast(hex);
  return {
    [`--ion-color-${name}`]: hex,
    [`--ion-color-${name}-rgb`]: hexToRgbString(hex),
    [`--ion-color-${name}-contrast`]: contrast,
    [`--ion-color-${name}-contrast-rgb`]: hexToRgbString(contrast),
    [`--ion-color-${name}-shade`]: generateShade(hex),
    [`--ion-color-${name}-tint`]: generateTint(hex),
  };
}

/**
 * Generates stepped colors by mixing a base color toward a target color.
 * Ionic uses steps from 50 to 950 in increments of 50.
 * Each step is a percentage mix toward the target.
 */
export function generateSteppedColors(
  base: string,
  target: string
): Record<string, string> {
  const baseRgb = hexToRgb(base);
  const targetRgb = hexToRgb(target);
  if (!baseRgb || !targetRgb) return {};

  const steps: Record<string, string> = {};
  for (let i = 50; i <= 950; i += 50) {
    const ratio = i / 1000;
    const r = Math.round(baseRgb.r + (targetRgb.r - baseRgb.r) * ratio);
    const g = Math.round(baseRgb.g + (targetRgb.g - baseRgb.g) * ratio);
    const b = Math.round(baseRgb.b + (targetRgb.b - baseRgb.b) * ratio);
    steps[i.toString()] = rgbToHex(r, g, b);
  }
  return steps;
}

