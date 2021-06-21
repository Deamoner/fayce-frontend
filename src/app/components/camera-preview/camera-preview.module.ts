import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CameraPreviewComponent } from './camera-preview.component';

@NgModule( {
    declarations: [ CameraPreviewComponent ],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [ CameraPreviewComponent ],
} )
export class CameraPreviewModule { }
