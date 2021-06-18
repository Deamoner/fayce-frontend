import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ETHIC, PRIVACY_POLICY, TERMS_OF_USE } from './constant/content';

@Component( {
    selector: 'app-content',
    templateUrl: './content.page.html',
    styleUrls: [ './content.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ContentPage implements OnInit {
    public content : string;
    public title : string;
    constructor(
        private activeRoute : ActivatedRoute,
    ) {
    }

    public ngOnInit() : void {
        this.activeRoute.params.subscribe( ( res : any ) => {
            if ( res ) {
                if ( res.pageId === 'ethics' ) {
                    this.title = 'Ethics';
                    this.content = ETHIC;
                } else if ( res.pageId === 'terms-of-use' ) {
                    this.title = 'Terms of use';
                    this.content = TERMS_OF_USE;
                } else if ( res.pageId === 'privacy-policy' ) {
                    this.title = 'Privacy Policy';
                    this.content = PRIVACY_POLICY;
                }
            }
        } );
    }

}
