'use strict';
//Import
let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    async = require('async'),
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

module.exports = router;