'use strict';
//Import
let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    async = require('async'),
    http = require('http'),
    config = require('../config/config'),
    Chance = require('chance'),
    db, jwt, bigCommerce, bigCommerceV3;


//Writing for sign up 
router.post('/sign-up', (req, res, next) => {

    let chance = new Chance();



    //Retrieve Database Connection
    db = req.db;

    //Retrieve JWT
    jwt = req.jwt;

    //Retrieve bigCommerce Connection
    bigCommerce = req.bigCommerce;

    async.waterfall([
        createUserEcommerce,
        createUserMongo,
        generateToken
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

    function createUserEcommerce(callback) {
        bigCommerce.post('/customers', {
            first_name: req.body.name,
            last_name: " ",
            email: req.body.email ? req.body.email : chance.email({
                domain: 'sample.com'
            }),
            phone: req.body.phoneNumber
        }).then(data => {
            callback(null, data)
        })
        // .catch(err => {
        //   callback(true)
        // })
    }

    function createUserMongo(result, callback) {
        db.collection('users').insert({
            customerEcommerceId: result.id,
            phoneNumber: req.body.phoneNumber,
        }).then(data => {
            callback(null, result.id)
        })
        // .catch(err => {
        //   callback(true)
        // })
    }

    function generateToken(result, callback) {
        jwt.sign({
            customerEcommerceId: result
        }, config.jwtSecret, {
            expiresIn: '7d'
        }, function (err, token) {
            if (err)
                callback(true)
            else
                callback(null, token)
        })
    }

});

router.post('/check-user-exist', (req, res, next) => {

    //Retrieve bigCommerce Connection
    bigCommerce = req.bigCommerce;

    let email = req.body.email ? req.body.email : "sample@sample.com";
    let phoneNumber = req.body.phoneNumber;

    console.log(phoneNumber);

    async.waterfall([
        checkEmail,
        checkPhoneNumber
    ], function (err, result) {
        if (err) {
            res.json({
                userExist: true
            })
        } else {
            if (typeof (result) === "boolean") {
                res.json({
                    userExist: result
                })
            } else {
                res.json({
                    userExist: true,
                    userId: result
                })
            }

        }
    });

    function checkEmail(callback) {
        bigCommerce.get('/customers?email=' + email)
            .then(data => {
                if (data) {
                    // console.log(data)
                    // There is such email
                    callback(null, data[0].id)
                    // res.json({
                    //     userId: data[0].id,
                    //     userExist: true
                    // })
                }
                // There is no such email
                else {
                    callback(null, false)
                    // res.json({
                    //     userExist: false
                    // })
                }
            })

    }

    function checkPhoneNumber(result, callback) {
        bigCommerce.get('/customers?phone=' + phoneNumber)
            .then(data => {
                if (data) {
                    // There is such number
                    callback(null, data[0].id)
                }
                // There is no such email
                else {
                    callback(null, false)
                    // res.json({
                    //     userExist: false
                    // })
                }
            })

    }

});

router.post('/update-user-mobile', (req, res, next) => {

    //Retrieve Database Connection
    db = req.db;

    //Retrieve JWT
    jwt = req.jwt;

    //Retrieve bigCommerce Connection
    bigCommerce = req.bigCommerce;

    async.waterfall([
        updateEcommerce,
        updateMongo,
        generateToken
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

    function updateEcommerce(callback) {
        console.log(req.body.userId)
        bigCommerce.put('/customers/' + req.body.userId, {
                phone: req.body.phoneNumber
            })
            .then(result => {
                callback(null, result)
            })
        // .catch(err => console.log(err), callback(true))
    }

    function updateMongo(result, callback) {
        db.collection('users').update({
                customerEcommerceId: req.body.userId
            }, {
                phoneNumber: req.body.phoneNumber
            })
            .then(result => {
                callback(null, result)
            })
        // .catch(err => console.log(err), callback(true))
    }

    function generateToken(result, callback) {
        jwt.sign({
            customerEcommerceId: req.body.userId
        }, config.jwtSecret, {
            expiresIn: '7d'
        }, function (err, token) {
            if (err)
                callback(true)
            else
                callback(null, token)
        })
    }
})


module.exports = router;