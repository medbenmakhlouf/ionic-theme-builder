import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/theme-editor/theme-editor').then(
        (m) => m.ThemeEditorComponent
      ),
  },
];
