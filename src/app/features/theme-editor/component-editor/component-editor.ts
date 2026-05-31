import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { getTailwindTokens, TailwindToken } from '../../../core/models/theme.model';

@Component({
  selector: 'app-component-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Component Overrides</h2>
          <p class="text-xs text-gray-400">Customize CSS variables per Ionic component.</p>
        </div>
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            [ngModel]="themeService.useTailwind()"
            (ngModelChange)="themeService.toggleTailwind($event)"
            class="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            aria-label="Use Tailwind CSS variables"
          />
          <span class="text-[11px] font-medium text-gray-600">Tailwind v4</span>
        </label>
      </div>

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
                >▶</span
              >
              <span class="flex-1 text-left text-sm font-medium text-gray-800">
                {{ component.label }}
              </span>
              @if (component.mode !== 'all') {
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase"
                >
                  {{ component.mode }}
                </span>
              }
              @if (hasOverrides(component.variables)) {
                <span
                  class="w-2 h-2 rounded-full bg-indigo-400"
                  aria-label="Has custom values"
                ></span>
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
                    <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                      >Mode:</span
                    >
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
                    @if (variable.type === 'size') {
                      @if (getTokens(variable.name); as tokens) {
                        <!-- Tailwind token mode -->
                        <div class="flex items-center gap-1">
                          <select
                            [ngModel]="resolveTokenValue(variable.value, tokens)"
                            (ngModelChange)="
                              onTokenChange(component.componentName, variable.name, $event)
                            "
                            class="w-[5.5rem] text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-gray-50 focus:border-indigo-400 cursor-pointer"
                            [attr.aria-label]="variable.label + ' token'"
                          >
                            @for (token of tokens; track token.value) {
                              <option [value]="token.value">
                                {{ token.label }} · {{ token.description }}
                              </option>
                            }
                            <option value="__custom__">Custom</option>
                          </select>
                          @if (isCustomValue(variable.value, tokens)) {
                            <div class="flex items-center gap-0.5">
                              <input
                                [id]="component.componentName + '-' + variable.name"
                                type="number"
                                [ngModel]="parseNumericValue(variable.value)"
                                (ngModelChange)="
                                  onSizeValueChange(
                                    component.componentName,
                                    variable.name,
                                    $event,
                                    variable.value
                                  )
                                "
                                step="1"
                                class="w-14 text-xs font-mono px-1.5 py-1 border border-gray-200 rounded-l-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                [attr.aria-label]="variable.label + ' custom value'"
                              />
                              <select
                                [ngModel]="parseUnit(variable.value)"
                                (ngModelChange)="
                                  onSizeUnitChange(
                                    component.componentName,
                                    variable.name,
                                    $event,
                                    variable.value
                                  )
                                "
                                class="text-xs border border-l-0 border-gray-200 rounded-r-md px-1 py-1 bg-gray-50 focus:border-indigo-400 cursor-pointer"
                                [attr.aria-label]="variable.label + ' unit'"
                              >
                                <option value="px">px</option>
                                <option value="rem">rem</option>
                              </select>
                            </div>
                          }
                        </div>
                      } @else {
                        <!-- Plain numeric size (no tokens) -->
                        <div class="flex items-center gap-0.5">
                          <input
                            [id]="component.componentName + '-' + variable.name"
                            type="number"
                            [ngModel]="parseNumericValue(variable.value)"
                            (ngModelChange)="
                              onSizeValueChange(
                                component.componentName,
                                variable.name,
                                $event,
                                variable.value
                              )
                            "
                            step="1"
                            class="w-16 text-xs font-mono px-2 py-1 border border-gray-200 rounded-l-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            [attr.aria-label]="variable.label + ' numeric value'"
                          />
                          <select
                            [ngModel]="parseUnit(variable.value)"
                            (ngModelChange)="
                              onSizeUnitChange(
                                component.componentName,
                                variable.name,
                                $event,
                                variable.value
                              )
                            "
                            class="text-xs border border-l-0 border-gray-200 rounded-r-md px-1 py-1 bg-gray-50 focus:border-indigo-400 cursor-pointer"
                            [attr.aria-label]="variable.label + ' unit'"
                          >
                            <option value="px">px</option>
                            <option value="rem">rem</option>
                          </select>
                        </div>
                      }
                    } @else {
                      @if (getTokens(variable.name); as tokens) {
                        <!-- Text variable with Tailwind tokens (e.g. box-shadow) -->
                        <div class="flex items-center gap-1">
                          <select
                            [ngModel]="resolveTokenValue(variable.value, tokens)"
                            (ngModelChange)="
                              onTokenChange(component.componentName, variable.name, $event)
                            "
                            class="w-[5.5rem] text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-gray-50 focus:border-indigo-400 cursor-pointer"
                            [attr.aria-label]="variable.label + ' token'"
                          >
                            @for (token of tokens; track token.value) {
                              <option [value]="token.value">
                                {{ token.label }} · {{ token.description }}
                              </option>
                            }
                            <option value="__custom__">Custom</option>
                          </select>
                          @if (isCustomValue(variable.value, tokens)) {
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
                              class="w-20 text-xs font-mono px-1.5 py-1 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                              [attr.aria-label]="variable.label + ' custom value'"
                            />
                          }
                        </div>
                      } @else {
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
                          class="w-[5.5rem] text-xs font-mono px-2 py-1 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
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
    this.expandedComponent.update((current) => (current === name ? null : name));
  }

  protected onComponentModeChange(componentName: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'ios' | 'md';
    this.themeService.updateComponentMode(componentName, value);
  }

  protected hasOverrides(variables: { value: string; defaultValue: string }[]): boolean {
    return variables.some((v) => v.value !== v.defaultValue);
  }

  protected getTokens(variableName: string): TailwindToken[] | null {
    return getTailwindTokens(variableName);
  }

  protected resolveTokenValue(value: string, tokens: TailwindToken[]): string {
    const match = tokens.find((t) => t.value === value);
    return match ? match.value : '__custom__';
  }

  protected isCustomValue(value: string, tokens: TailwindToken[]): boolean {
    return !tokens.some((t) => t.value === value);
  }

  protected onTokenChange(componentName: string, variableName: string, tokenValue: string): void {
    if (tokenValue === '__custom__') {
      this.themeService.updateComponentVariable(componentName, variableName, '0px');
    } else {
      this.themeService.updateComponentVariable(componentName, variableName, tokenValue);
    }
  }

  protected parseNumericValue(value: string): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  protected parseUnit(value: string): 'px' | 'rem' {
    if (value.trim().endsWith('rem')) return 'rem';
    return 'px';
  }

  protected onSizeValueChange(
    componentName: string,
    variableName: string,
    numericValue: number,
    currentValue: string,
  ): void {
    const unit = this.parseUnit(currentValue);
    this.themeService.updateComponentVariable(
      componentName,
      variableName,
      `${numericValue}${unit}`,
    );
  }

  protected onSizeUnitChange(
    componentName: string,
    variableName: string,
    newUnit: 'px' | 'rem',
    currentValue: string,
  ): void {
    const num = this.parseNumericValue(currentValue);
    this.themeService.updateComponentVariable(componentName, variableName, `${num}${newUnit}`);
  }
}
