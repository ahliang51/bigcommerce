import { CartProvider } from './../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { CurrencyPipe } from '@angular/common';
import { Storage } from '@ionic/storage';



/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  productId;
  productDetails;
  containResult = false;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private productService: ProductProvider,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private cartService: CartProvider) {
    this.productId = navParams.get("productId")
    console.log(this.productId)
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();
    // console.log(this.productId)

    this.productService.retrieveProductDetails(this.productId).subscribe(result => {
      // console.log(data)
      this.productDetails = result.data;
      loading.dismiss();
      this.containResult = true;
      // console.log(JSON.stringify(this.productDetails))
      this.productDetails.images.sort((a, b) => {
        return b.is_thumbnail - a.is_thumbnail
      })
    })
  }

  onAddToCart() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });
    loading.present();

    let toast = this.toastCtrl.create({
      message: 'Added To Cart',
      duration: 2000,
      position: 'bottom'
    });

    this.storage.get('cart').then(result => {
      // console.log(JSON.stringify(result))
      //There is a cart already
      if (result) {
        this.storage.get('cart').then(cart => {
          // Add item to cart
          let item = [{
            "quantity": 1,
            "product_id": this.productId
          }
          ]
          this.cartService.addToCart(cart, item).subscribe(data => {
            // console.log(JSON.stringify(data));
            loading.dismiss();
            toast.present();
            this.navCtrl.pop();

          })
        })
      }
      //There are no cart
      else {
        this.storage.get('token').then(token => {
          let cart = [{
            "quantity": 1,
            "product_id": this.productId
          }
          ]
          this.cartService.createCart(token, cart).subscribe(result => {
            // console.log(JSON.stringify(result))
            this.storage.set('cart', result.data.id)
            loading.dismiss();
            toast.present();
            this.navCtrl.pop();
          })
        })

      }
    })

  }

}
