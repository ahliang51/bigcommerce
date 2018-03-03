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
  productDetails = [];
  containResult = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private productService: ProductProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController) {
    this.productId = navParams.get("productId")
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    console.log('ionViewDidLoad ProductDetailPage');
    console.log(this.productId)

    this.productService.retrieveProductDetails(this.productId).subscribe(result => {
      // console.log(data)
      this.productDetails = result.data;
      loading.dismiss();
      this.containResult = true;
      console.log(this.productDetails)
    })
  }

  onAddToCart() {
    this.storage.set('cart', {
      line_item: [{
        "product_id": this.productId,
        "quantity": 1
      }]
    });

    let toast = this.toastCtrl.create({
      message: 'Added To Cart',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    this.navCtrl.pop();
  }

}
