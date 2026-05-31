import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { generateIonicColorVariables } from '../../core/utils/color.utils';
import { IONIC_COLOR_NAMES } from '../../core/models/theme.model';

@Component({
  selector: 'app-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="h-full flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-semibold text-gray-900">Live Preview</h2>
        <div class="flex items-center gap-2">
          <div class="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer"
              [class]="previewPlatform() === 'ios'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="previewPlatform.set('ios')"
              aria-label="iOS preview"
            >
               iOS
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer"
              [class]="previewPlatform() === 'md'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="previewPlatform.set('md')"
              aria-label="Material Design preview"
            >
              🤖 MD
            </button>
          </div>
          <div class="w-px h-5 bg-gray-200"></div>
          <div class="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer"
              [class]="previewMode() === 'light'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="previewMode.set('light')"
              aria-label="Light theme preview"
            >
              ☀️ Light
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer"
              [class]="previewMode() === 'dark'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="previewMode.set('dark')"
              aria-label="Dark theme preview"
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex-1 overflow-auto rounded-xl border border-gray-200 shadow-sm ionic-preview-container"
        [style]="previewStyles()"
        [class.ion-palette-dark]="previewMode() === 'dark'"
      >
        <div class="ionic-preview p-4 space-y-6" [attr.mode]="previewPlatform()">
          <!-- Toolbar -->
          <ion-toolbar [attr.mode]="previewPlatform()">
            <ion-title>My App</ion-title>
            <ion-buttons slot="start">
              <ion-button>
                <ion-icon name="menu-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button>
                <ion-icon name="notifications-outline" slot="icon-only"></ion-icon>
              </ion-button>
              <ion-button>
                <ion-icon name="settings-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>

          <!-- Segment -->
          <ion-segment value="all" [attr.mode]="previewPlatform()">
            <ion-segment-button value="all">
              <ion-label>All</ion-label>
            </ion-segment-button>
            <ion-segment-button value="favorites">
              <ion-label>Favorites</ion-label>
            </ion-segment-button>
            <ion-segment-button value="recent">
              <ion-label>Recent</ion-label>
            </ion-segment-button>
          </ion-segment>

          <!-- Buttons -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium px-2" [style.color]="'var(--ion-text-color)'">
              Buttons
            </h3>
            <div class="flex flex-wrap gap-2 px-2">
              <ion-button color="primary">Primary</ion-button>
              <ion-button color="secondary">Secondary</ion-button>
              <ion-button color="tertiary">Tertiary</ion-button>
              <ion-button color="success">Success</ion-button>
              <ion-button color="warning">Warning</ion-button>
              <ion-button color="danger">Danger</ion-button>
            </div>
            <div class="flex flex-wrap gap-2 px-2">
              <ion-button fill="outline" color="primary">Outline</ion-button>
              <ion-button fill="clear" color="primary">Clear</ion-button>
              <ion-button color="dark">Dark</ion-button>
              <ion-button color="medium">Medium</ion-button>
              <ion-button color="light">Light</ion-button>
            </div>
          </div>

          <!-- Card -->
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
              <ion-card-title>Card Title</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              This is a sample card with content to preview your theme styling.
              Cards are great for grouping related content together.
            </ion-card-content>
          </ion-card>

          <!-- Searchbar -->
          <ion-searchbar placeholder="Search items..." [attr.mode]="previewPlatform()"></ion-searchbar>

          <!-- List with various items -->
          <ion-list [attr.mode]="previewPlatform()">
            <ion-item>
              <ion-avatar slot="start">
                <div class="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-700">AB</div>
              </ion-avatar>
              <ion-label>
                <h2>Alex Builder</h2>
                <p>Developer</p>
              </ion-label>
              <ion-badge slot="end" color="primary">Pro</ion-badge>
            </ion-item>
            <ion-item>
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-label>Messages</ion-label>
              <ion-badge slot="end" color="danger">5</ion-badge>
            </ion-item>
            <ion-item>
              <ion-icon name="notifications-outline" slot="start"></ion-icon>
              <ion-label>Notifications</ion-label>
              <ion-toggle></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-icon name="moon-outline" slot="start"></ion-icon>
              <ion-label>Dark Mode</ion-label>
              <ion-toggle checked></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-checkbox slot="start"></ion-checkbox>
              <ion-label>Accept Terms</ion-label>
            </ion-item>
            <ion-item>
              <ion-checkbox slot="start" checked></ion-checkbox>
              <ion-label>Subscribe to Newsletter</ion-label>
            </ion-item>
          </ion-list>

          <!-- Inputs -->
          <div class="px-2 space-y-3">
            <h3 class="text-sm font-medium" [style.color]="'var(--ion-text-color)'">
              Form Inputs
            </h3>
            <ion-input
              label="Full Name"
              label-placement="floating"
              placeholder="Enter your name"
              fill="outline"
            ></ion-input>
            <ion-input
              label="Email"
              label-placement="floating"
              type="email"
              placeholder="Enter email"
              fill="outline"
            ></ion-input>
            <ion-textarea
              label="Bio"
              label-placement="floating"
              placeholder="Tell us about yourself"
              fill="outline"
              rows="3"
            ></ion-textarea>
          </div>

          <!-- Radio Group -->
          <ion-list>
            <ion-radio-group value="option1">
              <ion-item>
                <ion-radio value="option1">Option One</ion-radio>
              </ion-item>
              <ion-item>
                <ion-radio value="option2">Option Two</ion-radio>
              </ion-item>
              <ion-item>
                <ion-radio value="option3">Option Three</ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>

          <!-- Range -->
          <div class="px-2">
            <ion-range aria-label="Volume" min="0" max="100" value="50" pin="true">
              <ion-icon name="volume-low-outline" slot="start"></ion-icon>
              <ion-icon name="volume-high-outline" slot="end"></ion-icon>
            </ion-range>
          </div>

          <!-- Progress Bar -->
          <div class="px-2 space-y-2">
            <h3 class="text-sm font-medium" [style.color]="'var(--ion-text-color)'">
              Progress
            </h3>
            <ion-progress-bar value="0.65"></ion-progress-bar>
            <ion-progress-bar type="indeterminate"></ion-progress-bar>
          </div>

          <!-- Chips -->
          <div class="flex flex-wrap gap-2 px-2">
            <ion-chip color="primary">
              <ion-icon name="star"></ion-icon>
              <ion-label>Primary</ion-label>
            </ion-chip>
            <ion-chip color="secondary">
              <ion-label>Secondary</ion-label>
            </ion-chip>
            <ion-chip color="success">
              <ion-icon name="checkmark-circle"></ion-icon>
              <ion-label>Success</ion-label>
            </ion-chip>
            <ion-chip color="warning">
              <ion-label>Warning</ion-label>
            </ion-chip>
            <ion-chip color="danger">
              <ion-icon name="close-circle"></ion-icon>
              <ion-label>Danger</ion-label>
            </ion-chip>
          </div>

          <!-- Accordion -->
          <ion-accordion-group>
            <ion-accordion value="first">
              <ion-item slot="header">
                <ion-label>Accordion Item 1</ion-label>
              </ion-item>
              <div class="px-4 py-2" slot="content">
                Content for the first accordion item. This shows how expandable
                sections look with your theme.
              </div>
            </ion-accordion>
            <ion-accordion value="second">
              <ion-item slot="header">
                <ion-label>Accordion Item 2</ion-label>
              </ion-item>
              <div class="px-4 py-2" slot="content">
                Content for the second accordion item.
              </div>
            </ion-accordion>
          </ion-accordion-group>

          <!-- Skeleton Text -->
          <div class="px-2 space-y-2">
            <h3 class="text-sm font-medium" [style.color]="'var(--ion-text-color)'">
              Skeleton Loading
            </h3>
            <ion-item>
              <ion-thumbnail slot="start">
                <ion-skeleton-text animated style="width: 100%; height: 100%"></ion-skeleton-text>
              </ion-thumbnail>
              <ion-label>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
              </ion-label>
            </ion-item>
          </div>

          <!-- Tab Bar -->
          <ion-tab-bar [attr.mode]="previewPlatform()">
            <ion-tab-button selected>
              <ion-icon name="home-outline"></ion-icon>
              <ion-label>Home</ion-label>
            </ion-tab-button>
            <ion-tab-button>
              <ion-icon name="search-outline"></ion-icon>
              <ion-label>Search</ion-label>
            </ion-tab-button>
            <ion-tab-button>
              <ion-icon name="heart-outline"></ion-icon>
              <ion-label>Favorites</ion-label>
              <ion-badge color="danger">3</ion-badge>
            </ion-tab-button>
            <ion-tab-button>
              <ion-icon name="person-outline"></ion-icon>
              <ion-label>Profile</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </div>
      </div>
    </section>
  `,
})
export class PreviewComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly previewMode = signal<'light' | 'dark'>('light');
  protected readonly previewPlatform = signal<'ios' | 'md'>('ios');

  protected readonly previewStyles = computed(() => {
    const mode = this.previewMode();
    const theme = this.themeService.globalTheme();
    const dark = this.themeService.darkTheme();
    const isDark = mode === 'dark' && dark.enabled;
    const styles: string[] = [];

    const activeColors = isDark ? dark.colors : theme.colors;

    // Color variables
    for (const name of IONIC_COLOR_NAMES) {
      const hex = activeColors[name];
      if (!hex) continue;
      const vars = generateIonicColorVariables(name, hex);
      for (const [varName, varValue] of Object.entries(vars)) {
        styles.push(`${varName}: ${varValue}`);
      }
    }

    // Background & Text
    const bg = isDark ? dark.backgroundColor : theme.backgroundColor;
    const text = isDark ? dark.textColor : theme.textColor;
    styles.push(`--ion-background-color: ${bg}`);
    styles.push(`--ion-text-color: ${text}`);
    styles.push(`background-color: ${bg}`);
    styles.push(`color: ${text}`);
    styles.push(`font-family: ${theme.fontFamily}`);
    styles.push(`--ion-font-family: ${theme.fontFamily}`);

    // Toolbar
    styles.push(`--ion-toolbar-background: ${isDark ? dark.toolbarBackground : theme.toolbarBackground}`);
    styles.push(`--ion-toolbar-color: ${isDark ? dark.toolbarColor : theme.toolbarColor}`);
    styles.push(`--ion-toolbar-border-color: ${isDark ? dark.toolbarBorderColor : theme.toolbarBorderColor}`);

    // Items
    styles.push(`--ion-item-background: ${isDark ? dark.itemBackground : theme.itemBackground}`);
    styles.push(`--ion-item-border-color: ${isDark ? dark.itemBorderColor : theme.itemBorderColor}`);

    // Card
    styles.push(`--ion-card-background: ${isDark ? dark.cardBackground : theme.cardBackground}`);

    // Tab Bar
    styles.push(`--ion-tab-bar-background: ${isDark ? dark.tabBarBackground : theme.tabBarBackground}`);
    styles.push(`--ion-tab-bar-border-color: ${theme.tabBarBorderColor}`);
    styles.push(`--ion-tab-bar-color: ${isDark ? dark.tabBarColor : theme.tabBarColor}`);
    styles.push(`--ion-tab-bar-color-selected: ${isDark ? dark.tabBarColorSelected : theme.tabBarColorSelected}`);

    // Other
    styles.push(`--ion-border-color: ${isDark ? dark.borderColor : theme.borderColor}`);
    styles.push(`--ion-placeholder-color: ${theme.placeholderColor}`);
    styles.push(`--ion-backdrop-color: ${theme.backdropColor}`);
    styles.push(`--ion-backdrop-opacity: ${theme.backdropOpacity}`);

    return styles.join('; ');
  });
}
