import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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

          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300"></div>

          <!-- Preset selector -->
          <select
            [ngModel]="themeService.activePreset()"
            (ngModelChange)="themeService.applyPreset($event)"
            class="text-xs font-medium border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 hover:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 cursor-pointer transition-all"
            aria-label="Theme preset"
          >
            @for (preset of themeService.presets; track preset.id) {
              <option [value]="preset.id">{{ preset.name }}</option>
            }
          </select>
        </div>
        <div class="flex items-center gap-3">
          <!-- Platform toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              [class]="themeService.previewPlatform() === 'ios'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="themeService.previewPlatform.set('ios')"
              aria-label="iOS preview"
            >
               iOS
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              [class]="themeService.previewPlatform() === 'md'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="themeService.previewPlatform.set('md')"
              aria-label="Material Design preview"
            >
              🤖 Material
            </button>
          </div>

          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300"></div>

          <!-- Theme mode toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              [class]="themeService.mode() === 'light'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="themeService.mode.set('light')"
              aria-label="Light theme preview"
            >
              ☀️ Light
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              [class]="themeService.mode() === 'dark'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="themeService.mode.set('dark')"
              aria-label="Dark theme preview"
            >
              🌙 Dark
            </button>
          </div>

          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300"></div>

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

          <!-- GitHub link -->
          <a
            href="https://github.com/medbenmakhlouf/ionic-theme-builder"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="View source on GitHub"
            title="View source on GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
          </a>
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
          <div class="flex flex-col overflow-hidden w-110 shrink-0">
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
}
