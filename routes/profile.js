'use strict';
//Import
let express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    async = require('async'),
    config = require('../config/config'),
    mysql = require('mysql'),
    db, jwt, bigCommerce, bigCommerceV3;

// Group by Function
Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}

router.post('/retrieve-user-info', (req, res, next) => {
    //Retrieve JWT
    jwt = req.jwt;
    console.log(req.body)

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
        console.log(result)
        bigCommerce.get('/customers/' + result.customerEcommerceId)
            .then(data => {
                callback(null, data)
            })
    }
});

router.post('/top-up', (req, res, next) => {
    console.log(req.body)

    //Initialise Connection
    let connection = mysql.createConnection({
        host: config.mySqlHost,
        user: config.mySqlUser,
        password: config.mySqlPassword,
        database: config.mySqlDatabase,
        port: config.mySqlPort
    });

    async.waterfall([
        connectDatabase,
        topUp,
        updateStoreCredit,
        insertAccessLog
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

    function connectDatabase(callback) {

        connection.connect(error => {
            if (error) {
                console.error('error connecting: ' + error.stack);
                callback(error)
            } else {
                callback(null, connection)
            }
        });
    }

    function topUp(connection, callback) {
        connection.query(`CALL PRO_TOPUP_TRANSACTION(?,?,?)`, [req.body.userInfo.phoneNumber, req.body.userInfo.accessCode, req.body.userInfo.pinNumber], (err, result, fields) => {
            JSON.stringify(result)
            let status = JSON.parse(JSON.stringify(result[0][0])).STATUS;
            let amount = JSON.parse(JSON.stringify(result[0][0])).AMOUNT;
            console.log(status);
            if (status == 'GOT THE VOUCHER.') {
                callback(null, amount)
            } else {
                callback(status)
            }
            // callback(null, status)
        });
    }

    function updateStoreCredit(amount, callback) {

        console.log(amount)
        //Retrieve bigCommerce Connection
        bigCommerce = req.bigCommerce;

        bigCommerce.get('/customers/' + req.body.userInfo.customerEcommerceId)
            .then(result => {
                bigCommerce.put('/customers/' + req.body.userInfo.customerEcommerceId, {
                        store_credit: parseFloat(result.store_credit) + parseFloat(amount)
                    })
                    .then(updatedResult => {
                        callback(null, "Successfully top up of $" + amount)
                    })
            })
    }

    function insertAccessLog(message, callback) {
        connection.query(`CALL WEB_ACCESS_LOG(?,?,?)`, ["Admin", req.body.userInfo.ipAddress, message + " from " + req.body.userInfo.customerEcommerceId],
            (err, result, fields) => {
                callback(message)
            })
    }
})


router.post('/order-history', (req, res, next) => {
    //Retrieve bigCommerce Connection
    bigCommerce = req.bigCommerce;

    async.waterfall([
        retrieveOrders,
        retrieveProductInformation
    ], function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: err
            })
        } else {
            console.log(result)
            res.json({
                success: true,
                result: result
            })
        }
    });

    function retrieveOrders(callback) {
        bigCommerce.get('/orders?customer_id=' + req.body.customerEcommerceId).then(data => {
            callback(null, data)
        })
    }

    function retrieveProductInformation(result, callback) {
        // console.log(result)
        let orderInfo = result;
        let callbackArray = [];
        let productInfoArray = [];
        let resultArray = [];

        async.each(orderInfo,
            function retrieveInfo(order, callback) {
                bigCommerce.get(order.products.resource)
                    .then(data => {
                        data.date_created = order.date_created;
                        data.total = order.subtotal_inc_tax;
                        callbackArray.push(data)
                        callback()
                    });
            }, err => {
                // console.log(result)
                for (let orderArray of callbackArray) {
                    for (let order of orderArray) {
                        let temp = {
                            order_id: order.order_id,
                            name: order.name,
                            quantity: order.quantity,
                            date_created: orderArray.date_created,
                            total: orderArray.total
                        }
                        productInfoArray.push(temp)
                    }
                }
                console.log(productInfoArray)
                if (productInfoArray.length > 0) {
                    //Group by Order Id
                    result = productInfoArray.groupBy('order_id');
                    // Sort Order Id by descending
                    console.log(result.orderInfo)
                }
                callback(null, result)
            });
    }
});
module.exports = router;