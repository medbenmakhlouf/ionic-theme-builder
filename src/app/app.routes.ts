import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Ionic Theme Builder — Generate Custom Ionic, Capacitor & Cordova Themes',
    loadComponent: () =>
      import('./features/theme-editor/theme-editor').then((m) => m.ThemeEditorComponent),
  },
];
