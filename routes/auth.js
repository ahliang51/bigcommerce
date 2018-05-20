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
        updateShippingAddress,
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
        let accessCode = chance.string({
            length: 6,
            // Alphanumeric
            //Remove I, L , O , o  all those common misinterpreted characters
            pool: 'QWERTYUPASDFGHJKZXCVBNMqwertyupasdfghjkzxcvbnm234567890'
        });

        bigCommerce.post('/customers', {
            first_name: req.body.name,
            last_name: " ",
            notes: accessCode,
            email: req.body.email ? req.body.email : chance.email({
                domain: 'sample.com'
            }),
            phone: req.body.phoneNumber
        }).then(data => {
            console.log(data)
            callback(null, data)
        })
        // .catch(err => {
        //   callback(true)
        // })
    }

    function updateShippingAddress(result, callback) {
        bigCommerce.post(result.addresses.resource, {
            first_name: req.body.name,
            last_name: req.body.name,
            phone: req.body.phoneNumber,
            street_1: "Singapore",
            city: "Singapore",
            state: "Singapore",
            zip: "Singapore",
            country: "Singapore"
        }).then(data => {
            callback(null, data)
        })
    }

    function createUserMongo(result, callback) {
        db.collection('users').insert({
            customerEcommerceId: result.customer_id,
            phoneNumber: req.body.phoneNumber.toString(),
            facebookId: req.body.facebookId,
            migrateTransactions: []
        }).then(data => {
            callback(null, result.customer_id)
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



// 1) Query MongoDB for such facebookID
router.post('/check-user-exist', (req, res, next) => {

    //Retrieve Database Connection
    db = req.db;

    db.collection('users').findOne({
        facebookId: req.body.facebookId
    }).then(result => {
        if (result) {
            res.json({
                userExist: true,
                userId: result.customerEcommerceId
            })
        } else {
            res.json({
                userExist: false
            })
        }
    })


    // //Retrieve bigCommerce Connection
    // bigCommerce = req.bigCommerce;

    // let email = req.body.email ? req.body.email : "sample@sample.com";
    // let phoneNumber = req.body.phoneNumber;

    // console.log(phoneNumber);

    // async.waterfall([
    //     checkEmail,
    //     checkPhoneNumber
    // ], function (err, result) {
    //     if (err) {
    //         res.json({
    //             userExist: true
    //         })
    //     } else {
    //         if (typeof (result) === "boolean") {
    //             res.json({
    //                 userExist: result
    //             })
    //         } else {
    //             res.json({
    //                 userExist: true,
    //                 userId: result
    //             })
    //         }

    //     }
    // });

    // function checkEmail(callback) {
    //     bigCommerce.get('/customers?email=' + email)
    //         .then(data => {
    //             if (data) {
    //                 console.log(data)
    //                 // There is such email
    //                 callback(null, data[0].id)
    //                 // res.json({
    //                 //     userId: data[0].id,
    //                 //     userExist: true
    //                 // })
    //             }
    //             // There is no such email
    //             else {
    //                 callback(null, false)
    //                 // res.json({
    //                 //     userExist: false
    //                 // })
    //             }
    //         })

    // }

    // function checkPhoneNumber(result, callback) {
    //     bigCommerce.get('/customers?phone=' + phoneNumber)
    //         .then(data => {
    //             if (data) {
    //                 // There is such number
    //                 callback(null, data[0].id)
    //             }
    //             // There is no such email
    //             else {
    //                 callback(null, false)
    //                 // res.json({
    //                 //     userExist: false
    //                 // })
    //             }
    //         })

    // }

});

router.post('/update-user-mobile', (req, res, next) => {

    //Retrieve Database Connection
    db = req.db;

    //Retrieve JWT
    jwt = req.jwt;

    //Retrieve bigCommerce Connection
    bigCommerce = req.bigCommerce;

    async.waterfall([
        checkPhoneNumberExist,
        updateEcommerce,
        updateMongo,
        generateToken
    ], function (err, result) {
        console.log(err)
        console.log(result)
        if (err) {
            res.json({
                success: false,
                message: "Phone number has been registered with another facebook id. Please use the correct phone number"
            })
        } else {
            res.json({
                success: true,
                token: result
            })
        }
    });

    function checkPhoneNumberExist(callback) {
        db.collection('users').findOne({
            phoneNumber: req.body.phoneNumber
        }).then(result => {
            console.log(req.body)
            console.log("check " + JSON.stringify(result))
            //Number Exist
            if (result) {
                if (result.customerEcommerceId == req.body.userId) {
                    callback(null, result)
                } else {
                    callback("Phone number has been registered")
                }
                // if (result.customerEcommerceId == req.body.userId && req.body.phoneNumber == result.phoneNumber) {
                //     callback(null, result)
                // } else {
                //     callback("Phone number has been registered")
                // }
            }
            // Number does not exist
            else {
                callback(null, result)
            }
        })
    }

    function updateEcommerce(result, callback) {
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
                $set: {
                    phoneNumber: req.body.phoneNumber
                }
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

router.post('/test', (req, res, next) => {

    bigCommerce = req.bigCommerce;

    bigCommerce.post('/customers', {
        first_name: "req.body.name",
        last_name: " ",
        notes: "accessCode",
        email: "asd@asd.com",
        phone: "req.body.phoneNumber"
    }).then(data => {
        // console.log(data)

        bigCommerce.post(data.addresses.resource, {
            first_name: "asd",
            last_name: " ",
            phone: " ",
            street_1: " ",
            city: " ",
            state: " ",
            zip: ' ',
            country: "Singapore"
        }).then(result => {
            console.log(result)
            res.json(result)
        })
        // res.json(data)

    })
});

module.exports = router;