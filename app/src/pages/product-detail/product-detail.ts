import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { CurrencyPipe } from '@angular/common';


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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private productService: ProductProvider) {
    this.productId = navParams.get("productId")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
    console.log(this.productId)

    this.productService.retrieveProductDetails(this.productId).subscribe(result => {
      // console.log(data)
      this.productDetails = result.data;
      console.log(this.productDetails)
    })
  }

}
