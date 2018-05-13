import { Sim } from '@ionic-native/sim';
import { VerifyNumberPage } from './../verify-number/verify-number';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
// import { Facebook } from '@ionic-native/facebook';
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

  // facebookAppID = 589248748091275;
  simPermission = false;

  verifyNumberPage = false; // For user to verify their mobile number

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private loginService: LoginProvider,
    // private fb: Facebook,
    private storage: Storage,
    private sim: Sim,
    private alertCtrl: AlertController,
    private platform: Platform,
  ) {
  }

  ionViewWillEnter() {

    this.storage.get('termsAndCondition').then(data => {
      let status = data ? data.initial : false;
      console.log(data)
      if (!status) {
        // Terms & Conditions
        let termsCondition = this.alertCtrl.create({
          title: 'Terms & Conditions',
          message: `
  <p>
  By downloading, browsing, accessing or using Gesel Store mobile 
  application (ìMobile Applicationî), you agree to be bound by 
  these Terms and Conditions of Use. We reserve the right to amend 
  these terms and conditions at any time. If you disagree with any of 
  these Terms and Conditions of Use, you must immediately discontinue 
  your access to the Mobile Application and your use of the services 
  offered on the Mobile Application. Continued use of the Mobile 
  Application will constitute acceptance of these Terms and Conditions 
  of Use, as may be amended from time to time.
  </p>
  
  <p>
  DEFINITIONS
  </p>

  <p>
  In these Terms and Conditions of Use, the following capitalised terms shall have the following meanings, except where the context otherwise requires:
  </p>

  <p>
  "Account" means an account created by a User on the Mobile Application as part of Registration.
  "Register" means to create an Account on the Mobile Application and "Registration" means the act of creating such an Account.
  "Merchant" refers to any entity whose products or Samples can be purchased and/or redeemed (as the case may be) via the Mobile Application.
  "Services"  means all the services provided by Gesel via the Mobile Application to Users, and "Service" means any one of them,
  "Users" means users of the Mobile Application, including you and "User" means any one of them.
  </p>

  <p>
  GENERAL ISSUES ABOUT THE MOBILE APPLICATION AND THE SERVICES
  Applicability of terms and conditions: The use of any Services and/or the Mobile Application and the making  are subject to these Terms and Conditions of Use.
  </p>

  <p>
  Location: The Mobile Application, the Services and are intended solely for use by Users who access the Mobile Application in Singapore. We make no representation that the Services (or any goods or services) are available or otherwise suitable for use outside of Singapore. Notwithstanding the above.
  </p>

  <p>
  RULES ABOUT USE OF THE SERVICE AND THE MOBILE APPLICATION
  </p>

  <p>
  We will use reasonable endeavours to correct any errors or omissions as soon as practicable after being notified of them. However, we do not guarantee that the Mobile Application will be free of faults, and we do not accept liability for any such faults, errors or omissions. In the event of any such error, fault or omission, you should report it by contacting us at HelpDesk Via the Contact Us Page.
  We reserve the right to change, modify, substitute, suspend or remove without notice any information or Services on the Mobile Application from time to time. Your access to the Mobile Application and/or the Services may also be occasionally restricted to allow for repairs, maintenance or the introduction of new facilities or services. 
  We reserve the right to block access to and/or to edit or remove any Account in  reasonable opinion may give rise to a breach of these Terms and Conditions of Use.
  We may periodically make changes to the contents of the Mobile Application, including to the descriptions and prices of goods and services advertised, at any time and without notice. We assume no liability or responsibility for any errors or omissions in the content of the Mobile Application.
  We reserve the right to amend these Terms and Conditions of Use from time to time without notice. The revised Terms and Conditions of Use will be posted on the Mobile Application and shall take effect from the date of such posting. You are advised to review these terms and conditions periodically as they are binding upon you.
  </p>
  
  <p>
  PRODUCT TERMS & CONDITION
  </p>

  <p>
  All products except calling / top up cards should be checked on the spot upon delivered and are strictly non-refundable/exchangable afterwards.
  All calling/topup card number printed on each card or return SMS (with pin number & serial number ) is unique to that card and the Customer shall be solely responsible for keeping the same safeguard against any unauthorised use.
  Gesel will not hold any responsiblities on Calling card credit deduct/loss of credit/techincal issue. Any issue with calling cards (unless brand under Gesel) should contact individual company (customer care) and resolve between users and the company itself. 
  Gesel does not provide refund for any unused portion of the card value whether before or after its expiry date if being appiled. Extension is subtract to approval.
  All decisions made by Gesel shall be deemed final and conclusive.
  Charges for the call shall be as prescribed by Card Brand from time-to-time, GESEL does not control any changes ( uunless brand under GESEL ) being made on calling/topup cards.
  </p>

  <p>
  DELIVERY TERMS & CONDITION
  </p>
  
  <p>
  Delivery will be processed within 5 to 7 workings upon confirmation of purchase. Customer may call customer service to inquiry on the process.
  In event of product out of stock, refund will be made within 3 working days. Customer service officer will contact customer accordingly once confirm that product is out of stock.
  After an order has been placed, changes in the execution of the order desired by the Customer must be brought to GESEL's attention by the Customer by contacting customer service and in a
  timely manner. GESEL respectly reserves the right to the final confirmation of the date or if not Customer to bear the cost of being delivered via courier service to amend the final date of delivery.
  All products (except calling / top up cards) should be checked on the spot (infront of the deliveryman) upon delivered and are strictly non-refundable/exchangable afterwards. Confirmation letter will be offered to sign upon received. GESEL holds the final decision in a dispute cases such as cosmetic damages, sizing and color difference (slight difference in color) after letter of confirmation on product condition being signed.
  </p>
  `,
          buttons: [
            {
              text: 'I Disagree',
              handler: () => {
                this.platform.exitApp();
              }
            },
            {
              text: 'I Agree',
              role: 'cancel',
              handler: () => {
                // If initial is true, that means user has already agreed.
                this.storage.set('termsAndCondition', {
                  initial: true
                })
              }
            }
          ],
          cssClass: 'terms-and-conditions'
        });
        termsCondition.present();
      }
    })

    //Check for permission for SIM
    this.sim.requestReadPermission().then(
      () => {
        this.simPermission = true;
      },
      () => this.ionViewWillEnter()
    );
  }

  onSignUp() {

    // let permissions = new Array<string>();
    // let params = new Array<string>();
    // permissions = ["public_profile", "email"];
    // this.fb.login(permissions)
    //   .then(response => {
    //     let userId = response.authResponse.userID;

    //     // console.log(userId)
    //     // //Getting name and gender properties
    //     return userId
    //   }).then(userId => {
    //     this.fb.api("/me?fields=name,gender,email", params)
    //       .then(user => {
    //         user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
    //         console.log(user.name)
    //         console.log(user.picture)
    //         console.log(user.email)
    //         this.storage.set('user', {
    //           facebookId: userId,
    //           username: user.name,
    //           profilePicture: user.picture,
    //           email: user.email
    //         })
    //       });
    this.navCtrl.push(VerifyNumberPage)
    // })
    // .catch(e => console.log('Error logging into Facebook' + JSON.stringify(e)));
  }

}
