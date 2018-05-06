import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';

/**
 * Generated class for the EventComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@IonicPage()
@Component({
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventPage {

  eventArray = [];

  constructor(private eventService: EventProvider,
    private loadingCtrl: LoadingController, ) {
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();
    this.eventService.retrieveEventPosting().subscribe(result => {
      console.log(JSON.stringify(result))
      this.eventArray = result;
      loading.dismiss();
    })
  }
}
