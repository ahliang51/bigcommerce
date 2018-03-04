'use strict';
let express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  async = require('async'),
  http = require('http'),
  BigCommerce = require('node-bigcommerce'),
  MongoClient = require('mongodb').MongoClient,
  db;

// Initialisation
let app = express(),
  bigCommerce = new BigCommerce({
    logLevel: 'info',
    clientId: 'fyw4wc39x8yk059j65n9iuxu7etfo61',
    accessToken: '1b0o84pk14sa1ner74ygmvqhje4hdml',
    responseType: 'json',
    storeHash: '5q1eg0d0bi',
  }),

  bigCommerceV3 = new BigCommerce({
    logLevel: 'info',
    clientId: 'fyw4wc39x8yk059j65n9iuxu7etfo61',
    accessToken: '1b0o84pk14sa1ner74ygmvqhje4hdml',
    responseType: 'json',
    storeHash: '5q1eg0d0bi',
    apiVersion: 'v3'
  });

MongoClient.connect('mongodb://shengliang:bigcommerce@ds147118.mlab.com:47118/big-commerce', (err, database) => {
  if (err) return console.log(err)
  db = database.db('big-commerce');
});


let storeImagePath = 'https://store-5q1eg0d0bi.mybigcommerce.com/product_images/';




//Specifies the port number
let port = process.env.PORT || 3000;

//Body Parser Middleware
app.use(bodyParser.json());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Login Route
/*
  1) User send email and password
  2) Check for email to retrieve customer ID
  3) Use https://api.bigcommerce.com/stores/rf1n0ws0yc/v2/customers/1/validate to validate password
*/

//Writing for sign up 
app.post('/sign-up', (req, res, next) => {

  async.waterfall([
    createUserEcommerce,
    createUserMongo
  ], function (err, result) {
    if (err) {
      res.json({
        success: false
      })
    } else {
      res.json({
        success: true,
      })
    }
  });

  function createUserEcommerce(callback) {
    bigCommerce.post('/customers', {
      first_name: "asd",
      last_name: "asd",
      email: "asd@asasdd.com",
      phone: req.body.phoneNumber
    }).then(data => {
      console.log(data)
      callback(null, data)
    })
      .catch(err => {
        callback(true)
      })
  }

  function createUserMongo(result, callback) {
    db.collection('users').insert({
      customerEcommerceId: result.id,
      phoneNumber: req.body.phoneNumber,
    }).then(result => {
      callback(null, result)
    })
  }

});

app.get('/categories', (req, res, next) => {
  bigCommerce.get('/categories')
    .then(data => {
      for (let temp of data) {
        temp.image_file = storeImagePath + temp.image_file;
      }
      res.json(data)
    })
});

app.post('/product-categories', (req, res, next) => {
  bigCommerce.get('/products?category=' + req.body.categoryId)
    .then(data => {
      res.json(data)
    })
});


app.post('/product-detail', (req, res, next) => {
  bigCommerceV3.get('/catalog/products/' + req.body.productId + '?include=images,variants')
    .then(data => res.json(data)
    );
});

app.get('/test', (req, res, next) => {
  bigCommerce.get('/payments/methods')
    .then(data => res.json(data)
    );
});

app.post('/test1', (req, res, next) => {
  bigCommerceV3.post('/carts',
    { line_items: req.body.line_items })
    .then(data => res.json(data)
    );
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
    .then(data => res.json(console.log(data))
    );
});




//Start the server only the connection to database is successful
app.listen(port, () => {
  console.log('Server started on port' + port);
});