import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare let gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly trackingId = isDevMode() ? 'G-XXXXXXXXXX' : 'G-0S96RRYDWK';

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.trackingId || this.trackingId === 'G-XXXXXXXXXX') return;

    this.loadGtagScript();

    // Track page navigations
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.pageView((event as NavigationEnd).urlAfterRedirects);
      });
  }

  pageView(path: string): void {
    if (typeof gtag === 'undefined') return;
    gtag('config', this.trackingId, { page_path: path });
  }

  event(action: string, category: string, label?: string, value?: number): void {
    if (typeof gtag === 'undefined') return;
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }

  private loadGtagScript(): void {
    const win = this.document.defaultView as unknown as Record<string, unknown> | null;
    if (!win) return;

    // Initialize dataLayer and gtag function
    win['dataLayer'] = win['dataLayer'] || [];
    win['gtag'] = function (...args: unknown[]) {
      (win['dataLayer'] as unknown[]).push(args);
    };
    gtag('js', new Date());
    gtag('config', this.trackingId);

    // Load the gtag.js script async
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    this.document.head.appendChild(script);
  }
}
