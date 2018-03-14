import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private fb: Facebook) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ProfilePage');
    this.storage.get('user').then(result => {
      console.log(JSON.stringify(result))
      this.username = result.username,
        this.profilePicture = result.profilePicture
    })
  }


  onSignOut() {
    this.fb.logout().then(result => {
      console.log(JSON.stringify(result))
      if (result == "OK") {
        this.navCtrl.setRoot(LoginPage)
      }
    })
  }
}
