import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { generateIonicColorVariables } from '../../core/utils/color.utils';
import { IONIC_COLOR_NAMES } from '../../core/models/theme.model';

@Component({
  selector: 'app-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './preview.html',
})
export class PreviewComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly platform = this.themeService.previewPlatform;

  // Overlay visibility signals
  protected readonly showAlert = signal(false);
  protected readonly showToast = signal(false);
  protected readonly showActionSheet = signal(false);
  protected readonly showModal = signal(false);
  protected readonly showPopover = signal(false);

  protected readonly alertButtons = [
    { text: 'Cancel', role: 'cancel' },
    { text: 'Delete', role: 'destructive' },
  ];

  protected readonly actionSheetButtons = [
    { text: 'Share', icon: 'share-outline' },
    { text: 'Copy Link', icon: 'link-outline' },
    { text: 'Delete', role: 'destructive', icon: 'trash-outline' },
    { text: 'Cancel', role: 'cancel', icon: 'close-outline' },
  ];

  /** Returns a map of component name → CSS variable overrides as a style object */
  protected readonly componentStyles = computed(() => {
    const components = this.themeService.componentThemes();
    const currentPlatform = this.platform();
    const map: Record<string, Record<string, string>> = {};

    for (const component of components) {
      const overrides = component.variables.filter((v) => v.value !== v.defaultValue);
      if (overrides.length === 0) continue;

      if (component.mode !== 'all' && component.mode !== currentPlatform) continue;

      const styles: Record<string, string> = {};
      for (const variable of overrides) {
        styles[variable.name] = variable.value;
      }
      map[component.componentName] = styles;
    }

    return map;
  });

  /**
   * Resolves the effective mode for each component.
   * If component mode is 'all', falls back to the current platform.
   * Otherwise uses the component's explicit mode.
   */
  protected readonly componentModes = computed(() => {
    const components = this.themeService.componentThemes();
    const currentPlatform = this.platform();
    const map: Record<string, 'ios' | 'md'> = {};

    for (const component of components) {
      map[component.componentName] = component.mode === 'all' ? currentPlatform : component.mode;
    }

    return map;
  });

  protected readonly previewStyles = computed(() => {
    const mode = this.themeService.mode();
    const theme = this.themeService.globalTheme();
    const dark = this.themeService.darkTheme();
    const isDark = mode === 'dark' && dark.enabled;
    const styles: string[] = [];

    const activeColors = isDark ? dark.colors : theme.colors;

    for (const name of IONIC_COLOR_NAMES) {
      const hex = activeColors[name];
      if (!hex) continue;
      const vars = generateIonicColorVariables(name, hex);
      for (const [varName, varValue] of Object.entries(vars)) {
        styles.push(`${varName}: ${varValue}`);
      }
    }

    const bg = isDark ? dark.backgroundColor : theme.backgroundColor;
    const text = isDark ? dark.textColor : theme.textColor;
    styles.push(`--ion-background-color: ${bg}`);
    styles.push(`--ion-text-color: ${text}`);
    styles.push(`background-color: ${bg}`);
    styles.push(`color: ${text}`);
    styles.push(`font-family: ${theme.fontFamily}`);
    styles.push(`--ion-font-family: ${theme.fontFamily}`);

    styles.push(
      `--ion-toolbar-background: ${isDark ? dark.toolbarBackground : theme.toolbarBackground}`,
    );
    styles.push(`--ion-toolbar-color: ${isDark ? dark.toolbarColor : theme.toolbarColor}`);
    styles.push(
      `--ion-toolbar-border-color: ${isDark ? dark.toolbarBorderColor : theme.toolbarBorderColor}`,
    );

    styles.push(`--ion-item-background: ${isDark ? dark.itemBackground : theme.itemBackground}`);
    styles.push(
      `--ion-item-border-color: ${isDark ? dark.itemBorderColor : theme.itemBorderColor}`,
    );

    styles.push(`--ion-card-background: ${isDark ? dark.cardBackground : theme.cardBackground}`);

    styles.push(
      `--ion-tab-bar-background: ${isDark ? dark.tabBarBackground : theme.tabBarBackground}`,
    );
    styles.push(`--ion-tab-bar-border-color: ${theme.tabBarBorderColor}`);
    styles.push(`--ion-tab-bar-color: ${isDark ? dark.tabBarColor : theme.tabBarColor}`);
    styles.push(
      `--ion-tab-bar-color-selected: ${isDark ? dark.tabBarColorSelected : theme.tabBarColorSelected}`,
    );

    styles.push(`--ion-border-color: ${isDark ? dark.borderColor : theme.borderColor}`);
    styles.push(`--ion-placeholder-color: ${theme.placeholderColor}`);
    styles.push(`--ion-backdrop-color: ${theme.backdropColor}`);
    styles.push(`--ion-backdrop-opacity: ${theme.backdropOpacity}`);

    return styles.join('; ');
  });
}
