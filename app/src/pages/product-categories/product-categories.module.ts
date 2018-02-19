import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductCategoriesPage } from './product-categories';

@NgModule({
  declarations: [
    ProductCategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductCategoriesPage),
  ],
})
export class ProductCategoriesPageModule {}
