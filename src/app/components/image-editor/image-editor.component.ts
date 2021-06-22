import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { CropperComponent } from 'angular-cropperjs';

@Component( {
    selector: 'app-image-editor',
    templateUrl: './image-editor.component.html',
    styleUrls: [ './image-editor.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ImageEditorComponent implements AfterViewInit {
    @Input() public imageUrl : string;
    @ViewChild( 'angularCropper' ) public angularCropper : CropperComponent;
    public showCanvas : boolean = Boolean( false );
    constructor(
        private modalCtrl : ModalController,
        private cd : ChangeDetectorRef,
    ) { }

    public ngAfterViewInit() : void {
        setTimeout( () => {
            this.showCanvas = true;
            this.cd.detectChanges();
        }, 400 );
    }

    public save() : void {
        this.modalCtrl.dismiss( this.angularCropper.cropper.getCroppedCanvas().toDataURL( 'image/png' ) );
    }

}
