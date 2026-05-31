import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-css-output',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="h-full flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900">Generated CSS</h2>
        <div class="flex gap-2">
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            (click)="copyToClipboard()"
            [attr.aria-label]="copied() ? 'Copied!' : 'Copy CSS to clipboard'"
          >
            {{ copied() ? '✓ Copied' : 'Copy' }}
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors cursor-pointer"
            (click)="downloadCss()"
            aria-label="Download CSS file"
          >
            Download
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden rounded-lg border border-gray-200">
        <pre
          class="h-full overflow-auto p-4 bg-gray-900 text-green-400 text-xs font-mono leading-relaxed"
          role="region"
          aria-label="Generated CSS output"
          tabindex="0"
        >{{ css() }}</pre>
      </div>
    </section>
  `,
})
export class CssOutputComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly css = this.themeService.generatedCss;
  protected readonly copied = signal(false);

  protected copyToClipboard(): void {
    navigator.clipboard.writeText(this.css()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  protected downloadCss(): void {
    const blob = new Blob([this.css()], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ionic-theme.css';
    a.click();
    URL.revokeObjectURL(url);
  }
}
