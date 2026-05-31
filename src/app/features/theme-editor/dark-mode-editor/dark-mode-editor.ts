import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import {
  DarkModeConfig,
  IONIC_COLOR_NAMES,
  IonicColorName,
} from '../../../core/models/theme.model';

@Component({
  selector: 'app-dark-mode-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900">Dark Mode</h2>
        <button
          type="button"
          class="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          (click)="themeService.resetDarkColors()"
          aria-label="Reset dark mode settings"
        >
          Reset All
        </button>
      </div>

      <!-- Enable toggle -->
      <label
        for="dark-enabled"
        class="flex items-center justify-between px-3 py-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer"
      >
        <span class="text-sm font-medium text-gray-700">Enable Dark Mode</span>
        <div class="relative inline-flex items-center">
          <input
            id="dark-enabled"
            type="checkbox"
            [ngModel]="darkTheme().enabled"
            (ngModelChange)="themeService.toggleDarkMode($event)"
            class="sr-only peer"
            aria-label="Enable dark mode"
          />
          <div
            class="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-500 transition-colors"
          ></div>
          <div
            class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"
          ></div>
        </div>
      </label>

      @if (darkTheme().enabled) {
        <!-- Strategy -->
        <div class="space-y-2">
          <label
            for="dark-strategy"
            class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >
            Strategy
          </label>
          <select
            id="dark-strategy"
            [ngModel]="darkTheme().strategy"
            (ngModelChange)="themeService.updateDarkStrategy($event)"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all cursor-pointer"
            aria-label="Dark mode strategy"
          >
            <option value="system">System (prefers-color-scheme)</option>
            <option value="class">CSS Class (.ion-palette-dark)</option>
            <option value="always">Always Override</option>
          </select>
          <p class="text-xs text-gray-400 italic px-1">
            @switch (darkTheme().strategy) {
              @case ('system') {
                Uses OS/browser preference automatically.
              }
              @case ('class') {
                Activated via .ion-palette-dark class on html.
              }
              @case ('always') {
                Replaces light theme entirely.
              }
            }
          </p>
        </div>

        <!-- Dark palette colors -->
        <div class="border-t border-gray-100 pt-4">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 px-3">
            Dark Palette Colors
          </p>
          <div class="space-y-1">
            @for (color of colorNames; track color) {
              <div
                class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  [id]="'dark-color-' + color"
                  type="color"
                  [ngModel]="darkColors()[color]"
                  (ngModelChange)="themeService.updateDarkColor(color, $event)"
                  class="w-7 h-7 rounded-md border border-gray-200 cursor-pointer shadow-sm p-0"
                  [attr.aria-label]="'Dark ' + color + ' color'"
                />
                <label
                  [attr.for]="'dark-color-' + color"
                  class="flex-1 text-sm text-gray-600 capitalize cursor-pointer"
                >
                  {{ color }}
                </label>
                <input
                  type="text"
                  [ngModel]="darkColors()[color]"
                  (ngModelChange)="themeService.updateDarkColor(color, $event)"
                  class="w-[5.5rem] text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                  [attr.aria-label]="'Dark ' + color + ' hex value'"
                />
              </div>
            }
          </div>
        </div>

        <!-- Dark global settings -->
        <div class="border-t border-gray-100 pt-4">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 px-3">
            Dark Global Properties
          </p>
          <div class="space-y-1">
            @for (prop of darkProperties; track prop.key) {
              <div
                class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  [id]="'dark-' + prop.key"
                  type="color"
                  [ngModel]="getDarkPropValue(prop.key)"
                  (ngModelChange)="themeService.updateDarkProperty(prop.key, $event)"
                  class="w-7 h-7 rounded-md border border-gray-200 cursor-pointer shadow-sm p-0"
                  [attr.aria-label]="'Dark ' + prop.label"
                />
                <label
                  [attr.for]="'dark-' + prop.key"
                  class="flex-1 text-sm text-gray-600 cursor-pointer"
                >
                  {{ prop.label }}
                </label>
                <input
                  type="text"
                  [ngModel]="getDarkPropValue(prop.key)"
                  (ngModelChange)="themeService.updateDarkProperty(prop.key, $event)"
                  class="w-[5.5rem] text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                  [attr.aria-label]="'Dark ' + prop.label + ' hex value'"
                />
              </div>
            }
          </div>
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
    key: keyof Omit<DarkModeConfig, 'colors' | 'enabled' | 'strategy'>;
    label: string;
  }[] = [
    { key: 'backgroundColor', label: 'Background' },
    { key: 'textColor', label: 'Text Color' },
    { key: 'toolbarBackground', label: 'Toolbar BG' },
    { key: 'toolbarColor', label: 'Toolbar Text' },
    { key: 'toolbarBorderColor', label: 'Toolbar Border' },
    { key: 'itemBackground', label: 'Item BG' },
    { key: 'itemBorderColor', label: 'Item Border' },
    { key: 'cardBackground', label: 'Card BG' },
    { key: 'borderColor', label: 'Border' },
    { key: 'tabBarBackground', label: 'Tab Bar BG' },
    { key: 'tabBarColor', label: 'Tab Bar Text' },
    { key: 'tabBarColorSelected', label: 'Tab Bar Selected' },
  ];

  protected getDarkPropValue(key: string): string {
    return (this.darkTheme() as unknown as Record<string, string>)[key];
  }
}
