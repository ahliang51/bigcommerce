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
    private toastCtrl: ToastController) {
    this.productId = navParams.get("productId")
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
      console.log(this.productDetails)
    })
  }

  onAddToCart() {

    this.storage.get('cart').then(result => {


      console.log(result)
      //There is a cart already
      if (result) {
        let itemExist = false;
        for (let item of result) {

          // There is such item in the cart already
          if (item.productId == this.productId) {
            console.log(item.quantity)
            item.quantity = item.quantity + 1; // there is problem here, quantity is not updated
            itemExist = true;
          }
        }
        //No such item in the cart

        if (!itemExist) {
          result.push({
            "productName": this.productDetails.name,
            "productId": this.productId,
            "quantity": 1,
            "imagesUrl": this.productDetails.images[0].url_thumbnail,
            "price": this.productDetails.price
          })
        }
        this.storage.set('cart', result);

      }
      //There are no cart
      else {
        this.storage.set('cart',
          [{
            "productName": this.productDetails.name,
            "productId": this.productId,
            "quantity": 1,
            "imagesUrl": this.productDetails.images[0].url_thumbnail,
            "price": this.productDetails.price
          }]
        )
      }
    })

    let toast = this.toastCtrl.create({
      message: 'Added To Cart',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    this.navCtrl.pop();
  }

}
