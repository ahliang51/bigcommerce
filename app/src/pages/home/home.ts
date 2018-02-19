import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { ProductCategoriesPage } from '../product-categories/product-categories';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  categories = [];

  constructor(public navCtrl: NavController,
    public productService: ProductProvider) {

  }
  ionViewWillEnter() {
    this.productService.retrieveCategories().subscribe(data => {
      console.log(data);
      this.categories = data;
    })
  }

  viewProducts(categoryId) {
    this.navCtrl.push(ProductCategoriesPage, {
      categoryId: categoryId
    })
    this.productService.retrieveProductCategories(categoryId).subscribe(data => {
      console.log(data)
    })
  }
}
