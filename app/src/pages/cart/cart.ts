import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartArray = [];
  totalAmount = 0.00;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {
    console.log(this.cartArray)

    //Initialise back to 0
    this.totalAmount = 0.00;

    // Loading
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    //Retrieve Data
    this.storage.get('cart').then(result => {
      // If there is data then assign to cartArray, if not dont assign anything
      if (result) {
        this.cartArray = result;
      }
      console.log(this.cartArray)
    }).then(() => {
      //Calculate total amount
      for (let amount of this.cartArray) {
        this.totalAmount = this.totalAmount + (amount.price * amount.quantity);
        console.log(this.totalAmount)
      }

      loading.dismiss();
    })
  }

  onRemove(index) {
    if (this.cartArray.length > 1) {
      this.totalAmount = this.totalAmount - this.cartArray[index].price;
      this.cartArray.splice(index, 1);
      this.storage.set('cart', this.cartArray).then(() => {
        this.ionViewWillEnter();
      });
    }
    else {
      // Loading
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.storage.remove('cart').then(() => {
        loading.dismiss();
      })
    }
  }

}
