import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfileProvider } from '../../providers/profile/profile';
import { mergeMap } from 'rxjs/operators';

/**
 * Generated class for the TopUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up',
  templateUrl: 'top-up.html',
})
export class TopUpPage {

  accessCode;
  pinNumber;
  customerEcommerceId;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private profileService: ProfileProvider) {
    this.accessCode = navParams.get("accessCode");
    this.customerEcommerceId = navParams.get("customerEcommerceId")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopUpPage');
  }

  onTopUp() {



    this.storage.get('user').then(result => {
      console.log(JSON.stringify(result))
      console.log(this.accessCode)
      console.log(this.pinNumber)


      // this.profileService.getIpAddress().subscribe(ipAddress => {
      //   this.profileService.topUp({
      //     phoneNumber: result.phoneNumber,
      //     accessCode: this.accessCode,
      //     pinNumber: this.pinNumber,
      //     ipAddress: ipAddress.ip
      //   }).subscribe(result => {
      //     console.log(result)
      //   })
      // })
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 10000
      });

      loading.present();




      this.profileService.getIpAddress().pipe(mergeMap(ipAddress => this.profileService.topUp({
        phoneNumber: result.phoneNumber,
        accessCode: this.accessCode,
        pinNumber: this.pinNumber,
        ipAddress: ipAddress.ip,
        customerEcommerceId: this.customerEcommerceId
      }))).subscribe(data => {
        console.log(JSON.stringify(data))
        if (!data.success) {
          let toast = this.toastCtrl.create({
            message: data.error,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        }
        else {
          let toast = this.toastCtrl.create({
            message: data.result,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        }
        loading.dismiss();
      });
    });

    // let alert = this.alertCtrl.create({
    //   title: 'Top Up',
    //   subTitle: 'Top Up of Value $10 Success',
    //   buttons: ['Dismiss']
    // });
    // alert.present();
  }
}
