import { Routes } from '@angular/router';

export const routes: Routes = [{
	path: '',
	loadComponent: () => import('./components/home-page/home-page.component').then((module) => module.HomePageComponent)
}];
