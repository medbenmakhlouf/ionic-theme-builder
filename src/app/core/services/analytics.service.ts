import { Injectable, inject, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare let gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly trackingId = isDevMode() ? 'G-XXXXXXXXXX' : 'G-0S96RRYDWK';

  init(): void {
    if (!this.trackingId || this.trackingId === 'G-XXXXXXXXXX') {
      return;
    }

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
}
