import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { JobLoaderPageRoutingModule } from './job-loader-routing.module';
import { JobLoaderPage } from './job-loader.page';

@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        JobLoaderPageRoutingModule,
    ],
    declarations: [ JobLoaderPage ],
} )
export class JobLoaderPageModule {}
