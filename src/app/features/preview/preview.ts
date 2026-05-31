import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
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
      <h2 class="text-lg font-semibold text-gray-900 mb-3">Live Preview</h2>

      <div
        class="flex-1 overflow-auto rounded-lg border border-gray-200 bg-white"
        [style]="previewStyles()"
      >
        <div class="ionic-preview p-4 space-y-4">
          <!-- Toolbar preview -->
          <ion-toolbar>
            <ion-title>My App</ion-title>
            <ion-buttons slot="end">
              <ion-button>
                <ion-icon name="settings-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>

          <!-- Buttons -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium px-2" style="color: var(--ion-text-color)">
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
            </div>
          </div>

          <!-- Card -->
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
              <ion-card-title>Card Title</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              This is a sample card with content to preview your theme.
            </ion-card-content>
          </ion-card>

          <!-- List -->
          <ion-list>
            <ion-item>
              <ion-label>Item One</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Item Two</ion-label>
              <ion-badge slot="end" color="primary">99+</ion-badge>
            </ion-item>
            <ion-item>
              <ion-toggle>Toggle Option</ion-toggle>
            </ion-item>
          </ion-list>

          <!-- Input -->
          <div class="px-2 space-y-2">
            <ion-input
              label="Email"
              label-placement="floating"
              type="email"
              placeholder="Enter email"
              fill="outline"
            ></ion-input>
            <ion-input
              label="Password"
              label-placement="floating"
              type="password"
              placeholder="Enter password"
              fill="outline"
            ></ion-input>
          </div>

          <!-- Chips -->
          <div class="flex flex-wrap gap-2 px-2">
            <ion-chip color="primary">
              <ion-label>Primary</ion-label>
            </ion-chip>
            <ion-chip color="secondary">
              <ion-label>Secondary</ion-label>
            </ion-chip>
            <ion-chip color="success">
              <ion-label>Success</ion-label>
            </ion-chip>
            <ion-chip color="danger">
              <ion-label>Danger</ion-label>
            </ion-chip>
          </div>

          <!-- Tab Bar -->
          <ion-tab-bar>
            <ion-tab-button>
              <ion-icon name="home-outline"></ion-icon>
              <ion-label>Home</ion-label>
            </ion-tab-button>
            <ion-tab-button>
              <ion-icon name="search-outline"></ion-icon>
              <ion-label>Search</ion-label>
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

  protected readonly previewStyles = computed(() => {
    const theme = this.themeService.globalTheme();
    const components = this.themeService.componentThemes();
    const styles: string[] = [];

    // Color variables
    for (const name of IONIC_COLOR_NAMES) {
      const hex = theme.colors[name];
      if (!hex) continue;
      const vars = generateIonicColorVariables(name, hex);
      for (const [varName, varValue] of Object.entries(vars)) {
        styles.push(`${varName}: ${varValue}`);
      }
    }

    // Global variables
    styles.push(`--ion-background-color: ${theme.backgroundColor}`);
    styles.push(`--ion-text-color: ${theme.textColor}`);
    styles.push(`--ion-font-family: ${theme.fontFamily}`);
    styles.push(`--ion-toolbar-background: ${theme.toolbarBackground}`);
    styles.push(`--ion-toolbar-color: ${theme.toolbarColor}`);
    styles.push(`--ion-item-background: ${theme.itemBackground}`);
    styles.push(`--ion-card-background: ${theme.cardBackground}`);
    styles.push(`background-color: ${theme.backgroundColor}`);
    styles.push(`color: ${theme.textColor}`);

    return styles.join('; ');
  });
}
