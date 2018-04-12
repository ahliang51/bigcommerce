'use strict';
//Import
let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    async = require('async'),
    uuidv4 = require('uuid/v4'),
    config = require('../config/config'),
    db, jwt, bigCommerce, bigCommerceV3;

router.post('/create-cart', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    jwt = req.jwt;

    async.waterfall([
        verifyToken,
        createCart
    ], function (err, result) {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true,
                token: result
            })
        }
    });

    function verifyToken(callback) {
        jwt.verify(req.body.token, config.jwtSecret, function (err, decoded) {
            if (err) {
                callback(err);
            } else {
                callback(null, decoded);
            }
        });
    }

    function createCart(result, callback) {
        bigCommerceV3.post('/carts', {
                customer_id: result.customerEcommerceId,
                line_items: req.body.cart
            })
            .then(data => res.json(data));
    }
})

router.post('/update-cart', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    console.log(req.body.cartId)
    console.log(req.body.itemId)
    bigCommerceV3.put('/carts/' + req.body.cartId + '/items/' + req.body.itemId, {
            line_item: {
                quantity: req.body.quantity,
                product_id: req.body.productId
            }
        })
        .then(data => res.json(data));
})

router.post('/retrieve-cart', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    bigCommerceV3.get('/carts/' + req.body.cartId)
        .then(data => res.json(data));
})

router.post('/test', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    bigCommerceV3.get('/catalog/products/116/variants/129')
        .then(data => res.json(data));
})

router.post('/add-item', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    bigCommerceV3.post('/carts/' + req.body.cartId + '/items', {
            line_items: req.body.item
        })
        .then(data => {
            console.log(data.data.line_items)
            res.json(data);

        })
})

router.post('/remove-item', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    bigCommerceV3.delete('/carts/' + req.body.cartId + '/items/' + req.body.itemId)
        .then(data => {
            res.json(data);
        })
})

//Creating Order
router.post('/place-order', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    jwt = req.jwt;

    let userEcommerceId = "";
    async.waterfall([
        verifyToken,
        createRedirectUrl,
        generateToken
    ], function (err, result) {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true,
                result: result
            })
        }
    });

    function verifyToken(callback) {
        jwt.verify(req.body.jwt, config.jwtSecret, function (err, decoded) {
            if (err) {
                callback(err);
            } else {
                callback(null, decoded);
            }
        });
    }

    function createRedirectUrl(result, callback) {
        userEcommerceId = result.customerEcommerceId;
        bigCommerceV3.post('/carts/' + req.body.cartId + '/redirect_urls')
            .then(url => {
                callback(null, url)
            })
    }

    function generateToken(result, callback) {
        let loginUrl = "",
            checkoutUrl = result.data.checkout_url,
            pattern = ".com",
            redirectUrl = "";
        redirectUrl = checkoutUrl.substr(checkoutUrl.indexOf(pattern) + pattern.length), checkoutUrl.length;


        jwt.sign({
            jti: uuidv4(),
            operation: "customer_login",
            iss: config.bigCommerceClientId,
            iat: Math.round(new Date().getTime() / 1000),
            store_hash: config.bigCommerceStoreHash,
            customer_id: userEcommerceId,
            redirect_to: redirectUrl,
        }, config.bigCommerceClientSecret, {
            expiresIn: '7d'
        }, function (err, token) {
            if (err)
                callback(true)
            else {
                loginUrl = config.bigCommerceLoginUrl + token
                callback(null, loginUrl)
            }
        })
    }





    // bigCommerce.post('/orders',
    //   {
    //     discount_amount: 24.00,
    //     status_id: 11,
    //     payment_method: "Store Credit By Mobile App",
    //     customer_id: 1,
    //     billing_address: {
    //       "first_name": "Trisha",
    //       "last_name": "McLaughlin",
    //       "company": "",
    //       "street_1": "12345 W Anderson Ln",
    //       "street_2": "",
    //       "city": "Austin",
    //       "state": "Texas",
    //       "zip": "78757",
    //       "country": "United States",
    //       "country_iso2": "US",
    //       "phone": "",
    //       "email": "elsie@example.com"
    //     },
    //     products: [
    //       {
    //         "product_id": 112,
    //         "quantity": 2
    //       }]
    //   })
    //   .then(data => res.json(data)
    //   )
    //   .catch(err => { res.json(err) })


    // let storeCredit = 0;
    // bigCommerce.get('/customers/1')
    //   .then(result => {
    //     storeCredit = result.store_credit - 21;
    //     bigCommerce.put('/customers/1', {
    //       store_credit: storeCredit
    //     }).then(result => {
    //       res.json(result)
    //     })
    //   })
});

module.exports = router;