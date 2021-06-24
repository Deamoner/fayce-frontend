import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CameraPreview, CameraPreviewDimensions, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';

import { APP_ROUTES } from 'src/app/constants/APP_ROUTES';
import { JobService } from 'src/app/services/job/job.service';

@Component( {
    selector: 'app-camera-preview',
    templateUrl: './camera-preview.component.html',
    styleUrls: [ './camera-preview.component.scss' ],
    changeDetection : ChangeDetectionStrategy.OnPush,
} )
export class CameraPreviewComponent implements AfterViewInit, OnDestroy {
    @Input() public photoUrl : string ;
    public hideHint : boolean = Boolean( false );
    public videoUrl : string | SafeResourceUrl;
    public timer : number = 4;
    public seconds : number = 20;
    public isRecording : boolean = false;
    public showLoader : number = 0;
    @ViewChild( 'selectVideo' ) public selectVideo : ElementRef;
    public isWeb : boolean = Boolean( false );
    constructor(
        private modalCtrl : ModalController,
        private cameraPreview : CameraPreview,
        private cd : ChangeDetectorRef,
        private platform : Platform,
        private jobService : JobService,
        private navCtrl : NavController,
        private dom : DomSanitizer,
    ) {
        this.isWeb = !this.platform.is( 'capacitor' );
    }

    public ngAfterViewInit() : void {
        if ( this.platform.is( 'cordova' ) ) {
            document.getElementsByTagName( 'html' )[ 0 ].classList.add( 'camera-preview-start' );
            this.startCameraStream();
        }

    }

    public async ngOnDestroy() : Promise<void> {
        if ( this.platform.is( 'cordova' ) ) {
            document.getElementsByTagName( 'html' )[ 0 ].classList.remove( 'camera-preview-start' );
            if ( this.isRecording ) {
                await this.cameraPreview.stopRecordVideo();
            }
            await this.cameraPreview.stopCamera();
        }
    }

    public dismiss() : void {
        setTimeout( () => {
            this.modalCtrl.dismiss();
            this.jobService.selectedVideoUrl = undefined;
        }, 2000 );
    }

    private startCameraStream() : void {
        const cameraPreviewOpts : CameraPreviewOptions = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: this.cameraPreview.CAMERA_DIRECTION.FRONT,
            tapPhoto: true,
            previewDrag: true,
            toBack: true,
            alpha: 1,
        };
        this.cameraPreview.startCamera( cameraPreviewOpts );
    }

    public startTimer( fromView? : boolean ) : void {
        this.hideHint = true;
        this.videoUrl = undefined;
        if ( this.isWeb ) {
            return;
        }
        if ( fromView ) {
            this.timer = 4;
        }
        if ( this.timer > 0 ) {
            this.timer -= 1;
            this.cd.detectChanges();
            setTimeout( () => {
                this.startTimer();
            }, 1000 );
        } else {
            this.timer = 4;
            this.cd.detectChanges();
            this.startRecording();
        }
    }

    public startRecording() : void {
        this.videoUrl = undefined;
        if ( this.platform.is( 'cordova' ) ) {
            const videoOptions : any = {
                cameraDirection : this.cameraPreview.CAMERA_DIRECTION.FRONT,
                quality : 60,
                width: 1920,
                height: 1080,
                withFlash: false,
            };
            this.showLoader = 1;
            this.cameraPreview.startRecordVideo( videoOptions ).then( () => {
                this.showLoader = 2;
                setTimeout( () => {
                    this.showLoader = 0;
                    this.cd.detectChanges();
                }, 200 );
                this.seconds = 20;
                this.isRecording = true;
                this.runTimer();
                this.cd.detectChanges();
            } ).catch( ( e : any ) => console.log( e ) );
        } else {
            this.selectVideo.nativeElement.click();
        }
    }

    public stopVideoRecording() : void {
        this.cameraPreview.stopRecordVideo().then( ( res : string ) => {
            this.jobService.selectedVideoUrl = ( <any> window ).Ionic.WebView.convertFileSrc(  `file://${res}` );
            this.videoUrl = ( <any> window ).Ionic.WebView.convertFileSrc( `file://${res}` );
            this.cd.detectChanges();
        } ).catch( ( e : any ) => console.log( e ) );
    }

    public runTimer() : void {
        if ( this.seconds !== 0 && this.isRecording ) {
            setTimeout( () => {
                this.runTimer();
                this.hideHint = true;
                this.seconds--;
                this.cd.detectChanges();
            }, 1000 );
        }
        if ( this.seconds === 0 ) {
            this.isRecording = false;
            this.startRecording();
            this.cd.detectChanges();
        }
    }

    public videoSelected( ev : any ) : void {
        const file : File = this.selectVideo.nativeElement.files[ 0 ];
        const reader : FileReader = new FileReader();
        reader.addEventListener( 'load', ( event : any ) => {
            this.videoUrl = this.dom.bypassSecurityTrustResourceUrl( event.target.result );
            this.cd.detectChanges();
        } );
        reader.readAsDataURL( file );
        this.jobService.selectedVideoUrl = file;
        this.cd.detectChanges();
    }

    public next() : void {
        this.navCtrl.navigateRoot( `${APP_ROUTES.JOB_LOADER}/${this.jobService.jobId}` );
        this.modalCtrl.dismiss();
        document.getElementsByTagName( 'html' )[ 0 ].classList.remove( 'camera-preview-start' );
    }

}
