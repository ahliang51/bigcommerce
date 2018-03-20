import { CartPage } from './../cart/cart';
import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  url;
  paymentMade = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private inAppBrowser: InAppBrowser,
    private platform: Platform,
    private storage: Storage,
    private ref: ChangeDetectorRef) {
    this.url = navParams.get("url")
    console.log(this.url)
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.platform.ready().then(() => {
      let browser = this.inAppBrowser.create(this.url, '_blank', {
        location: 'no',
        zoom: 'no'
      });

      browser.on('exit').subscribe(result => {
        // this.navCtrl.setRoot(CartPage);
      })

      browser.on('loadstart').subscribe(event => {
        if (event.url.includes("order-confirmation")) {
          this.paymentMade = true
          this.ref.detectChanges(); // Triggering change detection manully
          // browser.close();
          this.storage.remove('cart')
        }
      })
    })
  }

}
