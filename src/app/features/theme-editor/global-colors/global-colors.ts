import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import {
  GlobalThemeConfig,
  IONIC_COLOR_NAMES,
  IonicColorName,
} from '../../../core/models/theme.model';

@Component({
  selector: 'app-global-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Global Colors</h2>
        <button
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          (click)="themeService.resetColors()"
          aria-label="Reset all colors to defaults"
        >
          Reset
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4">
        @for (color of colorNames; track color) {
          <div class="flex items-center gap-3">
            <label
              [attr.for]="'color-' + color"
              class="flex-1 text-sm font-medium text-gray-700 capitalize"
            >
              {{ color }}
            </label>
            <div class="flex items-center gap-2">
              <input
                [id]="'color-' + color"
                type="color"
                [ngModel]="colors()[color]"
                (ngModelChange)="themeService.updateColor(color, $event)"
                class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                [attr.aria-label]="'Choose ' + color + ' color'"
              />
              <input
                type="text"
                [ngModel]="colors()[color]"
                (ngModelChange)="themeService.updateColor(color, $event)"
                class="w-24 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
                [attr.aria-label]="color + ' hex value'"
              />
            </div>
          </div>
        }
      </div>

      <hr class="border-gray-200" />

      <h3 class="text-md font-semibold text-gray-900">Global Settings</h3>
      <div class="grid grid-cols-1 gap-3">
        @for (prop of globalProperties; track prop.key) {
          <div class="flex items-center gap-3">
            <label
              [attr.for]="'global-' + prop.key"
              class="flex-1 text-sm font-medium text-gray-700"
            >
              {{ prop.label }}
            </label>
            <div class="flex items-center gap-2">
              @if (prop.type === 'color') {
                <input
                  [id]="'global-' + prop.key"
                  type="color"
                  [ngModel]="getGlobalValue(prop.key)"
                  (ngModelChange)="themeService.updateGlobalProperty(prop.key, $event)"
                  class="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                  [attr.aria-label]="'Choose ' + prop.label"
                />
                <input
                  type="text"
                  [ngModel]="getGlobalValue(prop.key)"
                  (ngModelChange)="themeService.updateGlobalProperty(prop.key, $event)"
                  class="w-22 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
                  [attr.aria-label]="prop.label + ' hex value'"
                />
              } @else {
                <input
                  [id]="'global-' + prop.key"
                  type="text"
                  [ngModel]="getGlobalValue(prop.key)"
                  (ngModelChange)="themeService.updateGlobalProperty(prop.key, $event)"
                  class="w-full text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
                  [attr.aria-label]="prop.label + ' value'"
                />
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class GlobalColorsComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly colorNames: IonicColorName[] = [...IONIC_COLOR_NAMES];
  protected readonly globalTheme = this.themeService.globalTheme;
  protected readonly colors = computed(
    () => this.themeService.globalTheme().colors
  );

  protected readonly globalProperties: {
    key: keyof Omit<GlobalThemeConfig, 'colors'>;
    label: string;
    type: 'color' | 'text';
  }[] = [
    { key: 'backgroundColor', label: 'Background', type: 'color' },
    { key: 'textColor', label: 'Text Color', type: 'color' },
    { key: 'toolbarBackground', label: 'Toolbar BG', type: 'color' },
    { key: 'toolbarColor', label: 'Toolbar Color', type: 'color' },
    { key: 'toolbarBorderColor', label: 'Toolbar Border', type: 'color' },
    { key: 'itemBackground', label: 'Item BG', type: 'color' },
    { key: 'itemBorderColor', label: 'Item Border', type: 'color' },
    { key: 'cardBackground', label: 'Card BG', type: 'color' },
    { key: 'tabBarBackground', label: 'Tab Bar BG', type: 'color' },
    { key: 'tabBarBorderColor', label: 'Tab Bar Border', type: 'color' },
    { key: 'tabBarColor', label: 'Tab Bar Color', type: 'color' },
    { key: 'tabBarColorSelected', label: 'Tab Selected', type: 'color' },
    { key: 'borderColor', label: 'Border Color', type: 'color' },
    { key: 'placeholderColor', label: 'Placeholder', type: 'color' },
    { key: 'fontFamily', label: 'Font Family', type: 'text' },
  ];

  protected getGlobalValue(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.globalTheme() as any)[key] as string;
  }
}
