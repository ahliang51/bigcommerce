import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WheelSelector } from '@ionic-native/wheel-selector';


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
import { TopUpPage } from '../pages/top-up/top-up';
import { CartPageModule } from '../pages/cart/cart.module';
import { LoginPageModule } from '../pages/login/login.module';
import { ProductCategoriesPageModule } from '../pages/product-categories/product-categories.module';
import { ProductDetailPageModule } from '../pages/product-detail/product-detail.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { TopUpPageModule } from '../pages/top-up/top-up.module';
import { VerifyNumberPageModule } from '../pages/verify-number/verify-number.module';
import { Push } from '@ionic-native/push';
import { EventProvider } from '../providers/event/event';
import { EventPage } from '../pages/event/event';
import { EventPageModule } from '../pages/event/event.module';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { OrderHistoryPageModule } from '../pages/order-history/order-history.module';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
  ],
  imports: [
    HttpModule,
    CartPageModule,
    LoginPageModule,
    ProductCategoriesPageModule,
    ProductDetailPageModule,
    ProfilePageModule,
    TopUpPageModule,
    VerifyNumberPageModule,
    EventPageModule,
    BrowserModule,
    OrderHistoryPageModule,
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
    TopUpPage,
    EventPage,
    OrderHistoryPage
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
    InAppBrowser,
    WheelSelector,
    Push,
    EventProvider
  ]
})
export class AppModule { }
