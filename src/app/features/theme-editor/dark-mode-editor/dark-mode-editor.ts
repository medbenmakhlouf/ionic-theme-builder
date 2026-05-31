import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import {
  DarkModeStrategy,
  IONIC_COLOR_NAMES,
  IonicColorName,
} from '../../../core/models/theme.model';

@Component({
  selector: 'app-dark-mode-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Dark Mode</h2>
        <button
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          (click)="themeService.resetDarkColors()"
          aria-label="Reset dark mode settings"
        >
          Reset
        </button>
      </div>

      <!-- Enable toggle -->
      <div class="flex items-center justify-between">
        <label for="dark-enabled" class="text-sm font-medium text-gray-700">
          Enable Dark Mode
        </label>
        <input
          id="dark-enabled"
          type="checkbox"
          [ngModel]="darkTheme().enabled"
          (ngModelChange)="themeService.toggleDarkMode($event)"
          class="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
          aria-label="Enable dark mode"
        />
      </div>

      @if (darkTheme().enabled) {
        <!-- Strategy -->
        <div class="space-y-2">
          <label for="dark-strategy" class="text-sm font-medium text-gray-700">
            Strategy
          </label>
          <select
            id="dark-strategy"
            [ngModel]="darkTheme().strategy"
            (ngModelChange)="themeService.updateDarkStrategy($event)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
            aria-label="Dark mode strategy"
          >
            <option value="system">System (prefers-color-scheme)</option>
            <option value="class">CSS Class (.ion-palette-dark)</option>
            <option value="always">Always</option>
          </select>
          <p class="text-xs text-gray-500">
            @switch (darkTheme().strategy) {
              @case ('system') {
                Applies based on OS/browser dark mode preference.
              }
              @case ('class') {
                Applies when .ion-palette-dark class is on html element.
              }
              @case ('always') {
                Overrides light theme entirely (replaces :root).
              }
            }
          </p>
        </div>

        <!-- Dark colors -->
        <h3 class="text-md font-semibold text-gray-800 pt-2">Dark Palette Colors</h3>
        <div class="grid grid-cols-1 gap-3">
          @for (color of colorNames; track color) {
            <div class="flex items-center gap-3">
              <label
                [attr.for]="'dark-color-' + color"
                class="flex-1 text-sm font-medium text-gray-700 capitalize"
              >
                {{ color }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  [id]="'dark-color-' + color"
                  type="color"
                  [ngModel]="darkColors()[color]"
                  (ngModelChange)="themeService.updateDarkColor(color, $event)"
                  class="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                  [attr.aria-label]="'Dark ' + color + ' color'"
                />
                <input
                  type="text"
                  [ngModel]="darkColors()[color]"
                  (ngModelChange)="themeService.updateDarkColor(color, $event)"
                  class="w-22 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
                  [attr.aria-label]="'Dark ' + color + ' hex value'"
                />
              </div>
            </div>
          }
        </div>

        <!-- Dark global settings -->
        <h3 class="text-md font-semibold text-gray-800 pt-2">Dark Global Settings</h3>
        <div class="grid grid-cols-1 gap-3">
          @for (prop of darkProperties; track prop.key) {
            <div class="flex items-center gap-3">
              <label
                [attr.for]="'dark-' + prop.key"
                class="flex-1 text-sm font-medium text-gray-700"
              >
                {{ prop.label }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  [id]="'dark-' + prop.key"
                  type="color"
                  [ngModel]="getDarkPropValue(prop.key)"
                  (ngModelChange)="themeService.updateDarkProperty(prop.key, $event)"
                  class="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                  [attr.aria-label]="'Dark ' + prop.label"
                />
                <input
                  type="text"
                  [ngModel]="getDarkPropValue(prop.key)"
                  (ngModelChange)="themeService.updateDarkProperty(prop.key, $event)"
                  class="w-22 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
                  [attr.aria-label]="'Dark ' + prop.label + ' hex value'"
                />
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class DarkModeEditorComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly darkTheme = this.themeService.darkTheme;
  protected readonly colorNames: IonicColorName[] = [...IONIC_COLOR_NAMES];
  protected readonly darkColors = computed(() => this.darkTheme().colors);

  protected readonly darkProperties: {
    key: keyof Omit<import('../../../core/models/theme.model').DarkModeConfig, 'colors' | 'enabled' | 'strategy'>;
    label: string;
  }[] = [
    { key: 'backgroundColor', label: 'Background' },
    { key: 'textColor', label: 'Text Color' },
    { key: 'toolbarBackground', label: 'Toolbar BG' },
    { key: 'toolbarColor', label: 'Toolbar Color' },
    { key: 'toolbarBorderColor', label: 'Toolbar Border' },
    { key: 'itemBackground', label: 'Item BG' },
    { key: 'itemBorderColor', label: 'Item Border' },
    { key: 'cardBackground', label: 'Card BG' },
    { key: 'borderColor', label: 'Border Color' },
    { key: 'tabBarBackground', label: 'Tab Bar BG' },
    { key: 'tabBarColor', label: 'Tab Bar Color' },
    { key: 'tabBarColorSelected', label: 'Tab Selected' },
  ];

  protected getDarkPropValue(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.darkTheme() as any)[key] as string;
  }
}
