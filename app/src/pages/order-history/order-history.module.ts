import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderHistoryPage } from './order-history';
import { ExpandableListModule } from 'angular2-expandable-list';

@NgModule({
  declarations: [
    OrderHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderHistoryPage),
    ExpandableListModule
  ],
})
export class OrderHistoryPageModule { }
