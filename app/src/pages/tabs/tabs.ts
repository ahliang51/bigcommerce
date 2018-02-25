import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SuperTabsController } from 'ionic2-super-tabs';
import { CartPage } from '../cart/cart';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CartPage;
  tab3Root = ProfilePage;

  pageTitle = "Home";

  constructor(private superTabsCtrl: SuperTabsController) {
  }

  ngAfterViewInit() {

    // must wait for AfterViewInit if you want to modify the tabs instantly
    // this.superTabsCtrl.setBadge('homeTab', 5);
  }

  hideToolbar() {
    this.superTabsCtrl.showToolbar(false);
  }

  showToolbar() {
    this.superTabsCtrl.showToolbar(true);
  }

  onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    if (ev.index == 0) {
      this.pageTitle = "Home"
    }
    else if (ev.index == 1) {
      this.pageTitle = "Cart"
    }
    else {
      this.pageTitle = "Profile"
    }
  }
}
