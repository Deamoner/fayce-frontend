import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { APP_ROUTES } from './constants/APP_ROUTES';

const routes : Routes = [
    {
        path : '',
        redirectTo : APP_ROUTES.LANDING,
        pathMatch : 'full',
    },
    {
        path : 'landing',
        loadChildren : () => import( './pages/landing/landing.module' ).then( ( m : any ) => m.LandingPageModule ),
    },
];

@NgModule( {
    imports: [
        RouterModule.forRoot( routes, { preloadingStrategy: PreloadAllModules } ),
    ],
    exports: [ RouterModule ],
} )
export class AppRoutingModule {}
