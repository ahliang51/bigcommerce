import { LoginProvider } from './../../providers/login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { Facebook } from '@ionic-native/facebook';

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

  facebookAppID = 589248748091275;

  phoneNumber: number;
  email;
  name;
  validateNumber: boolean = false;
  validateMessage = "";
  facebookId;

  constructor(private navCtrl: NavController,
    private sim: Sim,
    private storage: Storage,
    private loginService: LoginProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: Facebook, ) {

    this.sim.getSimInfo().then(
      (info) => {
        console.log('Sim info: ', JSON.stringify(info))
        if (info.phoneNumber) {
          this.phoneNumber = parseInt(info.phoneNumber.substring(3, info.phoneNumber.length));
        }
        else {
          console.log("asdasd")
          console.log(this.phoneNumber);
          this.validateNumber = true;
        }
      },
      (err) => console.log('Unable to get sim info: ', err)
    );
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyNumberPage');
  }

  textChange(phoneNumber) {
    // if ((phoneNumber.toString()).substring(0, 2) != "65") {
    //   this.validateNumber = true;
    //   this.validateMessage = "Please input SG country code";
    // }
    //Phone Number consist of 8 character and 2 character of country code
    if (phoneNumber.toString().length < 8) {
      this.validateNumber = true;
      this.validateMessage = "Please key in 8 digit mobile number";
    }
    else if (phoneNumber.toString().length > 8) {
      this.validateNumber = true;
      this.validateMessage = "Please key in 8 digit mobile number";
    }
    else {
      this.validateNumber = false;
      this.validateMessage = "";
    }
  }

  onConfirm() {

    //Append Country code to phone number
    let updatedNumber = parseInt("65" + this.phoneNumber);


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
              facebookId: userId,
              username: user.name,
              profilePicture: user.picture,
              email: user.email
            })
          }).then(user => {
            //Retrieving user object and storing phone number inside the user object
            this.storage.get('user').then(result => {
              console.log(JSON.stringify(result))
              result.phoneNumber = updatedNumber
              this.email = result.email ? result.email : "";
              this.name = result.username;
              this.facebookId = result.facebookId;
              this.storage.set('user', result);

              //Check whether does user exist in our database
              this.loginService.checkUserExist(this.email, updatedNumber, this.facebookId).subscribe(data => {
                console.log(JSON.stringify(data))
                // console.log(JSON.stringify(data))
                if (data.userExist) {
                  console.log("1")
                  console.log(JSON.stringify(data))
                  this.loginService.updateUserMobile(data.userId, updatedNumber).subscribe(result => {
                    console.log(JSON.stringify(result))
                    if (result.success) {

                      this.storage.set('token', result.token).then(() => {
                        loading.dismiss();
                        toast.present();
                        this.navCtrl.setRoot(TabsPage)
                      })
                    }
                    else {
                      let toast = this.toastCtrl.create({
                        message: result.message,
                        duration: 3000,
                        position: 'bottom'
                      });
                      toast.present();
                      loading.dismiss();
                    }
                  })
                }
                else {
                  console.log("2")
                  this.loginService.signUp(this.name, this.email, updatedNumber, this.facebookId).subscribe(result => {
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
          })
      })
  }
}
