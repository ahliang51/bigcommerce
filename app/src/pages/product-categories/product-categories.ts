import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
 * Generated class for the ProductCategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-categories',
  templateUrl: 'product-categories.html',
})
export class ProductCategoriesPage {

  categoryId;
  productCategories = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private productService: ProductProvider) {
    this.categoryId = navParams.get("categoryId")

  }

  ionViewDidLoad() {
    this.productService.retrieveProductCategories(this.categoryId).subscribe(data => {
      // console.log(data)
      this.productCategories = data;
      console.log(this.productCategories)
    })
  }

  viewDetails(productCategory) {
    this.navCtrl.push(ProductDetailPage, {
      productId: productCategory.id
    })
  }
}
