import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { ProductCategoriesPage } from '../product-categories/product-categories';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  categories = [];
  rootNavCtrl: NavController;


  constructor(public navCtrl: NavController,
    public productService: ProductProvider,
    public navParams: NavParams,
    public loadingCtrl: LoadingController) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();

    this.productService.retrieveCategories().subscribe(data => {
      console.log(JSON.stringify(data));
      this.categories = data;
      loading.dismiss();
    })
  }

  viewProducts(categoryId, categoryName) {
    this.rootNavCtrl.push(ProductCategoriesPage, {
      categoryId: categoryId,
      categoryName: categoryName
    })

  }
}
