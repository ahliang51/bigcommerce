import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { ProductCategoriesPage } from '../product-categories/product-categories';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  banners = [];
  categories = [];
  rootNavCtrl: NavController;
  storePath = "http://store-5q1eg0d0bi.mybigcommerce.com/";


  constructor(public navCtrl: NavController,
    public productService: ProductProvider,
    public navParams: NavParams,
    public loadingCtrl: LoadingController) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }
  ionViewWillEnter() {
    this.banners = [];
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();

    this.productService.retrieveBanners().subscribe(data => {
      for (let banner of data) {
        let source = banner.content;
        let index = banner.content.search('src');
        // let fileType = banner.content.search('png');
        let fileType = banner.content.indexOf("png", banner.content.indexOf("png") + 1);
        let imagePath = this.storePath + source.substring(index + 28, fileType + 3)
        console.log(imagePath)
        console.log(JSON.stringify(banner));
        this.banners.push({
          src: imagePath
        });
        console.log(this.banners)
      }
      // console.log(JSON.stringify(data));
    })

    this.productService.retrieveCategories().subscribe(data => {
      // console.log(JSON.stringify(data));
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
