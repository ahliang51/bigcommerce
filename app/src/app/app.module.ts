import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';


import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { LoginProvider } from '../providers/login/login';
import { ProductProvider } from '../providers/product/product';
import { ProductCategoriesPage } from '../pages/product-categories/product-categories';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { CartPage } from '../pages/cart/cart';
import { ProfilePage } from '../pages/profile/profile';
import { Facebook } from '@ionic-native/facebook';
import { VerifyNumberPage } from '../pages/verify-number/verify-number';
import { Sim } from '@ionic-native/sim';
import { ProfileProvider } from '../providers/profile/profile';
import { CartProvider } from '../providers/cart/cart';
import { OrderPage } from '../pages/order/order';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CartPage,
    ProfilePage,
    HomePage,
    TabsPage,
    ProductCategoriesPage,
    ProductDetailPage,
    VerifyNumberPage,
    OrderPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    CartPage,
    ProfilePage,
    HomePage,
    TabsPage,
    ProductCategoriesPage,
    ProductDetailPage,
    VerifyNumberPage,
    OrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    ProductProvider,
    Facebook,
    Network,
    Sim,
    ProfileProvider,
    CartProvider,
    InAppBrowser
  ]
})
export class AppModule { }
