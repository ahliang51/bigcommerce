'use strict';
let express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  async = require('async'),
  http = require('http'),
  jwt = require('jsonwebtoken'),
  BigCommerce = require('node-bigcommerce'),
  config = require('./config/config'),
  MongoClient = require('mongodb').MongoClient,
  db;

// Initialisation
let app = express(),
  bigCommerce = new BigCommerce({
    logLevel: config.bigCommerceLogLevel,
    clientId: config.bigCommerceClientId,
    accessToken: config.bigCommerceAccessToken,
    responseType: config.bigCommerceResponseType,
    storeHash: config.bigCommerceStoreHash,
  }),

  bigCommerceV3 = new BigCommerce({
    logLevel: config.bigCommerceLogLevel,
    clientId: config.bigCommerceClientId,
    accessToken: config.bigCommerceAccessToken,
    responseType: config.bigCommerceResponseType,
    storeHash: config.bigCommerceStoreHash,
    apiVersion: 'v3'
  });

//Import Routes
let auth = require('./routes/auth'),
  product = require('./routes/product'),
  profile = require('./routes/profile'),
  cart = require('./routes/cart')


MongoClient.connect(config.database, (err, database) => {
  if (err) return console.log(err)
  db = database.db('big-commerce');
});



//Specifies the port number
let port = process.env.PORT || 3000;

//Body Parser Middleware
app.use(bodyParser.json());


app.use(function (req, res, next) {
  req.db = db;
  req.jwt = jwt;
  req.bigCommerce = bigCommerce;
  req.bigCommerceV3 = bigCommerceV3;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Routes
app.use('/auth', auth);
app.use('/product', product);
app.use('/profile', profile);
app.use('/cart', cart);


app.post('/test1', (req, res, next) => {
  bigCommerceV3.post('/carts', {
      line_items: req.body.line_items
    })
    .then(data => res.json(data));
});

app.post('/tes', (req, res, next) => {
  bigCommerceV3.post('/carts/' + req.body.cartId + '/redirect_urls')
    .then(data => res.json(data));
});


//Creating Order
app.post('/test2', (req, res, next) => {
  let storeCredit = 0;
  bigCommerce.get('/customers/1')
    .then(result => {
      storeCredit = result.store_credit - 21;
      bigCommerce.put('/customers/1', {
        store_credit: storeCredit
      }).then(result => {
        res.json(result)
      })
    })
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
});

app.get('/auth', (req, res, next) => {
  bigCommerce.get('/customers')
    .then(data => res.json(console.log(data)));
});




//Start the server only the connection to database is successful
app.listen(port, () => {
  console.log('Server started on port' + port);
});