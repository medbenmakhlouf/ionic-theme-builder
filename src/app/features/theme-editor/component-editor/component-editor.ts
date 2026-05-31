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
      <h2 class="text-base font-semibold text-gray-900">Component Overrides</h2>
      <p class="text-xs text-gray-400">Customize CSS variables per Ionic component.</p>

      <div class="space-y-1.5">
        @for (component of themeService.componentThemes(); track component.componentName) {
          <div class="rounded-lg border border-gray-100 overflow-hidden bg-white shadow-sm">
            <!-- Accordion header -->
            <button
              type="button"
              class="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
              [attr.aria-expanded]="expandedComponent() === component.componentName"
              [attr.aria-controls]="'panel-' + component.componentName"
              (click)="toggleComponent(component.componentName)"
            >
              <span
                class="text-[10px] text-gray-400 transition-transform duration-200"
                [class.rotate-90]="expandedComponent() === component.componentName"
                aria-hidden="true"
              >▶</span>
              <span class="flex-1 text-left text-sm font-medium text-gray-800">
                {{ component.label }}
              </span>
              @if (component.mode !== 'all') {
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase">
                  {{ component.mode }}
                </span>
              }
              @if (hasOverrides(component.variables)) {
                <span class="w-2 h-2 rounded-full bg-indigo-400" aria-label="Has custom values"></span>
              }
            </button>

            @if (expandedComponent() === component.componentName) {
              <div
                [id]="'panel-' + component.componentName"
                role="region"
                class="px-3 pb-3 pt-1 space-y-3 border-t border-gray-50"
              >
                <!-- Mode + Reset row -->
                <div class="flex items-center justify-between py-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Mode:</span>
                    <select
                      [id]="'mode-' + component.componentName"
                      [value]="component.mode"
                      (change)="onComponentModeChange(component.componentName, $event)"
                      class="text-xs border border-gray-200 rounded-md px-2 py-1 bg-gray-50 focus:border-indigo-400 cursor-pointer"
                      [attr.aria-label]="component.label + ' platform mode'"
                    >
                      <option value="all">All</option>
                      <option value="ios">iOS</option>
                      <option value="md">MD</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    class="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                    (click)="themeService.resetComponent(component.componentName)"
                    [attr.aria-label]="'Reset ' + component.label + ' to defaults'"
                  >
                    Reset
                  </button>
                </div>

                <!-- Variables -->
                @for (variable of component.variables; track variable.name) {
                  <div class="flex items-center gap-2">
                    @if (variable.type === 'color') {
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
                        class="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0"
                        [attr.aria-label]="variable.label + ' color'"
                      />
                    }
                    <label
                      [attr.for]="component.componentName + '-' + variable.name"
                      class="flex-1 text-xs text-gray-600 truncate cursor-pointer"
                      [title]="variable.name"
                    >
                      {{ variable.label }}
                    </label>
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
                      class="w-[5.5rem] text-xs font-mono px-2 py-1 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                      [attr.aria-label]="variable.label + ' value'"
                    />
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

  protected hasOverrides(variables: { value: string; defaultValue: string }[]): boolean {
    return variables.some((v) => v.value !== v.defaultValue);
  }
}
