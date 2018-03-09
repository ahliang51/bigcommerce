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
  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.productService.retrieveCategories().subscribe(data => {
      console.log(data);
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

@Pipe({
  name: 'toRows'
})
export class ToRowsPipe implements PipeTransform {

  transform<T>(value: T[], perRow: number): T[][] {
    let rows: T[][] = [];
    for (let i = 0; i < value.length; i += perRow) {
      rows.push(value.slice(i, i + perRow))
    }
    return rows;
  }

}
