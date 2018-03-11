import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { Facebook } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  facebookAppID = 589248748091275;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private loginService: LoginProvider,
    private fb: Facebook,
    private storage: Storage
  ) {
    // this.fb.browserInit(this.facebookAppID, "v2.9");
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad LoginPage');
    // console.log(this.storage.get('phoneNumber'))
    this.fb.getLoginStatus().then(result => {
      console.log(JSON.stringify(result))
      if (result.status == "connected") {
        this.navCtrl.setRoot(TabsPage);
      }
    })


  }

  onSignIn(phoneNumber) {
    this.loginService.signIn(phoneNumber).subscribe(data => {
      console.log(data);
    })
  }

  onSignUp() {

    let permissions = new Array<string>();
    let params = new Array<string>();
    permissions = ["public_profile", "email"];
    this.fb.login(permissions)
      .then(response => {
        let userId = response.authResponse.userID;

        // console.log(userId)
        // //Getting name and gender properties
        return userId
      }).then(userId => {
        this.fb.api("/me?fields=name,gender,email", params)
          .then(user => {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            console.log(user.name)
            console.log(user.picture)
            console.log(user.email)
            this.storage.set('user', {
              username: user.name,
              profilePicture: user.picture,
              email: user.email
            })
          });
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(e => console.log('Error logging into Facebook' + JSON.stringify(e)));
  }

  onSignOut() {
    this.fb.logout().then(result => {
      console.log(JSON.stringify(result))
    })
  }
}
