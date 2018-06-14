import { VerifyNumberPage } from './../pages/verify-number/verify-number';
import { Sim } from '@ionic-native/sim';
import { Component } from '@angular/core';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { Network } from '@ionic-native/network';
import { Facebook } from '@ionic-native/facebook';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;


  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    network: Network,
    sim: Sim,
    fb: Facebook,
    alertCtrl: AlertController,
    toastCtrl: ToastController,
    push: Push
  ) {


    platform.ready().then(() => {
      // this.rootPage = VerifyNumberPage
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      splashScreen.hide();


      // this.rootPage = VerifyNumberPage;

      fb.getLoginStatus().then(result => {
        console.log(JSON.stringify(result))
        if (result.status == "connected") {
          this.rootPage = TabsPage;
        }
        else {
          this.rootPage = LoginPage;
        }
      })

      //Handling of back button
      platform.registerBackButtonAction(() => {
        let alert = alertCtrl.create({
          title: 'Exit App',
          message: 'Are you sure you want to exit?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            },
            {
              text: 'Exit',
              handler: () => {
                platform.exitApp();
              }
            }
          ]
        });
        alert.present();
      })

      let options: PushOptions = {
        android: {
          senderID: '1020958347417'
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
        },
        windows: {}
      };

      let pushObject: PushObject = push.init(options);

      pushObject.on('notification').subscribe((notification: any) => {
        if (notification.additionalData.foreground) {
          let alert = alertCtrl.create({
            title: 'New Push notification',
            message: notification.message
          });
          alert.present();
        }
      });


      // watch network for a disconnect
      let disconnectSubscription = network.onDisconnect().subscribe(() => {
        let toast = toastCtrl.create({
          message: 'No internet',
          duration: 3000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      });

      // // stop disconnect watch
      // disconnectSubscription.unsubscribe();

      // // watch network for a connection
      // let connectSubscription = network.onConnect().subscribe(() => {
      //   console.log('network connected!');
      //   // We just got a connection but we need to wait briefly
      //   // before we determine the connection type. Might need to wait.
      //   // prior to doing any api requests as well.
      //   setTimeout(() => {
      //     if (network.type === 'wifi') {
      //       console.log('we got a wifi connection, woohoo!');
      //     }
      //   }, 3000);
      // });

    });

  }

}
