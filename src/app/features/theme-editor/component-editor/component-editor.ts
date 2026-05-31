import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-component-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Component Styles</h2>

      <div class="space-y-2">
        @for (component of themeService.componentThemes(); track component.componentName) {
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              [attr.aria-expanded]="expandedComponent() === component.componentName"
              [attr.aria-controls]="'panel-' + component.componentName"
              (click)="toggleComponent(component.componentName)"
            >
              <span class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-800">
                  {{ component.label }}
                </span>
                @if (component.mode !== 'all') {
                  <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                    {{ component.mode }}
                  </span>
                }
              </span>
              <span
                class="text-gray-500 text-xs transition-transform duration-200"
                [class.rotate-180]="expandedComponent() === component.componentName"
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            @if (expandedComponent() === component.componentName) {
              <div
                [id]="'panel-' + component.componentName"
                role="region"
                class="px-4 py-3 space-y-3 border-t border-gray-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <label
                      [attr.for]="'mode-' + component.componentName"
                      class="text-xs font-medium text-gray-500"
                    >
                      Mode:
                    </label>
                    <select
                      [id]="'mode-' + component.componentName"
                      [value]="component.mode"
                      (change)="onComponentModeChange(component.componentName, $event)"
                      class="text-xs border border-gray-300 rounded px-1.5 py-0.5 bg-white cursor-pointer"
                      [attr.aria-label]="component.label + ' platform mode'"
                    >
                      <option value="all">All</option>
                      <option value="ios">iOS</option>
                      <option value="md">MD</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    class="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    (click)="themeService.resetComponent(component.componentName)"
                    [attr.aria-label]="'Reset ' + component.label + ' to defaults'"
                  >
                    Reset
                  </button>
                </div>

                @for (variable of component.variables; track variable.name) {
                  <div class="flex items-center gap-3">
                    <label
                      [attr.for]="component.componentName + '-' + variable.name"
                      class="flex-1 text-xs font-medium text-gray-600"
                    >
                      {{ variable.label }}
                    </label>

                    @switch (variable.type) {
                      @case ('color') {
                        <div class="flex items-center gap-2">
                          <input
                            [id]="component.componentName + '-' + variable.name"
                            type="color"
                            [ngModel]="variable.value"
                            (ngModelChange)="
                              themeService.updateComponentVariable(
                                component.componentName,
                                variable.name,
                                $event
                              )
                            "
                            class="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
                            [attr.aria-label]="variable.label + ' color'"
                          />
                          <input
                            type="text"
                            [ngModel]="variable.value"
                            (ngModelChange)="
                              themeService.updateComponentVariable(
                                component.componentName,
                                variable.name,
                                $event
                              )
                            "
                            class="w-20 text-xs font-mono px-2 py-1 border border-gray-300 rounded bg-white"
                            [attr.aria-label]="variable.label + ' hex value'"
                          />
                        </div>
                      }
                      @default {
                        <input
                          [id]="component.componentName + '-' + variable.name"
                          type="text"
                          [ngModel]="variable.value"
                          (ngModelChange)="
                            themeService.updateComponentVariable(
                              component.componentName,
                              variable.name,
                              $event
                            )
                          "
                          class="w-24 text-xs font-mono px-2 py-1 border border-gray-300 rounded bg-white"
                          [attr.aria-label]="variable.label + ' value'"
                        />
                      }
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class ComponentEditorComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly expandedComponent = signal<string | null>(null);

  protected toggleComponent(name: string): void {
    this.expandedComponent.update((current) =>
      current === name ? null : name
    );
  }

  protected onComponentModeChange(componentName: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'ios' | 'md';
    this.themeService.updateComponentMode(componentName, value);
  }
}
