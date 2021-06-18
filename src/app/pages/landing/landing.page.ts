import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component( {
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: [ './landing.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class LandingPage implements OnInit {
    public acceptTerms : boolean = Boolean( false );
    public imageSelected : string = 'assets/images/Floyd_Mayweather.jpg';
    constructor() { }

    public ngOnInit() : void {
    }
}
