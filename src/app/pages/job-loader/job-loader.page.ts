import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { JobService } from 'src/app/services/job/job.service';

@Component( {
    selector: 'app-job-loader',
    templateUrl: './job-loader.page.html',
    styleUrls: [ './job-loader.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class JobLoaderPage implements OnInit {

    constructor(
        public jobService : JobService,
    ) { }

    public ngOnInit() : void {
        this.start();
    }

    public async start() : Promise<void> {
        if ( this.jobService.jobId ) {
            await this.jobService.startUploadImage();
            await this.jobService.startUploadVideo();
            this.jobService.putJob().subscribe( () => {
                this.jobService.startTime = 0;
                this.jobService.keepCheckingJobStatus();
            } );
        }
    }
}
