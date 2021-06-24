import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import smartcrop from 'smartcrop';

declare var tracking : any;

import { CameraPreviewComponent } from 'src/app/components/camera-preview/camera-preview.component';
import { APP_ROUTES } from 'src/app/constants/APP_ROUTES';
import { JobService } from 'src/app/services/job/job.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component( {
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: [ './landing.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class LandingPage implements OnInit {
    public acceptTerms : boolean = Boolean( false );
    public imageSelected : BehaviorSubject<SafeResourceUrl> = new BehaviorSubject( null );
    public showImageLoader : BehaviorSubject<boolean> = new BehaviorSubject( false );

    @ViewChild( 'imageRef' ) public imageRef : ElementRef;

    public disabled : boolean = Boolean( false );

    constructor(
        private domSanitizer : DomSanitizer,
        private toasterService : ToasterService,
        private modalCtrl : ModalController,
        private jobService : JobService,
        private navCtrl : NavController,
        private cd : ChangeDetectorRef,
    ) { }

    public ngOnInit() : void {
        const payload : any = {
            photos: [ '1.png' ],
            video: '1.mp4',
        };
        this.jobService.createJob( payload ).subscribe();
    }

    public async uploadImage() : Promise<void> {
        if ( this.acceptTerms ) {
            const image : Photo = await Camera.getPhoto( {
                quality: 90,
                allowEditing: false,
                source: CameraSource.Photos,
                resultType: CameraResultType.Uri,
            } );
            this.jobService.selectedImageUrl = image.webPath;
            this.imageSelected.next( this.domSanitizer.bypassSecurityTrustResourceUrl( image.webPath ) );
            this.edit();
        } else {
            this.toasterService.presentToast( 'Accept terms of use and privacy policy.' );
        }
    }

    public async edit() : Promise<void> {
        this.showImageLoader.next( true );
        setTimeout( () => {
            const tracker : any = new tracking.ObjectTracker( 'face' );
            tracking.track( this.imageRef.nativeElement, tracker );
            tracker.on( 'track', ( event : any ) => {
                if ( event.data && event.data.length ) {
                    const boost : any[] = event.data.map( ( face : any ) => {
                        return {
                            x: face.x,
                            y: face.y,
                            width: face.width,
                            height: face.height,
                            weight: 1.0,
                        };
                    } );
                    smartcrop.crop( this.imageRef.nativeElement, { boost, width: 400, height: 400, minScale :  1 } ).then( ( result : any ) => {
                        const canvas : HTMLCanvasElement = document.createElement( 'canvas' );
                        canvas.width = 400;
                        canvas.height = 400;
                        const ctx : any = canvas.getContext( '2d' );
                        const crop : any = result.topCrop;
                        ctx.drawImage(
                        this.imageRef.nativeElement,
                        crop.x,
                        crop.y,
                        crop.width,
                        crop.height,
                        0,
                        0,
                        canvas.width,
                        canvas.width,
                    );
                        this.imageSelected.next( canvas.toDataURL( 'image/png' ) );
                        this.jobService.createFile( canvas.toDataURL( 'image/png' ) );
                        this.jobService.selectedImageUrl = canvas.toDataURL( 'image/png' );
                        this.showImageLoader.next( false );
                    } );
                } else {
                    this.imageSelected.next( null );
                    this.showImageLoader.next( false );
                    this.toasterService.presentToast( 'Not able to detect face in image, Select different image.' );
                }
            } );

        }, 500 );
    }

    public async next() : Promise<void> {
        this.disabled = true;
        this.cd.detectChanges();
        const modalRef : HTMLIonModalElement = await this.modalCtrl.create( {
            component : CameraPreviewComponent,
            componentProps : {
                photoUrl : this.imageSelected.getValue(),
            },
        } );
        modalRef.present();
        modalRef.onDidDismiss().then( () => {
            setTimeout( () => {
                this.disabled = false;
                this.cd.detectChanges();
            }, 2000 );
        } );
    }

    public goToContent ( id : string ) : void {
        this.navCtrl.navigateForward( [ `/${APP_ROUTES.CONTENT}/${id}` ] );
    }
}
