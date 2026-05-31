export interface IonicColor {
  name: string;
  value: string;
  rgb: string;
  contrast: string;
  contrastRgb: string;
  shade: string;
  tint: string;
}

export interface GlobalThemeConfig {
  colors: Record<string, string>;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  toolbarBackground: string;
  toolbarColor: string;
  toolbarBorderColor: string;
  itemBackground: string;
  itemBorderColor: string;
  cardBackground: string;
  backdropColor: string;
  backdropOpacity: string;
  overlayBackground: string;
  borderColor: string;
  tabBarBackground: string;
  tabBarBorderColor: string;
  tabBarColor: string;
  tabBarColorSelected: string;
  placeholderColor: string;
}

export interface DarkModeConfig {
  enabled: boolean;
  strategy: 'always' | 'system' | 'class';
  colors: Record<string, string>;
  backgroundColor: string;
  textColor: string;
  toolbarBackground: string;
  toolbarColor: string;
  toolbarBorderColor: string;
  itemBackground: string;
  itemBorderColor: string;
  cardBackground: string;
  borderColor: string;
  tabBarBackground: string;
  tabBarColor: string;
  tabBarColorSelected: string;
}

export interface ComponentThemeConfig {
  componentName: string;
  label: string;
  description: string;
  variables: ComponentVariable[];
  mode: IonicMode;
}

export interface ComponentVariable {
  name: string;
  label: string;
  value: string;
  type: 'color' | 'size' | 'font' | 'number' | 'text';
  defaultValue: string;
}

export interface CustomColor {
  name: string;
  value: string;
}

export type ThemeMode = 'light' | 'dark';
export type DarkModeStrategy = 'always' | 'system' | 'class';
export type IonicMode = 'all' | 'ios' | 'md';

export interface TailwindToken {
  label: string;
  value: string;
  description: string;
}

export const TAILWIND_RADIUS_TOKENS: TailwindToken[] = [
  { label: 'none', value: '0', description: '0' },
  { label: 'xs', value: 'var(--radius-xs)', description: '0.125rem (2px)' },
  { label: 'sm', value: 'var(--radius-sm)', description: '0.25rem (4px)' },
  { label: 'md', value: 'var(--radius-md)', description: '0.375rem (6px)' },
  { label: 'lg', value: 'var(--radius-lg)', description: '0.5rem (8px)' },
  { label: 'xl', value: 'var(--radius-xl)', description: '0.75rem (12px)' },
  { label: '2xl', value: 'var(--radius-2xl)', description: '1rem (16px)' },
  { label: '3xl', value: 'var(--radius-3xl)', description: '1.5rem (24px)' },
  { label: '4xl', value: 'var(--radius-4xl)', description: '2rem (32px)' },
  { label: 'full', value: 'calc(infinity * 1px)', description: 'Full round' },
];

export const TAILWIND_SPACING_TOKENS: TailwindToken[] = [
  { label: '0', value: 'var(--spacing-0)', description: '0' },
  { label: 'px', value: 'var(--spacing-px)', description: '1px' },
  { label: '0.5', value: 'var(--spacing-0_5)', description: '0.125rem (2px)' },
  { label: '1', value: 'var(--spacing-1)', description: '0.25rem (4px)' },
  { label: '1.5', value: 'var(--spacing-1_5)', description: '0.375rem (6px)' },
  { label: '2', value: 'var(--spacing-2)', description: '0.5rem (8px)' },
  { label: '2.5', value: 'var(--spacing-2_5)', description: '0.625rem (10px)' },
  { label: '3', value: 'var(--spacing-3)', description: '0.75rem (12px)' },
  { label: '4', value: 'var(--spacing-4)', description: '1rem (16px)' },
  { label: '5', value: 'var(--spacing-5)', description: '1.25rem (20px)' },
  { label: '6', value: 'var(--spacing-6)', description: '1.5rem (24px)' },
  { label: '8', value: 'var(--spacing-8)', description: '2rem (32px)' },
  { label: '10', value: 'var(--spacing-10)', description: '2.5rem (40px)' },
  { label: '12', value: 'var(--spacing-12)', description: '3rem (48px)' },
  { label: '14', value: 'var(--spacing-14)', description: '3.5rem (56px)' },
  { label: '16', value: 'var(--spacing-16)', description: '4rem (64px)' },
];

export const TAILWIND_SHADOW_TOKENS: TailwindToken[] = [
  { label: 'none', value: '0 0 #0000', description: 'No shadow' },
  { label: '2xs', value: 'var(--shadow-2xs)', description: '0 1px rgb(0 0 0 / 0.05)' },
  { label: 'xs', value: 'var(--shadow-xs)', description: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { label: 'sm', value: 'var(--shadow-sm)', description: '0 1px 3px ...' },
  { label: 'md', value: 'var(--shadow-md)', description: '0 4px 6px ...' },
  { label: 'lg', value: 'var(--shadow-lg)', description: '0 10px 15px ...' },
  { label: 'xl', value: 'var(--shadow-xl)', description: '0 20px 25px ...' },
  { label: '2xl', value: 'var(--shadow-2xl)', description: '0 25px 50px ...' },
];

/** Returns applicable Tailwind tokens for a CSS variable name, or null if none apply */
export function getTailwindTokens(variableName: string): TailwindToken[] | null {
  if (variableName.includes('border-radius')) return TAILWIND_RADIUS_TOKENS;
  if (
    variableName.includes('padding') ||
    variableName.includes('margin') ||
    variableName.includes('gap')
  ) return TAILWIND_SPACING_TOKENS;
  if (variableName.includes('box-shadow')) return TAILWIND_SHADOW_TOKENS;
  return null;
}

export const IONIC_COLOR_NAMES = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'dark',
  'medium',
  'light',
] as const;

export type IonicColorName = (typeof IONIC_COLOR_NAMES)[number];

export const DEFAULT_IONIC_COLORS: Record<IonicColorName, string> = {
  primary: '#4c8dff',
  secondary: '#5260ff',
  tertiary: '#6a64ff',
  success: '#2dd55b',
  warning: '#ffc409',
  danger: '#c5000f',
  dark: '#2f2f2f',
  medium: '#808080',
  light: '#f2f2f2',
};

export const DEFAULT_DARK_COLORS: Record<IonicColorName, string> = {
  primary: '#4c8dff',
  secondary: '#5260ff',
  tertiary: '#6a64ff',
  success: '#2dd55b',
  warning: '#ffc409',
  danger: '#cf3c4f',
  dark: '#f4f5f8',
  medium: '#989aa2',
  light: '#222428',
};

export const DEFAULT_GLOBAL_THEME: GlobalThemeConfig = {
  colors: { ...DEFAULT_IONIC_COLORS },
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif',
  toolbarBackground: '#ffffff',
  toolbarColor: '#000000',
  toolbarBorderColor: '#c8c7cc',
  itemBackground: '#ffffff',
  itemBorderColor: '#c8c7cc',
  cardBackground: '#ffffff',
  backdropColor: '#000000',
  backdropOpacity: '0.32',
  overlayBackground: '#ffffff',
  borderColor: '#c8c7cc',
  tabBarBackground: '#f8f8f8',
  tabBarBorderColor: '#c8c7cc',
  tabBarColor: '#8c8c8c',
  tabBarColorSelected: '#4c8dff',
  placeholderColor: '#999999',
};

export const DEFAULT_DARK_THEME: DarkModeConfig = {
  enabled: false,
  strategy: 'system',
  colors: { ...DEFAULT_DARK_COLORS },
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  toolbarBackground: '#1f1f1f',
  toolbarColor: '#ffffff',
  toolbarBorderColor: '#3a3a3a',
  itemBackground: '#1e1e1e',
  itemBorderColor: '#3a3a3a',
  cardBackground: '#2a2a2a',
  borderColor: '#3a3a3a',
  tabBarBackground: '#1f1f1f',
  tabBarColor: '#989aa2',
  tabBarColorSelected: '#4c8dff',
};

export const IONIC_COMPONENTS: ComponentThemeConfig[] = [
  {
    componentName: 'ion-button',
    label: 'Button',
    mode: 'all',
    description: 'Interactive button for actions',
    variables: [
      { name: '--border-radius', label: 'Border Radius', value: '10px', type: 'size', defaultValue: '10px' },
      { name: '--border-width', label: 'Border Width', value: '1px', type: 'size', defaultValue: '1px' },
      { name: '--padding-top', label: 'Padding Top', value: '10px', type: 'size', defaultValue: '10px' },
      { name: '--padding-bottom', label: 'Padding Bottom', value: '10px', type: 'size', defaultValue: '10px' },
      { name: '--padding-start', label: 'Padding Start', value: '12px', type: 'size', defaultValue: '12px' },
      { name: '--padding-end', label: 'Padding End', value: '12px', type: 'size', defaultValue: '12px' },
      { name: '--box-shadow', label: 'Box Shadow', value: 'none', type: 'text', defaultValue: 'none' },
    ],
  },
  {
    componentName: 'ion-card',
    label: 'Card',
    mode: 'all',
    description: 'Container for grouped content',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--border-radius', label: 'Border Radius', value: '8px', type: 'size', defaultValue: '8px' },
      { name: '--box-shadow', label: 'Box Shadow', value: '0 2px 8px rgba(0,0,0,0.08)', type: 'text', defaultValue: '0 2px 8px rgba(0,0,0,0.08)' },
    ],
  },
  {
    componentName: 'ion-toolbar',
    label: 'Toolbar',
    mode: 'all',
    description: 'Top/bottom app bar',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
      { name: '--border-width', label: 'Border Width', value: '0 0 0.55px 0', type: 'text', defaultValue: '0 0 0.55px 0' },
      { name: '--min-height', label: 'Min Height', value: '56px', type: 'size', defaultValue: '56px' },
      { name: '--padding-top', label: 'Padding Top', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--padding-bottom', label: 'Padding Bottom', value: '4px', type: 'size', defaultValue: '4px' },
    ],
  },
  {
    componentName: 'ion-input',
    label: 'Input',
    mode: 'all',
    description: 'Text input field',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--placeholder-color', label: 'Placeholder Color', value: '#999999', type: 'color', defaultValue: '#999999' },
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
      { name: '--padding-start', label: 'Padding Start', value: '16px', type: 'size', defaultValue: '16px' },
      { name: '--padding-end', label: 'Padding End', value: '16px', type: 'size', defaultValue: '16px' },
      { name: '--highlight-color-focused', label: 'Focus Highlight', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
    ],
  },
  {
    componentName: 'ion-textarea',
    label: 'Textarea',
    mode: 'all',
    description: 'Multi-line text input',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--placeholder-color', label: 'Placeholder Color', value: '#999999', type: 'color', defaultValue: '#999999' },
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
      { name: '--padding-start', label: 'Padding Start', value: '16px', type: 'size', defaultValue: '16px' },
      { name: '--padding-end', label: 'Padding End', value: '16px', type: 'size', defaultValue: '16px' },
    ],
  },
  {
    componentName: 'ion-item',
    label: 'Item',
    mode: 'all',
    description: 'List item container',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
      { name: '--border-width', label: 'Border Width', value: '0 0 0.55px 0', type: 'text', defaultValue: '0 0 0.55px 0' },
      { name: '--padding-start', label: 'Padding Start', value: '16px', type: 'size', defaultValue: '16px' },
      { name: '--min-height', label: 'Min Height', value: '48px', type: 'size', defaultValue: '48px' },
      { name: '--inner-padding-end', label: 'Inner Padding End', value: '16px', type: 'size', defaultValue: '16px' },
    ],
  },
  {
    componentName: 'ion-list',
    label: 'List',
    mode: 'all',
    description: 'Container for list items',
    variables: [
      { name: '--ion-item-background', label: 'Item Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--ion-item-border-color', label: 'Item Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
    ],
  },
  {
    componentName: 'ion-tab-bar',
    label: 'Tab Bar',
    mode: 'all',
    description: 'Bottom tab navigation bar',
    variables: [
      { name: '--background', label: 'Background', value: '#f8f8f8', type: 'color', defaultValue: '#f8f8f8' },
      { name: '--color', label: 'Text Color', value: '#8c8c8c', type: 'color', defaultValue: '#8c8c8c' },
      { name: '--color-selected', label: 'Selected Color', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--border', label: 'Border', value: '1px solid #c8c7cc', type: 'text', defaultValue: '1px solid #c8c7cc' },
    ],
  },
  {
    componentName: 'ion-toggle',
    label: 'Toggle',
    mode: 'all',
    description: 'On/off switch control',
    variables: [
      { name: '--track-background', label: 'Track Background', value: '#e0e0e0', type: 'color', defaultValue: '#e0e0e0' },
      { name: '--track-background-checked', label: 'Track BG (Checked)', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--handle-background', label: 'Handle Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--handle-background-checked', label: 'Handle BG (Checked)', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--handle-width', label: 'Handle Width', value: '26px', type: 'size', defaultValue: '26px' },
      { name: '--handle-height', label: 'Handle Height', value: '26px', type: 'size', defaultValue: '26px' },
    ],
  },
  {
    componentName: 'ion-checkbox',
    label: 'Checkbox',
    mode: 'all',
    description: 'Checkable form control',
    variables: [
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
      { name: '--border-color-checked', label: 'Border (Checked)', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--background-checked', label: 'BG (Checked)', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--checkmark-color', label: 'Checkmark Color', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--size', label: 'Size', value: '24px', type: 'size', defaultValue: '24px' },
    ],
  },
  {
    componentName: 'ion-radio',
    label: 'Radio',
    mode: 'all',
    description: 'Radio selection control',
    variables: [
      { name: '--border-radius', label: 'Border Radius', value: '50%', type: 'text', defaultValue: '50%' },
      { name: '--color', label: 'Color', value: '#999999', type: 'color', defaultValue: '#999999' },
      { name: '--color-checked', label: 'Color (Checked)', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
    ],
  },
  {
    componentName: 'ion-select',
    label: 'Select',
    mode: 'all',
    description: 'Dropdown selection control',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
      { name: '--padding-start', label: 'Padding Start', value: '16px', type: 'size', defaultValue: '16px' },
      { name: '--padding-end', label: 'Padding End', value: '16px', type: 'size', defaultValue: '16px' },
      { name: '--highlight-color-focused', label: 'Focus Highlight', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
    ],
  },
  {
    componentName: 'ion-chip',
    label: 'Chip',
    mode: 'all',
    description: 'Compact element for labels/tags',
    variables: [
      { name: '--background', label: 'Background', value: 'rgba(0,0,0,0.08)', type: 'text', defaultValue: 'rgba(0,0,0,0.08)' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--border-radius', label: 'Border Radius', value: '16px', type: 'size', defaultValue: '16px' },
    ],
  },
  {
    componentName: 'ion-badge',
    label: 'Badge',
    mode: 'all',
    description: 'Small status indicator',
    variables: [
      { name: '--background', label: 'Background', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--color', label: 'Text Color', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '10px', type: 'size', defaultValue: '10px' },
      { name: '--padding-top', label: 'Padding Top', value: '3px', type: 'size', defaultValue: '3px' },
      { name: '--padding-bottom', label: 'Padding Bottom', value: '3px', type: 'size', defaultValue: '3px' },
      { name: '--padding-start', label: 'Padding Start', value: '8px', type: 'size', defaultValue: '8px' },
      { name: '--padding-end', label: 'Padding End', value: '8px', type: 'size', defaultValue: '8px' },
    ],
  },
  {
    componentName: 'ion-alert',
    label: 'Alert',
    mode: 'all',
    description: 'Dialog for alerts and confirmations',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '13px', type: 'size', defaultValue: '13px' },
      { name: '--max-width', label: 'Max Width', value: '270px', type: 'size', defaultValue: '270px' },
      { name: '--min-width', label: 'Min Width', value: '250px', type: 'size', defaultValue: '250px' },
    ],
  },
  {
    componentName: 'ion-modal',
    label: 'Modal',
    mode: 'all',
    description: 'Full-screen or sheet dialog',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '12px', type: 'size', defaultValue: '12px' },
      { name: '--max-width', label: 'Max Width', value: '500px', type: 'size', defaultValue: '500px' },
      { name: '--max-height', label: 'Max Height', value: '90vh', type: 'size', defaultValue: '90vh' },
      { name: '--box-shadow', label: 'Box Shadow', value: '0 28px 48px rgba(0,0,0,0.4)', type: 'text', defaultValue: '0 28px 48px rgba(0,0,0,0.4)' },
    ],
  },
  {
    componentName: 'ion-popover',
    label: 'Popover',
    mode: 'all',
    description: 'Floating content overlay',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '8px', type: 'size', defaultValue: '8px' },
      { name: '--box-shadow', label: 'Box Shadow', value: '0 5px 20px rgba(0,0,0,0.15)', type: 'text', defaultValue: '0 5px 20px rgba(0,0,0,0.15)' },
      { name: '--min-width', label: 'Min Width', value: '200px', type: 'size', defaultValue: '200px' },
      { name: '--max-width', label: 'Max Width', value: '350px', type: 'size', defaultValue: '350px' },
    ],
  },
  {
    componentName: 'ion-toast',
    label: 'Toast',
    mode: 'all',
    description: 'Temporary notification message',
    variables: [
      { name: '--background', label: 'Background', value: '#333333', type: 'color', defaultValue: '#333333' },
      { name: '--color', label: 'Text Color', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--max-width', label: 'Max Width', value: '700px', type: 'size', defaultValue: '700px' },
      { name: '--button-color', label: 'Button Color', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
    ],
  },
  {
    componentName: 'ion-action-sheet',
    label: 'Action Sheet',
    mode: 'all',
    description: 'Bottom sheet with actions',
    variables: [
      { name: '--background', label: 'Background', value: '#f9f9f9', type: 'color', defaultValue: '#f9f9f9' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--button-background-selected', label: 'Button BG Selected', value: '#e0e0e0', type: 'color', defaultValue: '#e0e0e0' },
      { name: '--border-radius', label: 'Border Radius', value: '13px', type: 'size', defaultValue: '13px' },
    ],
  },
  {
    componentName: 'ion-fab',
    label: 'FAB',
    mode: 'all',
    description: 'Floating action button',
    variables: [
      { name: '--background', label: 'Background', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--color', label: 'Icon Color', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--border-radius', label: 'Border Radius', value: '50%', type: 'text', defaultValue: '50%' },
      { name: '--box-shadow', label: 'Box Shadow', value: '0 4px 16px rgba(0,0,0,0.12)', type: 'text', defaultValue: '0 4px 16px rgba(0,0,0,0.12)' },
    ],
  },
  {
    componentName: 'ion-segment',
    label: 'Segment',
    mode: 'all',
    description: 'Segmented tab control',
    variables: [
      { name: '--background', label: 'Background', value: 'rgba(0,0,0,0.065)', type: 'text', defaultValue: 'rgba(0,0,0,0.065)' },
      { name: '--border-radius', label: 'Border Radius', value: '8px', type: 'size', defaultValue: '8px' },
    ],
  },
  {
    componentName: 'ion-segment-button',
    label: 'Segment Button',
    mode: 'all',
    description: 'Button within a segment',
    variables: [
      { name: '--background-checked', label: 'BG (Checked)', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#666666', type: 'color', defaultValue: '#666666' },
      { name: '--color-checked', label: 'Color (Checked)', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--border-radius', label: 'Border Radius', value: '7px', type: 'size', defaultValue: '7px' },
      { name: '--indicator-color', label: 'Indicator Color', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
    ],
  },
  {
    componentName: 'ion-searchbar',
    label: 'Searchbar',
    mode: 'all',
    description: 'Search input with icon',
    variables: [
      { name: '--background', label: 'Background', value: '#f0f0f0', type: 'color', defaultValue: '#f0f0f0' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--placeholder-color', label: 'Placeholder Color', value: '#999999', type: 'color', defaultValue: '#999999' },
      { name: '--icon-color', label: 'Icon Color', value: '#999999', type: 'color', defaultValue: '#999999' },
      { name: '--border-radius', label: 'Border Radius', value: '8px', type: 'size', defaultValue: '8px' },
    ],
  },
  {
    componentName: 'ion-range',
    label: 'Range',
    mode: 'all',
    description: 'Slider/range input',
    variables: [
      { name: '--bar-background', label: 'Bar Background', value: '#e0e0e0', type: 'color', defaultValue: '#e0e0e0' },
      { name: '--bar-background-active', label: 'Bar BG Active', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--bar-height', label: 'Bar Height', value: '2px', type: 'size', defaultValue: '2px' },
      { name: '--bar-border-radius', label: 'Bar Border Radius', value: '2px', type: 'size', defaultValue: '2px' },
      { name: '--knob-background', label: 'Knob Background', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--knob-size', label: 'Knob Size', value: '28px', type: 'size', defaultValue: '28px' },
    ],
  },
  {
    componentName: 'ion-progress-bar',
    label: 'Progress Bar',
    mode: 'all',
    description: 'Horizontal progress indicator',
    variables: [
      { name: '--background', label: 'Track Background', value: '#e0e0e0', type: 'color', defaultValue: '#e0e0e0' },
      { name: '--progress-background', label: 'Progress Fill', value: '#4c8dff', type: 'color', defaultValue: '#4c8dff' },
      { name: '--border-radius', label: 'Border Radius', value: '0', type: 'size', defaultValue: '0' },
    ],
  },
  {
    componentName: 'ion-spinner',
    label: 'Spinner',
    mode: 'all',
    description: 'Loading spinner indicator',
    variables: [
      { name: '--color', label: 'Color', value: '#999999', type: 'color', defaultValue: '#999999' },
    ],
  },
  {
    componentName: 'ion-skeleton-text',
    label: 'Skeleton Text',
    mode: 'all',
    description: 'Loading placeholder',
    variables: [
      { name: '--background', label: 'Background', value: '#eeeeee', type: 'color', defaultValue: '#eeeeee' },
      { name: '--background-rgb', label: 'Background RGB', value: '238, 238, 238', type: 'text', defaultValue: '238, 238, 238' },
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
    ],
  },
  {
    componentName: 'ion-avatar',
    label: 'Avatar',
    mode: 'all',
    description: 'Circular image container',
    variables: [
      { name: '--border-radius', label: 'Border Radius', value: '50%', type: 'text', defaultValue: '50%' },
    ],
  },
  {
    componentName: 'ion-thumbnail',
    label: 'Thumbnail',
    mode: 'all',
    description: 'Small image preview',
    variables: [
      { name: '--border-radius', label: 'Border Radius', value: '4px', type: 'size', defaultValue: '4px' },
      { name: '--size', label: 'Size', value: '48px', type: 'size', defaultValue: '48px' },
    ],
  },
  {
    componentName: 'ion-accordion',
    label: 'Accordion',
    mode: 'all',
    description: 'Expandable content section',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--color', label: 'Text Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--border-color', label: 'Border Color', value: '#c8c7cc', type: 'color', defaultValue: '#c8c7cc' },
    ],
  },
  {
    componentName: 'ion-breadcrumb',
    label: 'Breadcrumb',
    mode: 'all',
    description: 'Navigation breadcrumb trail',
    variables: [
      { name: '--color', label: 'Text Color', value: '#666666', type: 'color', defaultValue: '#666666' },
      { name: '--color-active', label: 'Active Color', value: '#000000', type: 'color', defaultValue: '#000000' },
      { name: '--color-hover', label: 'Hover Color', value: '#000000', type: 'color', defaultValue: '#000000' },
    ],
  },
  {
    componentName: 'ion-datetime',
    label: 'Datetime',
    mode: 'all',
    description: 'Date and time picker',
    variables: [
      { name: '--background', label: 'Background', value: '#ffffff', type: 'color', defaultValue: '#ffffff' },
      { name: '--background-rgb', label: 'Background RGB', value: '255, 255, 255', type: 'text', defaultValue: '255, 255, 255' },
      { name: '--title-color', label: 'Title Color', value: '#000000', type: 'color', defaultValue: '#000000' },
    ],
  },
];
