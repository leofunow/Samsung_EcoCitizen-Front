import { Routes } from '@angular/router';
import { TableComponent } from './pages/table/table.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/map' },
  { path: 'map', component: WelcomeComponent },
  { path: 'table', component: TableComponent },
];
