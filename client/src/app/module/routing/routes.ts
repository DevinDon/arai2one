// src/app/module/routing/routes.ts

import { Route } from '@angular/router';

export interface Navigation {
  icon: string;
  link: string[];
  tip: string;
}

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    loadChildren: () => import('../../page/list/list.module').then(m => m.ListModule)
  }
];
