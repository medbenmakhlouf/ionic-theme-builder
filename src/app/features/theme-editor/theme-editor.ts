import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { GlobalColorsComponent } from './global-colors/global-colors';
import { ComponentEditorComponent } from './component-editor/component-editor';
import { DarkModeEditorComponent } from './dark-mode-editor/dark-mode-editor';
import { PreviewComponent } from '../preview/preview';
import { CssOutputComponent } from '../css-output/css-output';
import { ThemeService } from '../../core/services/theme.service';

type SidebarTab = 'colors' | 'dark' | 'components';

@Component({
  selector: 'app-theme-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GlobalColorsComponent,
    ComponentEditorComponent,
    DarkModeEditorComponent,
    PreviewComponent,
    CssOutputComponent,
  ],
  template: `
    <div class="h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200/80 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span class="text-2xl">⚡</span> Ionic Theme Builder
          </h1>
          <span class="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-wide">
            v8+
          </span>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            <label for="global-mode" class="text-xs font-medium text-gray-500">Mode:</label>
            <select
              id="global-mode"
              class="text-xs font-medium border-0 bg-transparent text-gray-700 cursor-pointer focus:ring-0 pr-6"
              [value]="themeService.globalMode()"
              (change)="onGlobalModeChange($event)"
              aria-label="Global platform mode"
            >
              <option value="all">All Platforms</option>
              <option value="ios">iOS Only</option>
              <option value="md">Material Design</option>
            </select>
          </div>
          <span class="text-xs text-gray-400 font-medium">
            {{ componentCount() }} components
          </span>
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100 transition-colors cursor-pointer"
            (click)="themeService.resetAll()"
            aria-label="Reset all theme settings"
          >
            Reset All
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar -->
        <aside
          class="w-80 bg-white border-r border-gray-200/80 flex flex-col shrink-0"
          aria-label="Theme editor sidebar"
        >
          <!-- Sidebar tabs -->
          <div class="flex border-b border-gray-200/80 shrink-0" role="tablist">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="sidebarTab() === 'colors'"
              class="flex-1 px-4 py-4 text-sm font-semibold transition-all cursor-pointer"
              [class]="sidebarTab() === 'colors'
                ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
              (click)="sidebarTab.set('colors')"
            >
              🎨 Colors
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="sidebarTab() === 'dark'"
              class="flex-1 px-4 py-4 text-sm font-semibold transition-all cursor-pointer"
              [class]="sidebarTab() === 'dark'
                ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
              (click)="sidebarTab.set('dark')"
            >
              🌙 Dark
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="sidebarTab() === 'components'"
              class="flex-1 px-4 py-4 text-sm font-semibold transition-all cursor-pointer"
              [class]="sidebarTab() === 'components'
                ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
              (click)="sidebarTab.set('components')"
            >
              🧩 Components
            </button>
          </div>

          <!-- Sidebar content -->
          <div class="flex-1 overflow-y-auto p-4">
            @switch (sidebarTab()) {
              @case ('colors') {
                <app-global-colors />
              }
              @case ('dark') {
                <app-dark-mode-editor />
              }
              @case ('components') {
                <app-component-editor />
              }
            }
          </div>
        </aside>

        <!-- Main Panel: CSS on the left, Phone preview on the right -->
        <main class="flex-1 flex overflow-hidden gap-5 p-5">
          <!-- CSS Output (left) -->
          <div class="flex-1 flex flex-col overflow-hidden min-w-0">
            <app-css-output />
          </div>

          <!-- Phone Preview (right) -->
          <div class="flex flex-col overflow-hidden w-[440px] shrink-0">
            <app-preview />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ThemeEditorComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly sidebarTab = signal<SidebarTab>('colors');
  protected readonly componentCount = computed(
    () => this.themeService.componentThemes().length
  );

  protected onGlobalModeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'ios' | 'md';
    this.themeService.setGlobalMode(value);
  }
}
