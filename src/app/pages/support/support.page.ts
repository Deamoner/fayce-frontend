import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component( {
    selector: 'app-support',
    templateUrl: './support.page.html',
    styleUrls: [ './support.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class SupportPage implements OnInit {

    constructor() { }

    public ngOnInit() : void {
    }

}
