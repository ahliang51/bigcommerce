import { CartProvider } from './../../providers/cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { CurrencyPipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { WheelSelector } from '@ionic-native/wheel-selector';



/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  productId;
  productDetails;
  containResult = false;
  quantity = "1";
  variant = "Select";
  variantIndex;
  variantValidation = false;
  selectedVariant = false;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private productService: ProductProvider,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private cartService: CartProvider,
    private selector: WheelSelector,
    private alertCtrl: AlertController) {
    this.productId = navParams.get("productId")
    console.log(this.productId)
  }

  ionViewDidLoad() {
    this.variantValidation = false;
    this.selectedVariant = false;
    this.quantity = "1";
    this.variantIndex = 0;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 10000
    });

    loading.present();
    // console.log(this.productId)

    this.productService.retrieveProductDetails(this.productId).subscribe(result => {
      // console.log(JSON.stringify(result));
      this.productDetails = result.data;
      loading.dismiss();
      this.containResult = true;
      // console.log(JSON.stringify(this.productDetails))
      this.productDetails.images.sort((a, b) => {
        return b.is_thumbnail - a.is_thumbnail
      })

    });
  }

  onSelectVariant() {
    let option = [];
    this.selectedVariant = true;

    for (let variant of this.productDetails.variants) {
      let optionName = "";

      for (let subVariant of variant.option_values) {
        optionName += subVariant.option_display_name + " " + subVariant.label + " ";
      }
      option.push({
        description: optionName
      })
    }
    let config = {
      title: "Select variant",
      items: [
        option
      ],
      theme: "dark",
      positiveButtonText: "Confirm",
      negativeButtonText: "Cancel"
    };

    this.selector.show({
      title: "Choose Quantity",
      items: [
        option
      ],
    }).then(
      result => {
        this.variant = result[0].description;
        // console.log(JSON.stringify(result))
        // console.log(JSON.stringify(this.productDetails.variants[result[0].index - 1]));
        this.variantIndex = result[0].index
        // console.log(result[0].description + ' at index: ' + result[0].index);
      },
      err => console.log('Error: ', err)
    );
  }

  onSelectQuantity() {
    let data = {
      numbers: [
        { description: "1" },
        { description: "2" },
        { description: "3" },
        { description: "4" },
        { description: "5" },
        { description: "6" },
        { description: "7" },
        { description: "8" },
        { description: "9" },
        { description: "10" }
      ]
    };
    let config = {
      title: "Select a quantity",
      items: [
        data.numbers
      ],
      theme: "dark",
      positiveButtonText: "Confirm",
      negativeButtonText: "Cancel"
    };

    this.selector.show({
      title: "Choose Quantity",
      items: [
        data.numbers
      ],
    }).then(
      result => {
        this.quantity = result[0].description;
        // console.log(result[0].description + ' at index: ' + result[0].index);
      },
      err => console.log('Error: ', err)
    );
  }


  onAddToCart() {
    this.variantValidation = true;
    if (this.productDetails.variants.length > 1) {

      if (!this.selectedVariant) {
        let alert = this.alertCtrl.create({
          title: 'Select Variant',
          subTitle: 'Please select a variant',
          buttons: ['Dismiss']
        });
        this.variantValidation = false;
        alert.present();
      }

    }
    if (this.productDetails.variants[this.variantIndex].inventory_level < this.quantity) {
      let alert = this.alertCtrl.create({
        title: 'Inventory Low',
        subTitle: 'Not enough stock',
        buttons: ['Dismiss']
      });
      console.log(this.productDetails.variants[this.variantIndex].inventory_level + "asd " + this.quantity)
      this.variantValidation = false;
      alert.present();
    }

    if (this.variantValidation) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 10000
      });
      loading.present();

      let toast = this.toastCtrl.create({
        message: 'Added To Cart',
        duration: 2000,
        position: 'bottom'
      });

      this.storage.get('cart').then(result => {
        // console.log(JSON.stringify(result))
        console.log(result)
        //There is a cart already
        if (result) {
          this.storage.get('cart').then(cart => {

            let item = [];
            if (this.productDetails.variants.length > 1) {
              item.push({
                "quantity": this.quantity,
                "product_id": this.productId,
                "variant_id": this.productDetails.variants[this.variantIndex].id
              })
            }
            else {
              // Add item to cart
              item.push(
                {
                  "quantity": this.quantity,
                  "product_id": this.productId
                }
              )
            }
            console.log(JSON.stringify(item))

            this.cartService.addToCart(cart, item).subscribe(data => {
              // console.log(JSON.stringify(data));
              if (data.success) {
                toast.present();
                this.navCtrl.pop();
              }
              else {
                let alert = this.alertCtrl.create({
                  title: 'Inventory Low',
                  subTitle: 'Not enough stock',
                  buttons: ['Dismiss']
                });
                alert.present();
              }
              loading.dismiss();

            })
          })
        }
        //There are no cart
        else {
          this.storage.get('token').then(token => {
            let cart = [];
            console.log(JSON.stringify(cart))
            if (this.productDetails.variants.length > 1) {
              cart.push({
                "quantity": this.quantity,
                "product_id": this.productId,
                "variant_id": this.productDetails.variants[this.variantIndex].id
              })
            }
            else {
              // Add item to cart
              cart.push(
                {
                  "quantity": this.quantity,
                  "product_id": this.productId
                }
              )
            }
            this.cartService.createCart(token, cart).subscribe(result => {
              // console.log(JSON.stringify(result))
              this.storage.set('cart', result.data.id)
              loading.dismiss();
              toast.present();
              this.navCtrl.pop();
            })
          })

        }
      })
    }

  }


}
