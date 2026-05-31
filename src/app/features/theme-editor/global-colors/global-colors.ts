import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import {
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
      <div class="grid grid-cols-1 gap-4">
        <div class="flex items-center gap-3">
          <label for="bg-color" class="flex-1 text-sm font-medium text-gray-700">
            Background
          </label>
          <div class="flex items-center gap-2">
            <input
              id="bg-color"
              type="color"
              [ngModel]="globalTheme().backgroundColor"
              (ngModelChange)="
                themeService.updateGlobalProperty('backgroundColor', $event)
              "
              class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              aria-label="Choose background color"
            />
            <input
              type="text"
              [ngModel]="globalTheme().backgroundColor"
              (ngModelChange)="
                themeService.updateGlobalProperty('backgroundColor', $event)
              "
              class="w-24 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
              aria-label="Background hex value"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label for="text-color" class="flex-1 text-sm font-medium text-gray-700">
            Text Color
          </label>
          <div class="flex items-center gap-2">
            <input
              id="text-color"
              type="color"
              [ngModel]="globalTheme().textColor"
              (ngModelChange)="
                themeService.updateGlobalProperty('textColor', $event)
              "
              class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              aria-label="Choose text color"
            />
            <input
              type="text"
              [ngModel]="globalTheme().textColor"
              (ngModelChange)="
                themeService.updateGlobalProperty('textColor', $event)
              "
              class="w-24 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
              aria-label="Text color hex value"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label
            for="toolbar-bg"
            class="flex-1 text-sm font-medium text-gray-700"
          >
            Toolbar BG
          </label>
          <div class="flex items-center gap-2">
            <input
              id="toolbar-bg"
              type="color"
              [ngModel]="globalTheme().toolbarBackground"
              (ngModelChange)="
                themeService.updateGlobalProperty('toolbarBackground', $event)
              "
              class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              aria-label="Choose toolbar background color"
            />
            <input
              type="text"
              [ngModel]="globalTheme().toolbarBackground"
              (ngModelChange)="
                themeService.updateGlobalProperty('toolbarBackground', $event)
              "
              class="w-24 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
              aria-label="Toolbar background hex value"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label
            for="toolbar-color"
            class="flex-1 text-sm font-medium text-gray-700"
          >
            Toolbar Color
          </label>
          <div class="flex items-center gap-2">
            <input
              id="toolbar-color"
              type="color"
              [ngModel]="globalTheme().toolbarColor"
              (ngModelChange)="
                themeService.updateGlobalProperty('toolbarColor', $event)
              "
              class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              aria-label="Choose toolbar text color"
            />
            <input
              type="text"
              [ngModel]="globalTheme().toolbarColor"
              (ngModelChange)="
                themeService.updateGlobalProperty('toolbarColor', $event)
              "
              class="w-24 text-xs font-mono px-2 py-1.5 border border-gray-300 rounded-md bg-white"
              aria-label="Toolbar color hex value"
            />
          </div>
        </div>
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
}
