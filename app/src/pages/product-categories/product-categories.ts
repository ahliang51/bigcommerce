import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
  categoryName;
  productCategories = [];
  gridRows = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private productService: ProductProvider,
    public loadingCtrl: LoadingController) {
    this.categoryId = navParams.get("categoryId")
    this.categoryName = navParams.get("categoryName")

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();
    this.productService.retrieveProductCategories(this.categoryId).subscribe(data => {
      // console.log(data)
      if (data.length > 1) {
        this.productCategories = data;
      }
      loading.dismiss();


      // console.log(this.productCategories)
      // console.log(this.gridRows);
    })
  }

  viewDetails(productCategory) {
    this.navCtrl.push(ProductDetailPage, {
      productId: productCategory.id
    })
  }
}
