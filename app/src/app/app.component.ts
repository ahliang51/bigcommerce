import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // sim.requestReadPermission().then(
      //   () => console.log('Permission granted'),
      //   () => console.log('Permission not granted')

      // );

      // sim.getSimInfo().then(result => {
      //   console.log(JSON.stringify(result))
      //   // storage.set('phoneNumber', result.cards[0].phoneNumber)
      //   // platform.exitApp()
      // })

      // sim.hasReadPermission().then(
      //   (info) => console.log('Has permission:', info)

      // );
    });
  }
}
