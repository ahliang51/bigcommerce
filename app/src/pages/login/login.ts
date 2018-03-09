import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { Facebook } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';

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

  facebookAppID = 285658675299786;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private loginService: LoginProvider,
    private fb: Facebook,
  ) {
    this.fb.browserInit(this.facebookAppID, "v2.8");
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad LoginPage');
    // console.log(this.storage.get('phoneNumber'))
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

        // //Getting name and gender properties
        return userId
      }).then(userId => {
        this.fb.api("/me?fields=name,gender", params)
          .then(user => {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            console.log(user.name)
            console.log(user.picture)
          });
        this.navCtrl.setRoot(TabsPage);
      })
  }
}
