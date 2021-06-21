import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CameraPreviewModule } from 'src/app/components/camera-preview/camera-preview.module';

import { LandingPageRoutingModule } from './landing-routing.module';
import { LandingPage } from './landing.page';

@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LandingPageRoutingModule,
        CameraPreviewModule,
    ],
    declarations: [ LandingPage ],
} )
export class LandingPageModule {}
