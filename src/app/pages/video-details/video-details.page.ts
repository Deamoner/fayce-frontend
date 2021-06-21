import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';

import { APP_ROUTES } from 'src/app/constants/APP_ROUTES';
import { JobService } from 'src/app/services/job/job.service';

@Component( {
    selector: 'app-video-details',
    templateUrl: './video-details.page.html',
    styleUrls: [ './video-details.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class VideoDetailsPage implements OnInit {
    public videoUrl : string;
    public videoId : string;
    constructor(
        private navCtrl : NavController,
        private route : ActivatedRoute,
        private jobService : JobService,
        private cd : ChangeDetectorRef,
    ) { }

    public ngOnInit() : void {
        this.route.params.subscribe( ( params : any ) => {
            this.videoId = params.videoId;
            this.jobService.getJob( this.videoId ).subscribe( ( res : any ) => {
                this.videoUrl = res.data.output;
                this.cd.detectChanges();
            } );
        } );
    }

    public async share() : Promise<void> {
        await Share.share( {
            title: 'Fayce',
            text: 'FAYCE APP, REALISTIC FACE CONTROL VIDEOS!',
            url: 'https://www.wix.com/feedback-ng/feedback/0975c75f-270c-4fd0-92b3-4cf57218a4c3',
            dialogTitle: 'Share with buddies',
        } );
    }

    public goToHome() : void {
        this.navCtrl.navigateRoot( APP_ROUTES.LANDING );
    }

    public async goToDownload() : Promise<void> {
        await Browser.open( { url: 'http://capacitorjs.com/' } );
    }

}
