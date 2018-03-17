'use strict';
//Import
let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    async = require('async'),
    config = require('../config/config'),
    db, jwt, bigCommerce, bigCommerceV3;

router.post('/retrieve-user-info', (req, res, next) => {
    //Retrieve JWT
    jwt = req.jwt;

    //Retrieve bigCommerce Connection
    bigCommerce = req.bigCommerce;
    async.waterfall([
        verifyToken,
        retrieveUserInfo,
    ], function (err, result) {
        if (err) {
            res.json({
                success: false,
                error: err
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
    };

    function retrieveUserInfo(result, callback) {
        bigCommerce.get('/customers/' + result.customerEcommerceId)
            .then(data => {
                callback(null, data)
            })
    }
});

module.exports = router;