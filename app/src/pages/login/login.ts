import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';

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

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private loginService: LoginProvider,
  ) {
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
}
