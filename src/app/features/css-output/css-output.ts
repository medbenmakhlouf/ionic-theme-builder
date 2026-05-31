import {
  ChangeDetectionStrategy,
  Component,
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
        <h2 class="text-base font-semibold text-gray-900">Generated CSS</h2>
        <div class="flex gap-2">
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            [class]="copied()
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'"
            (click)="copyToClipboard()"
            [attr.aria-label]="copied() ? 'Copied!' : 'Copy CSS to clipboard'"
          >
            {{ copied() ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-xs font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 shadow-sm transition-colors cursor-pointer"
            (click)="downloadCss()"
            aria-label="Download CSS file"
          >
            ⬇ Download
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <pre
          class="h-full overflow-auto p-5 bg-[#1e1e2e] text-[#cdd6f4] text-xs font-mono leading-relaxed selection:bg-indigo-800/40"
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
