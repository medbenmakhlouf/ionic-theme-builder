import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import {
  GlobalThemeConfig,
  IONIC_COLOR_NAMES,
  IonicColorName,
} from '../../../core/models/theme.model';

@Component({
  selector: 'app-global-colors',
  imports: [FormsModule],
  template: `
    <section class="space-y-5">
      <!-- Section header -->
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900">Theme Colors</h2>
        <button
          type="button"
          class="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          (click)="themeService.resetColors()"
          aria-label="Reset all colors to defaults"
        >
          Reset All
        </button>
      </div>

      <!-- Color swatches -->
      <div class="space-y-1.5">
        @for (color of colorNames; track color) {
          <div
            class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <input
              [id]="'color-' + color"
              type="color"
              [ngModel]="colors()[color]"
              (ngModelChange)="themeService.updateColor(color, $event)"
              class="w-8 h-8 rounded-md border border-gray-200 cursor-pointer shadow-sm p-0"
              [attr.aria-label]="'Choose ' + color + ' color'"
            />
            <label
              [attr.for]="'color-' + color"
              class="flex-1 text-sm font-medium text-gray-700 capitalize cursor-pointer"
            >
              {{ color }}
            </label>
            <input
              type="text"
              [ngModel]="colors()[color]"
              (ngModelChange)="themeService.updateColor(color, $event)"
              class="w-[5.5rem] text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
              [attr.aria-label]="color + ' hex value'"
            />
          </div>
        }
      </div>

      <!-- Custom Colors -->
      <div class="border-t border-gray-100 pt-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-800">Custom Colors</h3>
          <button
            type="button"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-1"
            (click)="addColor()"
            aria-label="Add custom color"
          >
            <span class="text-sm leading-none">+</span> Add Color
          </button>
        </div>

        @if (themeService.customColors().length === 0) {
          <p class="text-xs text-gray-400 px-3">
            No custom colors added yet. Custom colors generate
            <code class="bg-gray-100 px-1 rounded">ion-color-*</code> utility classes.
          </p>
        }

        <div class="space-y-2">
          @for (custom of themeService.customColors(); track $index) {
            <div
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
            >
              <input
                type="color"
                [ngModel]="custom.value"
                (ngModelChange)="themeService.updateCustomColor($index, { value: $event })"
                class="w-7 h-7 rounded-md border border-gray-200 cursor-pointer shadow-sm p-0"
                [attr.aria-label]="'Custom color ' + custom.name + ' picker'"
              />
              <input
                type="text"
                [ngModel]="custom.name"
                (ngModelChange)="
                  themeService.updateCustomColor($index, { name: sanitizeName($event) })
                "
                placeholder="color-name"
                class="w-24 text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                [attr.aria-label]="'Custom color name'"
              />
              <input
                type="text"
                [ngModel]="custom.value"
                (ngModelChange)="themeService.updateCustomColor($index, { value: $event })"
                class="w-[5.5rem] text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                [attr.aria-label]="custom.name + ' hex value'"
              />
              <button
                type="button"
                class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-auto"
                (click)="themeService.removeCustomColor($index)"
                [attr.aria-label]="'Remove custom color ' + custom.name"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 pt-4">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">Global Properties</h3>
      </div>

      <!-- Global settings grouped -->
      <div class="space-y-1">
        @for (group of propertyGroups; track group.title) {
          <div class="mb-4">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 px-3">
              {{ group.title }}
            </p>
            @for (prop of group.items; track prop.key) {
              <div
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                @if (prop.type === 'color') {
                  <input
                    [id]="'global-' + prop.key"
                    type="color"
                    [ngModel]="getGlobalValue(prop.key)"
                    (ngModelChange)="themeService.updateGlobalProperty(prop.key, $event)"
                    class="w-7 h-7 rounded-md border border-gray-200 cursor-pointer shadow-sm p-0"
                    [attr.aria-label]="'Choose ' + prop.label"
                  />
                }
                <label
                  [attr.for]="'global-' + prop.key"
                  class="flex-1 text-sm text-gray-600 cursor-pointer"
                >
                  {{ prop.label }}
                </label>
                @if (prop.type === 'color') {
                  <input
                    type="text"
                    [ngModel]="getGlobalValue(prop.key)"
                    (ngModelChange)="themeService.updateGlobalProperty(prop.key, $event)"
                    class="w-[5.5rem] text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                    [attr.aria-label]="prop.label + ' hex value'"
                  />
                } @else {
                  <input
                    [id]="'global-' + prop.key"
                    type="text"
                    [ngModel]="getGlobalValue(prop.key)"
                    (ngModelChange)="themeService.updateGlobalProperty(prop.key, $event)"
                    class="w-40 text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                    [attr.aria-label]="prop.label + ' value'"
                  />
                }
              </div>
            }
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
  protected readonly colors = computed(() => this.themeService.globalTheme().colors);

  private colorCounter = signal(0);

  protected addColor(): void {
    const count = this.colorCounter();
    this.colorCounter.set(count + 1);
    const name = count === 0 ? 'custom' : `custom-${count + 1}`;
    this.themeService.addCustomColor(name, '#69bb7b');
  }

  protected sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  protected readonly propertyGroups: {
    title: string;
    items: {
      key: keyof Omit<GlobalThemeConfig, 'colors'>;
      label: string;
      type: 'color' | 'text';
    }[];
  }[] = [
    {
      title: 'Layout',
      items: [
        { key: 'backgroundColor', label: 'Background', type: 'color' },
        { key: 'textColor', label: 'Text Color', type: 'color' },
        { key: 'borderColor', label: 'Border', type: 'color' },
        { key: 'placeholderColor', label: 'Placeholder', type: 'color' },
        { key: 'fontFamily', label: 'Font Family', type: 'text' },
      ],
    },
    {
      title: 'Toolbar',
      items: [
        { key: 'toolbarBackground', label: 'Background', type: 'color' },
        { key: 'toolbarColor', label: 'Text', type: 'color' },
        { key: 'toolbarBorderColor', label: 'Border', type: 'color' },
      ],
    },
    {
      title: 'Items & Cards',
      items: [
        { key: 'itemBackground', label: 'Item BG', type: 'color' },
        { key: 'itemBorderColor', label: 'Item Border', type: 'color' },
        { key: 'cardBackground', label: 'Card BG', type: 'color' },
      ],
    },
    {
      title: 'Tab Bar',
      items: [
        { key: 'tabBarBackground', label: 'Background', type: 'color' },
        { key: 'tabBarBorderColor', label: 'Border', type: 'color' },
        { key: 'tabBarColor', label: 'Text', type: 'color' },
        { key: 'tabBarColorSelected', label: 'Selected', type: 'color' },
      ],
    },
  ];

  protected getGlobalValue(key: string): string {
    return (this.globalTheme() as unknown as Record<string, string>)[key];
  }
}
