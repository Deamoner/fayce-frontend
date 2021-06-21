import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable( {
    providedIn: 'root',
} )
export class ToasterService {
    constructor(
        private toastController : ToastController,
    ) { }

    public async presentToast( message : string, color : string = 'dark', duration : number = 2000 ) : Promise<void> {
        const toast : any = await this.toastController.create( {
            message,
            color,
            duration,
            id : `app-toast-message-${color}`,
        } );
        toast.present();
    }

    public async presentToastWithButton( message : string, color : string = 'dark', position : any = 'top' ) : Promise<void> {
        const toast : HTMLIonToastElement = await this.toastController.create( {
            message,
            color,
            position,
            buttons: [
                { text : 'Dismiss', handler: () => toast.dismiss() },
            ],
        } );
        toast.present();
    }
}
