import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CartProvider } from './../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfileProvider } from '../../providers/profile/profile';
import { OrderPage } from '../order/order';


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
  orderButton = false;
  rootNavCtrl: NavController;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cartService: CartProvider,
    private profileService: ProfileProvider,
    private inAppBrowser: InAppBrowser,
    private platform: Platform, ) {

    this.quantity = [{
      name: 'col1',
      options: [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' }
      ]
    }]
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ionViewDidEnter() {
    // console.log(this.cartArray)
    this.cartArray = [];
    this.cartSize = '';
    this.orderButton = false;

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
            console.log(JSON.stringify(this.cartArray))
          }
          this.cartSize = this.cartArray.length;
          this.totalAmount = result.data.cart_amount;
          this.storage.get('token').then(token => {
            this.profileService.retrieveProfile(token).subscribe(data => {
              // console.log(JSON.stringify(data))
              this.storeCredit = data.result.store_credit;
              this.creditBalance = parseFloat(this.storeCredit) - this.totalAmount;
              if (this.creditBalance < 0) {
                this.orderButton = true;
              }
              loading.dismiss();
            })
          })
        })
      }
      else {
        loading.dismiss();
      }
    })
  }

  onRemove(index) {
    //Creating a local variable to store cart array due to nested callback
    let localCart = [];
    localCart = this.cartArray;

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
              // console.log(JSON.stringify(this.cartArray))
              this.storage.get('cart').then(cart => {
                this.cartService.removeItem(cart, localCart[index].id).subscribe(result => {
                  // console.log(JSON.stringify(result))
                  this.ionViewDidEnter();

                })
              })
            }
            else {
              this.storage.remove('cart');
              this.ionViewDidEnter();
            }

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
            this.ionViewDidEnter();
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

  checkOut() {
    let paymentMade = false;
    this.storage.get('cart').then(cartId => {
      this.storage.get('token').then(token => {
        this.cartService.placeOrder(token, cartId).subscribe(data => {
          // console.log(JSON.stringify(data))
          this.platform.ready().then(() => {
            let browser = this.inAppBrowser.create(data.result, '_blank', {
              location: 'no',
              zoom: 'no'
            });

            browser.on('exit').subscribe(result => {
              // this.navCtrl.setRoot(CartPage);
              if (paymentMade) {
                this.ionViewDidEnter();
              }
            })

            browser.on('loadstart').subscribe(event => {
              if (event.url.includes("order-confirmation")) {
                paymentMade = true
                this.storage.remove('cart')
              }
            })
          })
        })
      })
    })
  }

}
