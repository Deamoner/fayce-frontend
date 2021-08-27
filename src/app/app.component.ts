import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { APP_ROUTES } from './constants/APP_ROUTES';
@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class AppComponent {
    constructor(
        private navCtrl : NavController,
    ) {}

    public goToSetting() : void {
        this.navCtrl.navigateForward( [ `/${APP_ROUTES.SUPPORT}` ] );
    }

    public goToContent ( id : string ) : void {
        this.navCtrl.navigateForward( [ `/${APP_ROUTES.CONTENT}/${id}` ] );
    }

    public goToRoot() : void {
        this.navCtrl.navigateRoot( `/${APP_ROUTES.LANDING}` );
    }
}
