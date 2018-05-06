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
router.post('/retrieve-events', (req, res, next) => {
    bigCommerce = req.bigCommerce;
    bigCommerce.get('/blog/posts').then(data => {
        res.json(data)
    })
})

module.exports = router;