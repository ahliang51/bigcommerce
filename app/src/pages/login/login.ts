import { Sim } from '@ionic-native/sim';
import { VerifyNumberPage } from './../verify-number/verify-number';
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
  simPermission = false;

  verifyNumberPage = false; // For user to verify their mobile number

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private loginService: LoginProvider,
    private fb: Facebook,
    private storage: Storage,
    private sim: Sim
  ) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad LoginPage');

    //Check for permission for SIM
    this.sim.requestReadPermission().then(
      () => {
        console.log('Permission granted')
        this.simPermission = true;
      },
      () => this.ionViewWillEnter()
    );


    // this.fb.getLoginStatus().then(result => {
    //   console.log(JSON.stringify(result))
    //   if (result.status == "connected") {
    //     this.navCtrl.setRoot(TabsPage);
    //   }
    //   else {
    //     this.verifyNumberPage = true;
    //   }
    // })
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
        this.navCtrl.push(VerifyNumberPage)
        // if (this.verifyNumberPage) {
        //   this.navCtrl.push(VerifyNumberPage)
        // }
        // else {
        //   this.navCtrl.setRoot(TabsPage);
        // }
      })
      .catch(e => console.log('Error logging into Facebook' + JSON.stringify(e)));
  }

  onSignOut() {
    this.fb.logout().then(result => {
      console.log(JSON.stringify(result))
    })
  }
}
