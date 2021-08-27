import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { APP_ROUTES } from 'src/app/constants/APP_ROUTES';
import { environment } from 'src/environments/environment';
import { JobSubject } from 'src/interface/upload-image';

import { ToasterService } from '../toaster/toaster.service';

@Injectable( {
    providedIn: 'root',
} )
export class JobService {
    public jobSubject : BehaviorSubject<JobSubject> = new BehaviorSubject<JobSubject>( null );
    public job$ : Observable<JobSubject> = this.jobSubject.asObservable();
    public jobId : string;
    private baseUrl : string = 'fayce_jobs';
    public videoUploadUrl : string;
    public photoUploadUrl : string;

    public selectedImageUrl : string;
    public selectedVideoUrl : string | File;
    public startTime : number = 0;
    constructor(
        private http : HttpClient,
        private nav : NavController,
        private toaster : ToasterService,
    ) { }

    public createJob( payload : any ) : Observable<any> {
        const url : string = `${environment.API_URL}${this.baseUrl}`;
        return this.http.post( url, payload ).pipe(
            tap( ( res : any ) => {
                this.jobId = res.id;
                this.videoUploadUrl = res.videoURL;
                this.photoUploadUrl = res.photoURL;
            } ),
        );
    }

    get getInprogressJob() : JobSubject {
        return this.jobSubject.getValue();
    }

    public getJob( id : any ) : Observable<any> {
        const url : string = `${environment.API_URL}${this.baseUrl}/${id}`;
        return this.http.get( url );
    }

    public putJob( contentId? : number ) : Observable<any> {
        const url : string = `${environment.API_URL}${this.baseUrl}/${this.jobId}`;
        return this.http.put( url, {
            content_id: contentId,
            status: 'READY',
        } );
    }

    public uploadImage( url : string , payload : File | Blob ) : Observable<any> {
        return this.http.put( url, payload );
    }

    public keepCheckingJobStatus() : void {
        this.getJob( this.jobId ).subscribe( ( res : any ) => {
            if ( res && res.data && res.data.status !== 'FINISHED' ) {
                if ( res && res.data && res.data.status === 'ERROR' ) {
                    this.toaster.presentToast( 'Processing Error: Please Retry' );
                    this.jobSubject.next( {
                        jobId : '',
                        progress : '0',
                        isFinished : false,
                    } );
                    this.nav.navigateRoot( `${APP_ROUTES.LANDING}` );
                } else {
                    setTimeout( () => {
                        const jobDetails : JobSubject = this.jobSubject.getValue();
                        this.jobSubject.next( {
                            jobId : this.jobId,
                            progress : res.data.completition_stat,
                            isFinished : false,
                        } );
                        if ( this.startTime < 30 || res.data.status !== 'READY' ) {
                            this.keepCheckingJobStatus();
                            this.startTime += 5;
                        } else {
                            this.nav.navigateRoot( `${APP_ROUTES.LANDING}` );
                            this.toaster.presentToast( 'Process not working, Please try again later.' );
                            this.resetAll();
                        }
                    }, 5000 );
                }
            } else {
                this.toaster.presentToast( 'Your video is ready.' );
                this.jobSubject.next( {
                    jobId : '',
                    progress : res.data.completition_stat,
                    isFinished : true,
                } );
                this.nav.navigateRoot( `${APP_ROUTES.VIDEO}/${this.jobId}` );
                this.resetAll();
            }
        } );
    }

    public getJobs() : Observable<any> {
        const url : string = `${environment.API_URL}${this.baseUrl}/video_options`;
        return this.http.get( url );
    }

    public async startUploadImage() : Promise<Promise<any>> {
        const image : File = await this.createFile( this.selectedImageUrl );
        return this.uploadImage( this.photoUploadUrl, image ).toPromise();
    }

    public async startUploadVideo() : Promise<void> {
        if ( typeof this.selectedVideoUrl === 'string' ) {
            const image : File = await this.createFile( this.selectedVideoUrl, 'video/mp4' );
            return this.uploadImage( this.videoUploadUrl, image ).toPromise();
        }
        return this.uploadImage( this.videoUploadUrl, this.selectedVideoUrl ).toPromise();
    }

    public async createFile( url : string, type : string = 'image/png' ) : Promise<File> {
        const fileName : string =  ( type === 'image/png' ) ? '1.png' : '1.mp4';
        let data : any ;
        const response : any = await fetch( url );
        data = await response.blob();
        const metadata : any = {
            type,
        };
        return new File( [ data ], `${fileName}`, metadata );

    }

    public resetAll() : void {
        this.jobId = undefined;
        this.selectedImageUrl = undefined;
        this.selectedVideoUrl = undefined;
        this.photoUploadUrl = undefined;
        this.videoUploadUrl = undefined;
    }

}
