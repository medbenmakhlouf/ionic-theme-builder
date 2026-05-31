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
  itemBackground: string;
  cardBackground: string;
}

export interface ComponentThemeConfig {
  componentName: string;
  label: string;
  variables: ComponentVariable[];
}

export interface ComponentVariable {
  name: string;
  label: string;
  value: string;
  type: 'color' | 'size' | 'font' | 'number' | 'text';
  defaultValue: string;
}

export type ThemeMode = 'light' | 'dark';

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

export const DEFAULT_GLOBAL_THEME: GlobalThemeConfig = {
  colors: { ...DEFAULT_IONIC_COLORS },
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif',
  toolbarBackground: '#ffffff',
  toolbarColor: '#000000',
  itemBackground: '#ffffff',
  cardBackground: '#ffffff',
};

export const IONIC_COMPONENTS: ComponentThemeConfig[] = [
  {
    componentName: 'ion-button',
    label: 'Button',
    variables: [
      {
        name: '--border-radius',
        label: 'Border Radius',
        value: '10px',
        type: 'size',
        defaultValue: '10px',
      },
      {
        name: '--padding-top',
        label: 'Padding Top',
        value: '10px',
        type: 'size',
        defaultValue: '10px',
      },
      {
        name: '--padding-bottom',
        label: 'Padding Bottom',
        value: '10px',
        type: 'size',
        defaultValue: '10px',
      },
      {
        name: '--padding-start',
        label: 'Padding Start',
        value: '12px',
        type: 'size',
        defaultValue: '12px',
      },
      {
        name: '--padding-end',
        label: 'Padding End',
        value: '12px',
        type: 'size',
        defaultValue: '12px',
      },
    ],
  },
  {
    componentName: 'ion-card',
    label: 'Card',
    variables: [
      {
        name: '--background',
        label: 'Background',
        value: '#ffffff',
        type: 'color',
        defaultValue: '#ffffff',
      },
      {
        name: '--color',
        label: 'Text Color',
        value: '#000000',
        type: 'color',
        defaultValue: '#000000',
      },
      {
        name: '--border-radius',
        label: 'Border Radius',
        value: '4px',
        type: 'size',
        defaultValue: '4px',
      },
    ],
  },
  {
    componentName: 'ion-toolbar',
    label: 'Toolbar',
    variables: [
      {
        name: '--background',
        label: 'Background',
        value: '#ffffff',
        type: 'color',
        defaultValue: '#ffffff',
      },
      {
        name: '--color',
        label: 'Text Color',
        value: '#000000',
        type: 'color',
        defaultValue: '#000000',
      },
      {
        name: '--border-color',
        label: 'Border Color',
        value: '#c8c7cc',
        type: 'color',
        defaultValue: '#c8c7cc',
      },
      {
        name: '--min-height',
        label: 'Min Height',
        value: '56px',
        type: 'size',
        defaultValue: '56px',
      },
      {
        name: '--padding-top',
        label: 'Padding Top',
        value: '4px',
        type: 'size',
        defaultValue: '4px',
      },
      {
        name: '--padding-bottom',
        label: 'Padding Bottom',
        value: '4px',
        type: 'size',
        defaultValue: '4px',
      },
    ],
  },
  {
    componentName: 'ion-input',
    label: 'Input',
    variables: [
      {
        name: '--background',
        label: 'Background',
        value: '#ffffff',
        type: 'color',
        defaultValue: '#ffffff',
      },
      {
        name: '--color',
        label: 'Text Color',
        value: '#000000',
        type: 'color',
        defaultValue: '#000000',
      },
      {
        name: '--placeholder-color',
        label: 'Placeholder Color',
        value: '#999999',
        type: 'color',
        defaultValue: '#999999',
      },
      {
        name: '--border-radius',
        label: 'Border Radius',
        value: '4px',
        type: 'size',
        defaultValue: '4px',
      },
      {
        name: '--padding-start',
        label: 'Padding Start',
        value: '16px',
        type: 'size',
        defaultValue: '16px',
      },
      {
        name: '--padding-end',
        label: 'Padding End',
        value: '16px',
        type: 'size',
        defaultValue: '16px',
      },
    ],
  },
  {
    componentName: 'ion-item',
    label: 'Item',
    variables: [
      {
        name: '--background',
        label: 'Background',
        value: '#ffffff',
        type: 'color',
        defaultValue: '#ffffff',
      },
      {
        name: '--color',
        label: 'Text Color',
        value: '#000000',
        type: 'color',
        defaultValue: '#000000',
      },
      {
        name: '--border-color',
        label: 'Border Color',
        value: '#c8c7cc',
        type: 'color',
        defaultValue: '#c8c7cc',
      },
      {
        name: '--padding-start',
        label: 'Padding Start',
        value: '16px',
        type: 'size',
        defaultValue: '16px',
      },
      {
        name: '--min-height',
        label: 'Min Height',
        value: '48px',
        type: 'size',
        defaultValue: '48px',
      },
    ],
  },
  {
    componentName: 'ion-tab-bar',
    label: 'Tab Bar',
    variables: [
      {
        name: '--background',
        label: 'Background',
        value: '#f8f8f8',
        type: 'color',
        defaultValue: '#f8f8f8',
      },
      {
        name: '--color',
        label: 'Text Color',
        value: '#8c8c8c',
        type: 'color',
        defaultValue: '#8c8c8c',
      },
      {
        name: '--color-selected',
        label: 'Selected Color',
        value: '#4c8dff',
        type: 'color',
        defaultValue: '#4c8dff',
      },
      {
        name: '--border',
        label: 'Border',
        value: '1px solid #c8c7cc',
        type: 'text',
        defaultValue: '1px solid #c8c7cc',
      },
    ],
  },
  {
    componentName: 'ion-toggle',
    label: 'Toggle',
    variables: [
      {
        name: '--track-background',
        label: 'Track Background',
        value: '#e0e0e0',
        type: 'color',
        defaultValue: '#e0e0e0',
      },
      {
        name: '--track-background-checked',
        label: 'Track Background (Checked)',
        value: '#4c8dff',
        type: 'color',
        defaultValue: '#4c8dff',
      },
      {
        name: '--handle-background',
        label: 'Handle Background',
        value: '#ffffff',
        type: 'color',
        defaultValue: '#ffffff',
      },
      {
        name: '--handle-background-checked',
        label: 'Handle Background (Checked)',
        value: '#ffffff',
        type: 'color',
        defaultValue: '#ffffff',
      },
    ],
  },
];
