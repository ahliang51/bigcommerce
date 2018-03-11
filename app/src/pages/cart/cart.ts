import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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

  testradioOpen: boolean;
  testradioResult;
  cartArray = [];
  totalAmount = 0.00;
  quantity;
  cartSize;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

    this.quantity = [{
      name: 'col1',
      options: [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' }
      ]
    }]
  }

  ionViewWillEnter() {
    console.log(this.cartArray)
    this.cartArray = [];
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

      this.cartSize = this.cartArray.length;
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
      this.storage.remove('cart').then(() => {
        this.ionViewWillEnter();
      })
    }
  }

  onEdit(index) {
    let alert = this.alertCtrl.create({
      title: 'Select Quantity',
    });

    alert.addInput({
      type: 'radio',
      label: '1',
      value: '1',
      checked: true
    });

    for (let i = 2; i <= 10; i++) {
      alert.addInput({
        type: 'radio',
        label: i.toString(),
        value: i.toString()
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Update',
      handler: data => {
        console.log('radio data:', data);
        this.testradioOpen = false;
        this.testradioResult = data;

        this.cartArray[index].quantity = data;
        this.storage.set('cart', this.cartArray).then(() => {
          this.ionViewWillEnter();
        });
      }
    });
    alert.present().then(() => {
      this.testradioOpen = true;
    });
  }

}
