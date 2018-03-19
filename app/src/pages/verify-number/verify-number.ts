import { LoginProvider } from './../../providers/login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the VerifyNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verify-number',
  templateUrl: 'verify-number.html',
})
export class VerifyNumberPage {

  phoneNumber: number = 0;
  email;
  name;
  validateNumber: boolean = false;
  validateMessage = "";

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private sim: Sim,
    private storage: Storage,
    private loginService: LoginProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {

    this.sim.getSimInfo().then(
      (info) => {
        console.log('Sim info: ', JSON.stringify(info))
        this.phoneNumber = parseInt(info.phoneNumber.substring(1, info.phoneNumber.length));
        if (this.phoneNumber.toString().length > 0) {
          console.log("asdasd")
          this.validateNumber = false;
        }
      },
      (err) => console.log('Unable to get sim info: ', err)
    );
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyNumberPage');
  }

  textChange(phoneNumber) {
    if ((phoneNumber.toString()).substring(0, 2) != "65") {
      this.validateNumber = true;
      this.validateMessage = "Please input SG country code";
    }
    //Phone Number consist of 8 character and 2 character of country code
    else if (phoneNumber.toString().length < 10) {
      this.validateNumber = true;
      this.validateMessage = "Please key in 8 digit mobile number";
    }
    else if (phoneNumber.toString().length > 10) {
      this.validateNumber = true;
      this.validateMessage = "Please key in 8 digit mobile number";
    }
    else {
      this.validateNumber = false;
      this.validateMessage = "";
    }
  }

  onConfirm() {
    //Sets the loading spinner
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();

    let toast = this.toastCtrl.create({
      message: 'You have successfully login',
      duration: 3000,
      position: 'bottom'
    });

    console.log(this.phoneNumber);
    //Retrieving user object and storing phone number inside the user object
    this.storage.get('user').then(result => {
      console.log(JSON.stringify(result))
      result.phoneNumber = this.phoneNumber
      this.email = result.email;
      this.name = result.username;
      this.storage.set('user', result);

      //Check whether does user exist in our database
      this.loginService.checkUserExist(this.email).subscribe(data => {
        // console.log(JSON.stringify(data))
        if (data.userExist) {
          console.log("1")
          this.loginService.updateUserMobile(data.userId, this.phoneNumber).subscribe(result => {
            console.log(JSON.stringify(result))
            if (result.success) {

              this.storage.set('token', result.token).then(() => {
                loading.dismiss();
                toast.present();
                this.navCtrl.setRoot(TabsPage)
              })
            }
          })
        }
        else {
          console.log("2")
          this.loginService.signUp(this.name, this.email, this.phoneNumber).subscribe(result => {
            console.log(JSON.stringify(result))

            if (result.success) {
              this.storage.set('token', result.token).then(() => {
                loading.dismiss();
                toast.present();
                this.navCtrl.setRoot(TabsPage)
              })
            }
          })
        }
      })
    })


  }
}
