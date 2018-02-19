'use strict';
let express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  async = require('async'),
  http = require('http'),
  BigCommerce = require('node-bigcommerce');

// Initialisation
let app = express(),
  bigCommerce = new BigCommerce({
    logLevel: 'info',
    clientId: '6ghpql63fa6rta160z7ur96gwgn280q',
    accessToken: 'hgqw8707d38ewj8y8ubu23dfuswmsbs',
    responseType: 'json',
    storeHash: 'rf1n0ws0yc',
  });

let storeImagePath = 'https://store-rf1n0ws0yc.mybigcommerce.com/product_images/';




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

// app.post('/login', (req, res, next) => {
//   bigCommerce.get('/customers?email=' + escape('83827925'))
//     .then(data => res.json(console.log(data))
//     );
//   // console.log(req.body);
// });

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


app.get('/auth', (req, res, next) => {
  bigCommerce.get('/customers')
    .then(data => res.json(console.log(data))
    );
});


//Start the server
app.listen(port, () => {
  console.log('Server started on port' + port);
});