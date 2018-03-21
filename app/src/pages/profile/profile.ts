import { TopUpPage } from './../top-up/top-up';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { MyApp } from '../../app/app.component';
import { SuperTabsController } from 'ionic2-super-tabs';
import { ProfileProvider } from '../../providers/profile/profile';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  username = "";
  profilePicture = "";
  rootNavCtrl: NavController;
  storeCredit;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private fb: Facebook,
    private superTabsCtrl: SuperTabsController,
    private profileService: ProfileProvider,
    private loadingCtrl: LoadingController, ) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();
    console.log('ionViewDidLoad ProfilePage');
    this.storage.get('user').then(result => {
      console.log(JSON.stringify(result))
      this.username = result.username,
        this.profilePicture = result.profilePicture
    })

    this.storage.get('token').then(result => {
      this.profileService.retrieveProfile(result).subscribe(data => {
        console.log(JSON.stringify(data))
        this.storeCredit = data.result.store_credit;
        loading.dismiss();
      })

    })
  }

  onTopUp() {
    this.rootNavCtrl.push(TopUpPage);
  }

  onSignOut() {
    this.fb.logout().then(result => {
      console.log(JSON.stringify(result))
      if (result == "OK") {
        this.rootNavCtrl.setRoot(LoginPage)
      }
    })
  }
}
