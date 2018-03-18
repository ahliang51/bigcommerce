import { CartProvider } from './../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfileProvider } from '../../providers/profile/profile';


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
  storeCredit;
  creditBalance = 0.00;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cartService: CartProvider,
    private profileService: ProfileProvider) {

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
    // console.log(this.cartArray)
    this.cartArray = [];
    this.cartSize = '';

    //Initialise back to 0
    this.totalAmount = 0.00;

    // Loading
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });
    loading.present();
    this.storage.get('cart').then(cart => {
      if (cart) {
        this.cartService.retrieveCart(cart).subscribe(result => {
          // console.log(JSON.stringify(result))
          if (result) {
            this.cartArray = result.data.line_items.physical_items
          }
          this.cartSize = this.cartArray.length;
          this.totalAmount = result.data.cart_amount;
          this.storage.get('token').then(token => {
            this.profileService.retrieveProfile(token).subscribe(data => {
              // console.log(JSON.stringify(data))
              this.storeCredit = data.result.store_credit;
              this.creditBalance = parseFloat(this.storeCredit) - this.totalAmount;
              loading.dismiss();
            })
          })
        })
      }
    })




    console.log(this.storeCredit)
  }

  onRemove(index) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Remove',
      message: 'Do you want to remove this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            if (this.cartArray.length > 1) {
              this.storage.get('cart').then(cart => {
                this.cartService.removeItem(cart, this.cartArray[index].id).subscribe(result => {
                })
              })
            }
            else {
              this.storage.remove('cart');
            }
            this.ionViewWillEnter();

          }
        }
      ]
    });
    alert.present();



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

        this.storage.get('cart').then(cart => {
          this.cartService.updateCart(cart, this.cartArray[index].id, this.cartArray[index].product_id, data).subscribe(result => {
            this.ionViewWillEnter();
          })

        })

        // this.cartArray[index].quantity = data;
        // this.storage.set('cart', this.cartArray).then(() => {
        //   this.ionViewWillEnter();
        // });
      }
    });
    alert.present().then(() => {
      this.testradioOpen = true;
    });
  }

}
