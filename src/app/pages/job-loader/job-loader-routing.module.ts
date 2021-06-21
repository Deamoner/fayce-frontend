import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobLoaderPage } from './job-loader.page';

const routes : Routes = [
    {
        path: '',
        component: JobLoaderPage,
    },
];

@NgModule( {
    imports: [ RouterModule.forChild( routes ) ],
    exports: [ RouterModule ],
} )
export class JobLoaderPageRoutingModule {}
