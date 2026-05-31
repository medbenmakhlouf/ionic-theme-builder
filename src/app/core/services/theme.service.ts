import { computed, Injectable, signal } from '@angular/core';
import {
  ComponentThemeConfig,
  CustomColor,
  DarkModeConfig,
  DarkModeStrategy,
  DEFAULT_DARK_THEME,
  DEFAULT_GLOBAL_THEME,
  DEFAULT_IONIC_COLORS,
  GlobalThemeConfig,
  IONIC_COLOR_NAMES,
  IONIC_COMPONENTS,
  IonicColorName,
  IonicMode,
  ThemeMode,
  getTailwindTokens,
} from '../models/theme.model';
import { THEME_PRESETS } from '../models/theme-presets';
import {
  generateIonicColorVariables,
  generateSteppedColors,
  hexToRgbString,
} from '../utils/color.utils';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('light');
  readonly globalMode = signal<IonicMode>('all');
  readonly previewPlatform = signal<'ios' | 'md'>('ios');
  readonly useTailwind = signal(false);
  readonly activePreset = signal<string>('default');
  readonly globalTheme = signal<GlobalThemeConfig>({ ...DEFAULT_GLOBAL_THEME });
  readonly darkTheme = signal<DarkModeConfig>(structuredClone(DEFAULT_DARK_THEME));
  readonly componentThemes = signal<ComponentThemeConfig[]>(
    structuredClone(IONIC_COMPONENTS)
  );
  readonly customColors = signal<CustomColor[]>([]);

  readonly presets = THEME_PRESETS;
  readonly generatedCss = computed(() => this.buildCss());

  applyPreset(presetId: string): void {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    this.activePreset.set(presetId);
    this.globalTheme.set({ ...preset.light });
    this.darkTheme.set({
      enabled: true,
      strategy: 'system',
      ...structuredClone(preset.dark),
    });
    this.componentThemes.set(structuredClone(IONIC_COMPONENTS));
    this.customColors.set([]);
  }

  updateColor(name: IonicColorName, value: string): void {
    this.globalTheme.update((theme) => ({
      ...theme,
      colors: { ...theme.colors, [name]: value },
    }));
  }

  addCustomColor(name: string, value: string): void {
    this.customColors.update((colors) => [...colors, { name, value }]);
  }

  updateCustomColor(index: number, updates: Partial<CustomColor>): void {
    this.customColors.update((colors) =>
      colors.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  }

  removeCustomColor(index: number): void {
    this.customColors.update((colors) => colors.filter((_, i) => i !== index));
  }

  updateGlobalProperty(
    key: keyof Omit<GlobalThemeConfig, 'colors'>,
    value: string
  ): void {
    this.globalTheme.update((theme) => ({
      ...theme,
      [key]: value,
    }));
  }

  // Dark mode methods
  toggleDarkMode(enabled: boolean): void {
    this.darkTheme.update((t) => ({ ...t, enabled }));
  }

  updateDarkStrategy(strategy: DarkModeStrategy): void {
    this.darkTheme.update((t) => ({ ...t, strategy }));
  }

  updateDarkColor(name: IonicColorName, value: string): void {
    this.darkTheme.update((t) => ({
      ...t,
      colors: { ...t.colors, [name]: value },
    }));
  }

  updateDarkProperty(
    key: keyof Omit<DarkModeConfig, 'colors' | 'enabled' | 'strategy'>,
    value: string
  ): void {
    this.darkTheme.update((t) => ({ ...t, [key]: value }));
  }

  updateComponentVariable(
    componentName: string,
    variableName: string,
    value: string
  ): void {
    this.componentThemes.update((themes) =>
      themes.map((theme) => {
        if (theme.componentName !== componentName) return theme;
        return {
          ...theme,
          variables: theme.variables.map((v) =>
            v.name === variableName ? { ...v, value } : v
          ),
        };
      })
    );
  }

  resetColors(): void {
    this.globalTheme.set({ ...DEFAULT_GLOBAL_THEME });
  }

  resetDarkColors(): void {
    this.darkTheme.set(structuredClone(DEFAULT_DARK_THEME));
  }

  resetComponent(componentName: string): void {
    this.componentThemes.update((themes) =>
      themes.map((theme) => {
        if (theme.componentName !== componentName) return theme;
        const original = IONIC_COMPONENTS.find(
          (c) => c.componentName === componentName
        );
        return original ? structuredClone(original) : theme;
      })
    );
  }

  resetAll(): void {
    this.globalTheme.set({ ...DEFAULT_GLOBAL_THEME });
    this.darkTheme.set(structuredClone(DEFAULT_DARK_THEME));
    this.componentThemes.set(structuredClone(IONIC_COMPONENTS));
    this.globalMode.set('all');
  }

  setGlobalMode(mode: IonicMode): void {
    this.globalMode.set(mode);
  }

  updateComponentMode(componentName: string, mode: IonicMode): void {
    this.componentThemes.update((themes) =>
      themes.map((theme) =>
        theme.componentName === componentName ? { ...theme, mode } : theme
      )
    );
  }

  toggleTailwind(enabled: boolean): void {
    this.useTailwind.set(enabled);
    if (enabled) {
      this.convertAllToTailwind();
    } else {
      this.convertAllToRaw();
    }
  }

  private convertAllToTailwind(): void {
    this.componentThemes.update((themes) =>
      themes.map((theme) => ({
        ...theme,
        variables: theme.variables.map((v) => {
          const tokens = getTailwindTokens(v.name);
          if (!tokens) return v;
          const closest = this.findClosestToken(v.value, tokens);
          return closest ? { ...v, value: closest } : v;
        }),
      }))
    );
  }

  private convertAllToRaw(): void {
    // Revert to original default values
    const originals = IONIC_COMPONENTS;
    this.componentThemes.update((themes) =>
      themes.map((theme) => {
        const original = originals.find(
          (c) => c.componentName === theme.componentName
        );
        if (!original) return theme;
        return {
          ...theme,
          variables: theme.variables.map((v) => {
            const orig = original.variables.find((ov) => ov.name === v.name);
            // Only revert if current value is a var() token
            if (orig && v.value.startsWith('var(')) {
              return { ...v, value: orig.value };
            }
            return v;
          }),
        };
      })
    );
  }

  private findClosestToken(
    rawValue: string,
    tokens: { value: string; description: string }[]
  ): string | null {
    // If already a token, keep it
    if (rawValue.startsWith('var(') || rawValue === 'calc(infinity * 1px)') {
      return tokens.find((t) => t.value === rawValue)?.value ?? null;
    }

    // Special cases
    if (rawValue === 'none' || rawValue === '0 0 #0000') {
      const none = tokens.find(
        (t) => t.value === '0 0 #0000' || t.value === '0'
      );
      return none?.value ?? null;
    }

    // Parse numeric value in px
    const num = parseFloat(rawValue);
    if (isNaN(num)) return null;

    // Convert rem to px for comparison
    let px = num;
    if (rawValue.trim().endsWith('rem')) {
      px = num * 16;
    }

    // Find closest token by comparing description px values
    let bestMatch: string | null = null;
    let bestDiff = Infinity;

    for (const token of tokens) {
      const descPx = this.extractPxFromDescription(token.description);
      if (descPx === null) continue;
      const diff = Math.abs(px - descPx);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = token.value;
      }
    }

    return bestMatch;
  }

  private extractPxFromDescription(description: string): number | null {
    // Match patterns like "0.5rem (8px)" or "8px" or "0"
    const pxMatch = description.match(/\((\d+(?:\.\d+)?)px\)/);
    if (pxMatch) return parseFloat(pxMatch[1]);

    const directPx = description.match(/^(\d+(?:\.\d+)?)px$/);
    if (directPx) return parseFloat(directPx[1]);

    const remMatch = description.match(/^(\d+(?:\.\d+)?)rem/);
    if (remMatch) return parseFloat(remMatch[1]) * 16;

    if (description === '0') return 0;

    return null;
  }

  private buildCss(): string {
    const theme = this.globalTheme();
    const dark = this.darkTheme();
    const components = this.componentThemes();
    const mode = this.globalMode();
    const lines: string[] = [];

    lines.push('/**');
    lines.push(' * Ionic Theme - Generated by Ionic Theme Builder');
    lines.push(` * Generated on: ${new Date().toISOString().split('T')[0]}`);
    lines.push(` * Mode: ${mode === 'all' ? 'All platforms' : mode.toUpperCase()}`);
    lines.push(' */');
    lines.push('');

    // Root selector based on global mode
    const rootSelector = this.getRootSelector(mode);
    lines.push(`${rootSelector} {`);
    lines.push('  /* Ionic Color Variables */');

    for (const name of IONIC_COLOR_NAMES) {
      const hex = theme.colors[name] ?? DEFAULT_IONIC_COLORS[name];
      const vars = generateIonicColorVariables(name, hex);
      lines.push('');
      lines.push(`  /** ${name} **/`);
      for (const [varName, varValue] of Object.entries(vars)) {
        lines.push(`  ${varName}: ${varValue};`);
      }
    }

    // Custom colors
    const customs = this.customColors();
    if (customs.length > 0) {
      lines.push('');
      lines.push('  /* Custom Colors */');
      for (const custom of customs) {
        const vars = generateIonicColorVariables(custom.name, custom.value);
        lines.push('');
        lines.push(`  /** ${custom.name} **/`);
        for (const [varName, varValue] of Object.entries(vars)) {
          lines.push(`  ${varName}: ${varValue};`);
        }
      }
    }

    lines.push('');
    lines.push('  /* Application Colors */');
    lines.push(`  --ion-background-color: ${theme.backgroundColor};`);
    lines.push(`  --ion-background-color-rgb: ${hexToRgbString(theme.backgroundColor)};`);
    lines.push(`  --ion-text-color: ${theme.textColor};`);
    lines.push(`  --ion-text-color-rgb: ${hexToRgbString(theme.textColor)};`);
    lines.push(`  --ion-font-family: ${theme.fontFamily};`);
    lines.push('');
    lines.push('  /* Toolbar */');
    lines.push(`  --ion-toolbar-background: ${theme.toolbarBackground};`);
    lines.push(`  --ion-toolbar-color: ${theme.toolbarColor};`);
    lines.push(`  --ion-toolbar-border-color: ${theme.toolbarBorderColor};`);
    lines.push('');
    lines.push('  /* Items */');
    lines.push(`  --ion-item-background: ${theme.itemBackground};`);
    lines.push(`  --ion-item-border-color: ${theme.itemBorderColor};`);
    lines.push('');
    lines.push('  /* Cards */');
    lines.push(`  --ion-card-background: ${theme.cardBackground};`);
    lines.push('');
    lines.push('  /* Tab Bar */');
    lines.push(`  --ion-tab-bar-background: ${theme.tabBarBackground};`);
    lines.push(`  --ion-tab-bar-border-color: ${theme.tabBarBorderColor};`);
    lines.push(`  --ion-tab-bar-color: ${theme.tabBarColor};`);
    lines.push(`  --ion-tab-bar-color-selected: ${theme.tabBarColorSelected};`);
    lines.push('');
    lines.push('  /* Other */');
    lines.push(`  --ion-backdrop-color: ${theme.backdropColor};`);
    lines.push(`  --ion-backdrop-opacity: ${theme.backdropOpacity};`);
    lines.push(`  --ion-overlay-background-color: ${theme.overlayBackground};`);
    lines.push(`  --ion-border-color: ${theme.borderColor};`);
    lines.push(`  --ion-placeholder-color: ${theme.placeholderColor};`);

    // Stepped colors
    const bgSteps = generateSteppedColors(theme.backgroundColor, theme.textColor);
    const textSteps = generateSteppedColors(theme.textColor, theme.backgroundColor);
    lines.push('');
    lines.push('  /* Stepped Background Colors */');
    for (const [step, color] of Object.entries(bgSteps)) {
      lines.push(`  --ion-background-color-step-${step}: ${color};`);
    }
    lines.push('');
    lines.push('  /* Stepped Text Colors */');
    for (const [step, color] of Object.entries(textSteps)) {
      lines.push(`  --ion-text-color-step-${step}: ${color};`);
    }

    lines.push('}');

    // Dark mode
    if (dark.enabled) {
      lines.push('');
      lines.push('/* Dark Mode */');

      const darkSelector = this.getDarkSelector(dark.strategy, mode);
      const darkSelectorEnd = this.getDarkSelectorEnd(dark.strategy);

      lines.push(darkSelector);

      for (const name of IONIC_COLOR_NAMES) {
        const hex = dark.colors[name];
        if (!hex) continue;
        const vars = generateIonicColorVariables(name, hex);
        lines.push('');
        lines.push(`  /** ${name} **/`);
        for (const [varName, varValue] of Object.entries(vars)) {
          lines.push(`  ${varName}: ${varValue};`);
        }
      }

      lines.push('');
      lines.push('  /* Dark Application Colors */');
      lines.push(`  --ion-background-color: ${dark.backgroundColor};`);
      lines.push(`  --ion-background-color-rgb: ${hexToRgbString(dark.backgroundColor)};`);
      lines.push(`  --ion-text-color: ${dark.textColor};`);
      lines.push(`  --ion-text-color-rgb: ${hexToRgbString(dark.textColor)};`);
      lines.push('');
      lines.push(`  --ion-toolbar-background: ${dark.toolbarBackground};`);
      lines.push(`  --ion-toolbar-color: ${dark.toolbarColor};`);
      lines.push(`  --ion-toolbar-border-color: ${dark.toolbarBorderColor};`);
      lines.push(`  --ion-item-background: ${dark.itemBackground};`);
      lines.push(`  --ion-item-border-color: ${dark.itemBorderColor};`);
      lines.push(`  --ion-card-background: ${dark.cardBackground};`);
      lines.push(`  --ion-border-color: ${dark.borderColor};`);
      lines.push(`  --ion-tab-bar-background: ${dark.tabBarBackground};`);
      lines.push(`  --ion-tab-bar-color: ${dark.tabBarColor};`);
      lines.push(`  --ion-tab-bar-color-selected: ${dark.tabBarColorSelected};`);

      // Dark stepped colors
      const darkBgSteps = generateSteppedColors(dark.backgroundColor, dark.textColor);
      const darkTextSteps = generateSteppedColors(dark.textColor, dark.backgroundColor);
      lines.push('');
      lines.push('  /* Stepped Background Colors (Dark) */');
      for (const [step, color] of Object.entries(darkBgSteps)) {
        lines.push(`  --ion-background-color-step-${step}: ${color};`);
      }
      lines.push('');
      lines.push('  /* Stepped Text Colors (Dark) */');
      for (const [step, color] of Object.entries(darkTextSteps)) {
        lines.push(`  --ion-text-color-step-${step}: ${color};`);
      }

      lines.push(darkSelectorEnd);
    }

    // Per-component variables with mode support
    const componentsToOutput = components.filter((c) =>
      c.mode !== 'all' || c.variables.some((v) => v.value !== v.defaultValue)
    );

    if (componentsToOutput.length > 0) {
      lines.push('');
      lines.push('/* Component-Specific Overrides */');

      for (const component of componentsToOutput) {
        const overrides = component.variables.filter(
          (v) => v.value !== v.defaultValue
        );
        // If mode is non-default, always output the block (even with defaults)
        const variablesToOutput = component.mode !== 'all'
          ? component.variables
          : overrides;
        if (variablesToOutput.length === 0) continue;

        const selector = this.getComponentSelector(component.componentName, component.mode);
        lines.push('');
        lines.push(`${selector} {`);
        for (const variable of variablesToOutput) {
          lines.push(`  ${variable.name}: ${variable.value};`);
        }
        lines.push('}');
      }
    }

    // Custom color utility classes
    if (customs.length > 0) {
      lines.push('');
      lines.push('/* Custom Color Utility Classes */');
      for (const custom of customs) {
        lines.push('');
        lines.push(`.ion-color-${custom.name} {`);
        lines.push(`  --ion-color-base: var(--ion-color-${custom.name});`);
        lines.push(`  --ion-color-base-rgb: var(--ion-color-${custom.name}-rgb);`);
        lines.push(`  --ion-color-contrast: var(--ion-color-${custom.name}-contrast);`);
        lines.push(`  --ion-color-contrast-rgb: var(--ion-color-${custom.name}-contrast-rgb);`);
        lines.push(`  --ion-color-shade: var(--ion-color-${custom.name}-shade);`);
        lines.push(`  --ion-color-tint: var(--ion-color-${custom.name}-tint);`);
        lines.push('}');
      }
    }

    return lines.join('\n');
  }

  private getRootSelector(mode: IonicMode): string {
    switch (mode) {
      case 'all':
        return ':root';
      case 'ios':
        return ':root.ios';
      case 'md':
        return ':root.md';
    }
  }

  private getComponentSelector(componentName: string, mode: IonicMode): string {
    switch (mode) {
      case 'all':
        return componentName;
      case 'ios':
        return `${componentName}.ios`;
      case 'md':
        return `${componentName}.md`;
    }
  }

  private getDarkSelector(strategy: DarkModeStrategy, mode: IonicMode): string {
    const rootSelector = mode === 'all' ? ':root' : `:root.${mode}`;
    switch (strategy) {
      case 'always':
        return `${rootSelector} {`;
      case 'system':
        return `@media (prefers-color-scheme: dark) {\n  ${rootSelector} {`;
      case 'class':
        return `${rootSelector}.ion-palette-dark {`;
    }
  }

  private getDarkSelectorEnd(strategy: DarkModeStrategy): string {
    switch (strategy) {
      case 'always':
        return '}';
      case 'system':
        return '  }\n}';
      case 'class':
        return '}';
    }
  }
}
