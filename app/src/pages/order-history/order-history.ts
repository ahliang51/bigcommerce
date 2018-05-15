import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';

/**
 * Generated class for the OrderHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  customerEcommerceId;
  ordersObject = {};
  Object = Object; // For looping through orders object

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private profileService: ProfileProvider) {
    this.customerEcommerceId = navParams.get("customerEcommerceId")
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();

    this.profileService.retrieveOrderHistory(this.customerEcommerceId).subscribe(data => {
      console.log(JSON.stringify(data))
      if (data.success) {
        this.ordersObject = data.result
      }
      loading.dismiss();
    })
  }

}
