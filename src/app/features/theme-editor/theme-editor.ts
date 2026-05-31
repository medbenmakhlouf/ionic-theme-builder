import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { GlobalColorsComponent } from './global-colors/global-colors';
import { ComponentEditorComponent } from './component-editor/component-editor';
import { PreviewComponent } from '../preview/preview';
import { CssOutputComponent } from '../css-output/css-output';
import { ThemeService } from '../../core/services/theme.service';

type ActiveTab = 'preview' | 'css';

@Component({
  selector: 'app-theme-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GlobalColorsComponent,
    ComponentEditorComponent,
    PreviewComponent,
    CssOutputComponent,
  ],
  template: `
    <div class="h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-gray-900">
            ⚡ Ionic Theme Builder
          </h1>
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            v8+
          </span>
        </div>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          (click)="themeService.resetAll()"
          aria-label="Reset all theme settings"
        >
          Reset All
        </button>
      </header>

      <!-- Main Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar: Color Editor -->
        <aside
          class="w-80 bg-white border-r border-gray-200 overflow-y-auto p-5 space-y-6 shrink-0"
          aria-label="Theme editor sidebar"
        >
          <app-global-colors />
          <hr class="border-gray-200" />
          <app-component-editor />
        </aside>

        <!-- Main Panel -->
        <main class="flex-1 flex flex-col overflow-hidden p-5">
          <!-- Tab Switcher -->
          <div class="flex gap-1 mb-4 bg-gray-200 rounded-lg p-1 w-fit" role="tablist">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'preview'"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
              [class]="activeTab() === 'preview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'"
              (click)="activeTab.set('preview')"
            >
              Preview
            </button>
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="activeTab() === 'css'"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
              [class]="activeTab() === 'css'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'"
              (click)="activeTab.set('css')"
            >
              CSS Output
            </button>
          </div>

          <!-- Tab Content -->
          <div class="flex-1 overflow-hidden" role="tabpanel">
            @switch (activeTab()) {
              @case ('preview') {
                <app-preview />
              }
              @case ('css') {
                <app-css-output />
              }
            }
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ThemeEditorComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly activeTab = signal<ActiveTab>('preview');
}
