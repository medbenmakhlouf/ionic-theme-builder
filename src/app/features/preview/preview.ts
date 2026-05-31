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
  styles: `
    .phone-frame {
      position: relative;
      margin: 0 auto;
      border-radius: 40px;
      box-shadow:
        0 0 0 2px #1a1a1a,
        0 0 0 4px #333,
        0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      width: 375px;
      height: 750px;
      background: #000;
      flex-shrink: 0;
    }

    .phone-frame--ios {
      border-radius: 44px;
      box-shadow:
        0 0 0 3px #1a1a1a,
        0 0 0 5px #6b6b6b,
        inset 0 0 0 1px #3a3a3a,
        0 20px 60px rgba(0, 0, 0, 0.35);
    }

    .phone-frame--md {
      border-radius: 32px;
      box-shadow:
        0 0 0 2px #1a1a1a,
        0 0 0 4px #444,
        0 20px 60px rgba(0, 0, 0, 0.3);
    }

    /* iOS notch */
    .phone-notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 160px;
      height: 28px;
      background: #000;
      border-radius: 0 0 18px 18px;
      z-index: 10;
    }

    .phone-notch::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 6px;
      background: #1a1a1a;
      border-radius: 3px;
    }

    /* Android punch-hole camera */
    .phone-camera-hole {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background: #1a1a1a;
      border-radius: 50%;
      z-index: 10;
      box-shadow: 0 0 0 2px #333;
    }

    .phone-screen {
      position: absolute;
      inset: 0;
      overflow-y: auto;
      overflow-x: hidden;
      border-radius: inherit;
    }

    .phone-frame--ios .phone-screen {
      padding-top: 44px;
    }

    .phone-frame--md .phone-screen {
      padding-top: 28px;
    }

    /* iOS home indicator */
    .phone-home-indicator {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 130px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      z-index: 10;
    }

    /* Android nav bar */
    .phone-nav-bar {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 2px;
      z-index: 10;
    }
  `,
  template: `
    <section class="h-full flex flex-col">
      <!-- Preview controls -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900">Live Preview</h2>
        <div class="flex items-center gap-3">
          <!-- Platform toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer"
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
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer"
              [class]="previewPlatform() === 'md'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              (click)="previewPlatform.set('md')"
              aria-label="Material Design preview"
            >
              🤖 Material
            </button>
          </div>

          <!-- Divider -->
          <div class="w-px h-7 bg-gray-300"></div>

          <!-- Theme toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer"
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
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer"
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

      <!--
        Preview container: Phone frame mockup with scrollable content.
        Using @if to force destroy/recreate of Ionic web components
        when platform changes, since Ionic components only read 'mode' at initialization.
      -->
      <div class="flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-200 shadow-sm py-6">
        <div
          class="phone-frame"
          [class]="previewPlatform() === 'ios' ? 'phone-frame--ios' : 'phone-frame--md'"
        >
          @if (previewPlatform() === 'ios') {
            <div class="phone-notch"></div>
          } @else {
            <div class="phone-camera-hole"></div>
          }

          <div class="phone-screen" [style]="previewStyles()"
          >
          @if (previewPlatform() === 'ios') {
            <div class="ionic-preview p-5 space-y-6 pb-10">
              <ion-toolbar mode="ios">
              <ion-title>My App</ion-title>
              <ion-buttons slot="start">
                <ion-button mode="ios"><ion-icon name="menu-outline" slot="icon-only"></ion-icon></ion-button>
              </ion-buttons>
              <ion-buttons slot="end">
                <ion-button mode="ios"><ion-icon name="notifications-outline" slot="icon-only"></ion-icon></ion-button>
              </ion-buttons>
            </ion-toolbar>

            <ion-segment value="all" mode="ios">
              <ion-segment-button value="all" mode="ios"><ion-label>All</ion-label></ion-segment-button>
              <ion-segment-button value="favorites" mode="ios"><ion-label>Favorites</ion-label></ion-segment-button>
              <ion-segment-button value="recent" mode="ios"><ion-label>Recent</ion-label></ion-segment-button>
            </ion-segment>

            <div class="space-y-2">
              <h3 class="text-sm font-medium px-2" style="color: var(--ion-text-color)">Buttons</h3>
              <div class="flex flex-wrap gap-2 px-2">
                <ion-button mode="ios" color="primary">Primary</ion-button>
                <ion-button mode="ios" color="secondary">Secondary</ion-button>
                <ion-button mode="ios" color="tertiary">Tertiary</ion-button>
                <ion-button mode="ios" color="success">Success</ion-button>
                <ion-button mode="ios" color="warning">Warning</ion-button>
                <ion-button mode="ios" color="danger">Danger</ion-button>
              </div>
              <div class="flex flex-wrap gap-2 px-2">
                <ion-button mode="ios" fill="outline" color="primary">Outline</ion-button>
                <ion-button mode="ios" fill="clear" color="primary">Clear</ion-button>
                <ion-button mode="ios" color="dark">Dark</ion-button>
                <ion-button mode="ios" color="light">Light</ion-button>
              </div>
            </div>

            <ion-card mode="ios">
              <ion-card-header mode="ios">
                <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                <ion-card-title>Card Title</ion-card-title>
              </ion-card-header>
              <ion-card-content>Sample card content to preview your theme.</ion-card-content>
            </ion-card>

            <ion-searchbar mode="ios" placeholder="Search items..."></ion-searchbar>

            <ion-list mode="ios">
              <ion-item mode="ios">
                <ion-avatar slot="start">
                  <div style="width:40px;height:40px;border-radius:50%;background:#93c5fd;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#1d4ed8">AB</div>
                </ion-avatar>
                <ion-label><h2>Alex Builder</h2><p>Developer</p></ion-label>
                <ion-badge slot="end" color="primary">Pro</ion-badge>
              </ion-item>
              <ion-item mode="ios">
                <ion-icon name="mail-outline" slot="start"></ion-icon>
                <ion-label>Messages</ion-label>
                <ion-badge slot="end" color="danger">5</ion-badge>
              </ion-item>
              <ion-item mode="ios">
                <ion-icon name="notifications-outline" slot="start"></ion-icon>
                <ion-label>Notifications</ion-label>
                <ion-toggle mode="ios"></ion-toggle>
              </ion-item>
              <ion-item mode="ios">
                <ion-checkbox mode="ios" slot="start" checked></ion-checkbox>
                <ion-label>Subscribe to Newsletter</ion-label>
              </ion-item>
            </ion-list>

            <div class="px-2 space-y-3">
              <h3 class="text-sm font-medium" style="color: var(--ion-text-color)">Form Inputs</h3>
              <ion-input mode="ios" label="Full Name" label-placement="floating" placeholder="Enter your name" fill="outline"></ion-input>
              <ion-textarea mode="ios" label="Bio" label-placement="floating" placeholder="Tell us about yourself" fill="outline" rows="3"></ion-textarea>
            </div>

            <ion-list mode="ios">
              <ion-radio-group value="option1">
                <ion-item mode="ios"><ion-radio mode="ios" value="option1">Option One</ion-radio></ion-item>
                <ion-item mode="ios"><ion-radio mode="ios" value="option2">Option Two</ion-radio></ion-item>
              </ion-radio-group>
            </ion-list>

            <div class="px-2">
              <ion-range mode="ios" aria-label="Volume" min="0" max="100" value="50" pin="true">
                <ion-icon name="volume-low-outline" slot="start"></ion-icon>
                <ion-icon name="volume-high-outline" slot="end"></ion-icon>
              </ion-range>
            </div>

            <div class="px-2 space-y-2">
              <ion-progress-bar mode="ios" value="0.65"></ion-progress-bar>
              <ion-progress-bar mode="ios" type="indeterminate"></ion-progress-bar>
            </div>

            <div class="flex flex-wrap gap-2 px-2">
              <ion-chip mode="ios" color="primary"><ion-icon name="star"></ion-icon><ion-label>Primary</ion-label></ion-chip>
              <ion-chip mode="ios" color="secondary"><ion-label>Secondary</ion-label></ion-chip>
              <ion-chip mode="ios" color="success"><ion-icon name="checkmark-circle"></ion-icon><ion-label>Success</ion-label></ion-chip>
              <ion-chip mode="ios" color="danger"><ion-icon name="close-circle"></ion-icon><ion-label>Danger</ion-label></ion-chip>
            </div>

            <ion-accordion-group mode="ios">
              <ion-accordion value="first" mode="ios">
                <ion-item slot="header" mode="ios"><ion-label>Accordion Item 1</ion-label></ion-item>
                <div class="px-4 py-2" slot="content">Content for the first accordion item.</div>
              </ion-accordion>
              <ion-accordion value="second" mode="ios">
                <ion-item slot="header" mode="ios"><ion-label>Accordion Item 2</ion-label></ion-item>
                <div class="px-4 py-2" slot="content">Content for the second accordion item.</div>
              </ion-accordion>
            </ion-accordion-group>

            <ion-tab-bar mode="ios">
              <ion-tab-button mode="ios" selected><ion-icon name="home-outline"></ion-icon><ion-label>Home</ion-label></ion-tab-button>
              <ion-tab-button mode="ios"><ion-icon name="search-outline"></ion-icon><ion-label>Search</ion-label></ion-tab-button>
              <ion-tab-button mode="ios"><ion-icon name="heart-outline"></ion-icon><ion-label>Favorites</ion-label><ion-badge color="danger">3</ion-badge></ion-tab-button>
              <ion-tab-button mode="ios"><ion-icon name="person-outline"></ion-icon><ion-label>Profile</ion-label></ion-tab-button>
            </ion-tab-bar>
            </div>
          } @else {
            <div class="ionic-preview p-5 space-y-6 pb-10">
            <ion-toolbar mode="md">
              <ion-title>My App</ion-title>
              <ion-buttons slot="start">
                <ion-button mode="md"><ion-icon name="menu-outline" slot="icon-only"></ion-icon></ion-button>
              </ion-buttons>
              <ion-buttons slot="end">
                <ion-button mode="md"><ion-icon name="notifications-outline" slot="icon-only"></ion-icon></ion-button>
              </ion-buttons>
            </ion-toolbar>

            <ion-segment value="all" mode="md">
              <ion-segment-button value="all" mode="md"><ion-label>All</ion-label></ion-segment-button>
              <ion-segment-button value="favorites" mode="md"><ion-label>Favorites</ion-label></ion-segment-button>
              <ion-segment-button value="recent" mode="md"><ion-label>Recent</ion-label></ion-segment-button>
            </ion-segment>

            <div class="space-y-2">
              <h3 class="text-sm font-medium px-2" style="color: var(--ion-text-color)">Buttons</h3>
              <div class="flex flex-wrap gap-2 px-2">
                <ion-button mode="md" color="primary">Primary</ion-button>
                <ion-button mode="md" color="secondary">Secondary</ion-button>
                <ion-button mode="md" color="tertiary">Tertiary</ion-button>
                <ion-button mode="md" color="success">Success</ion-button>
                <ion-button mode="md" color="warning">Warning</ion-button>
                <ion-button mode="md" color="danger">Danger</ion-button>
              </div>
              <div class="flex flex-wrap gap-2 px-2">
                <ion-button mode="md" fill="outline" color="primary">Outline</ion-button>
                <ion-button mode="md" fill="clear" color="primary">Clear</ion-button>
                <ion-button mode="md" color="dark">Dark</ion-button>
                <ion-button mode="md" color="light">Light</ion-button>
              </div>
            </div>

            <ion-card mode="md">
              <ion-card-header mode="md">
                <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                <ion-card-title>Card Title</ion-card-title>
              </ion-card-header>
              <ion-card-content>Sample card content to preview your theme.</ion-card-content>
            </ion-card>

            <ion-searchbar mode="md" placeholder="Search items..."></ion-searchbar>

            <ion-list mode="md">
              <ion-item mode="md">
                <ion-avatar slot="start">
                  <div style="width:40px;height:40px;border-radius:50%;background:#93c5fd;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#1d4ed8">AB</div>
                </ion-avatar>
                <ion-label><h2>Alex Builder</h2><p>Developer</p></ion-label>
                <ion-badge slot="end" color="primary">Pro</ion-badge>
              </ion-item>
              <ion-item mode="md">
                <ion-icon name="mail-outline" slot="start"></ion-icon>
                <ion-label>Messages</ion-label>
                <ion-badge slot="end" color="danger">5</ion-badge>
              </ion-item>
              <ion-item mode="md">
                <ion-icon name="notifications-outline" slot="start"></ion-icon>
                <ion-label>Notifications</ion-label>
                <ion-toggle mode="md"></ion-toggle>
              </ion-item>
              <ion-item mode="md">
                <ion-checkbox mode="md" slot="start" checked></ion-checkbox>
                <ion-label>Subscribe to Newsletter</ion-label>
              </ion-item>
            </ion-list>

            <div class="px-2 space-y-3">
              <h3 class="text-sm font-medium" style="color: var(--ion-text-color)">Form Inputs</h3>
              <ion-input mode="md" label="Full Name" label-placement="floating" placeholder="Enter your name" fill="outline"></ion-input>
              <ion-textarea mode="md" label="Bio" label-placement="floating" placeholder="Tell us about yourself" fill="outline" rows="3"></ion-textarea>
            </div>

            <ion-list mode="md">
              <ion-radio-group value="option1">
                <ion-item mode="md"><ion-radio mode="md" value="option1">Option One</ion-radio></ion-item>
                <ion-item mode="md"><ion-radio mode="md" value="option2">Option Two</ion-radio></ion-item>
              </ion-radio-group>
            </ion-list>

            <div class="px-2">
              <ion-range mode="md" aria-label="Volume" min="0" max="100" value="50" pin="true">
                <ion-icon name="volume-low-outline" slot="start"></ion-icon>
                <ion-icon name="volume-high-outline" slot="end"></ion-icon>
              </ion-range>
            </div>

            <div class="px-2 space-y-2">
              <ion-progress-bar mode="md" value="0.65"></ion-progress-bar>
              <ion-progress-bar mode="md" type="indeterminate"></ion-progress-bar>
            </div>

            <div class="flex flex-wrap gap-2 px-2">
              <ion-chip mode="md" color="primary"><ion-icon name="star"></ion-icon><ion-label>Primary</ion-label></ion-chip>
              <ion-chip mode="md" color="secondary"><ion-label>Secondary</ion-label></ion-chip>
              <ion-chip mode="md" color="success"><ion-icon name="checkmark-circle"></ion-icon><ion-label>Success</ion-label></ion-chip>
              <ion-chip mode="md" color="danger"><ion-icon name="close-circle"></ion-icon><ion-label>Danger</ion-label></ion-chip>
            </div>

            <ion-accordion-group mode="md">
              <ion-accordion value="first" mode="md">
                <ion-item slot="header" mode="md"><ion-label>Accordion Item 1</ion-label></ion-item>
                <div class="px-4 py-2" slot="content">Content for the first accordion item.</div>
              </ion-accordion>
              <ion-accordion value="second" mode="md">
                <ion-item slot="header" mode="md"><ion-label>Accordion Item 2</ion-label></ion-item>
                <div class="px-4 py-2" slot="content">Content for the second accordion item.</div>
              </ion-accordion>
            </ion-accordion-group>

            <ion-tab-bar mode="md">
              <ion-tab-button mode="md" selected><ion-icon name="home-outline"></ion-icon><ion-label>Home</ion-label></ion-tab-button>
              <ion-tab-button mode="md"><ion-icon name="search-outline"></ion-icon><ion-label>Search</ion-label></ion-tab-button>
              <ion-tab-button mode="md"><ion-icon name="heart-outline"></ion-icon><ion-label>Favorites</ion-label><ion-badge color="danger">3</ion-badge></ion-tab-button>
              <ion-tab-button mode="md"><ion-icon name="person-outline"></ion-icon><ion-label>Profile</ion-label></ion-tab-button>
            </ion-tab-bar>
            </div>
          }
          </div>

          @if (previewPlatform() === 'ios') {
            <div class="phone-home-indicator"></div>
          } @else {
            <div class="phone-nav-bar"></div>
          }
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

    for (const name of IONIC_COLOR_NAMES) {
      const hex = activeColors[name];
      if (!hex) continue;
      const vars = generateIonicColorVariables(name, hex);
      for (const [varName, varValue] of Object.entries(vars)) {
        styles.push(`${varName}: ${varValue}`);
      }
    }

    const bg = isDark ? dark.backgroundColor : theme.backgroundColor;
    const text = isDark ? dark.textColor : theme.textColor;
    styles.push(`--ion-background-color: ${bg}`);
    styles.push(`--ion-text-color: ${text}`);
    styles.push(`background-color: ${bg}`);
    styles.push(`color: ${text}`);
    styles.push(`font-family: ${theme.fontFamily}`);
    styles.push(`--ion-font-family: ${theme.fontFamily}`);

    styles.push(`--ion-toolbar-background: ${isDark ? dark.toolbarBackground : theme.toolbarBackground}`);
    styles.push(`--ion-toolbar-color: ${isDark ? dark.toolbarColor : theme.toolbarColor}`);
    styles.push(`--ion-toolbar-border-color: ${isDark ? dark.toolbarBorderColor : theme.toolbarBorderColor}`);

    styles.push(`--ion-item-background: ${isDark ? dark.itemBackground : theme.itemBackground}`);
    styles.push(`--ion-item-border-color: ${isDark ? dark.itemBorderColor : theme.itemBorderColor}`);

    styles.push(`--ion-card-background: ${isDark ? dark.cardBackground : theme.cardBackground}`);

    styles.push(`--ion-tab-bar-background: ${isDark ? dark.tabBarBackground : theme.tabBarBackground}`);
    styles.push(`--ion-tab-bar-border-color: ${theme.tabBarBorderColor}`);
    styles.push(`--ion-tab-bar-color: ${isDark ? dark.tabBarColor : theme.tabBarColor}`);
    styles.push(`--ion-tab-bar-color-selected: ${isDark ? dark.tabBarColorSelected : theme.tabBarColorSelected}`);

    styles.push(`--ion-border-color: ${isDark ? dark.borderColor : theme.borderColor}`);
    styles.push(`--ion-placeholder-color: ${theme.placeholderColor}`);
    styles.push(`--ion-backdrop-color: ${theme.backdropColor}`);
    styles.push(`--ion-backdrop-opacity: ${theme.backdropOpacity}`);

    return styles.join('; ');
  });
}
