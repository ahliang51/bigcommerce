'use strict';
//Import
let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    async = require('async'),
    config = require('../config/config'),
    db, jwt, bigCommerce, bigCommerceV3;


router.get('/categories', (req, res, next) => {
    bigCommerce = req.bigCommerce;
    bigCommerce.get('/categories')
        .then(data => {
            // for (let temp of data) {
            //     temp.image_file = config.storeImagePath + temp.image_file;
            // }
            // console.log(data)
            res.json(data)
        })
        .catch(err => {
            res.json(err);
        })
});

router.post('/product-categories', (req, res, next) => {
    bigCommerce = req.bigCommerce;
    bigCommerce.get('/products?category=' + req.body.categoryId)
        .then(data => {
            // console.log(data)
            res.json(data)
        })
});


router.post('/product-detail', (req, res, next) => {
    bigCommerceV3 = req.bigCommerceV3;
    bigCommerceV3.get('/catalog/products/' + req.body.productId + '?include=images,variants')
        .then(data => res.json(data));
});


router.post('/banner', (req, res, next) => {
    bigCommerce = req.bigCommerce;
    bigCommerce.get('/banners')
        .then(data => res.json(data));
});

module.exports = router;