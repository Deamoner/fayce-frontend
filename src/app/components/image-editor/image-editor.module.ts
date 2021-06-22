import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { ImageEditorComponent } from './image-editor.component';

@NgModule( {
    declarations: [ ImageEditorComponent ],
    imports: [
        CommonModule,
        IonicModule,
        AngularCropperjsModule,
    ],
    exports: [
        ImageEditorComponent,
    ],
} )
export class ImageEditorModule { }
