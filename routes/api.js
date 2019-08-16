/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb");
const mongoose = require("mongoose");
const os = require("os");

require('dotenv').config();

// Model
const Stock = require("../models/Stock.js");

// Controller
const StockHandler = require("../controllers/stockHandler.js");
const stockHandler = new StockHandler();

const validateStock = require("../lib/validateStock.js");

const DB_URL = process.env.DB_URL;

module.exports = function(app) {

  app.route("/api/stock-prices").get(function(req, res) {
    const stockName = req.query.stock.toUpperCase(),
          ipAddress = req.hostname,
          stockType = typeof req.query.stock;
    
    const stock = new Stock({
      stock: stockName.toUpperCase(),
      price: 135.28,
      likes: 1,
      price_updated: Date.now(),
      ipAddresses: [ipAddress]
    });

    const response = {
      stock: 'MSFT',
      price: 135.28,
      likes: 1
    };

    // const response = {
    //   stock: stockName,
    //   price: getPrice,
    //   likes: getLikes
    // };

    // Connect to MongoDB instance with Mongoose.
    mongoose.connect(DB_URL, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    db.once('open', function() {
      console.log(`Connected to DB!`);
      
      res.send(response);
    });
  
  });

  // app.route("/api/stock-prices").get(function(req, res) {
  //   // console.log(`req.query: `, req.query);
  //   // res.send(req.query);
  //   // console.log(typeof req.query.stock);

  //   const queryStock = req.query.stock;
  //   const ipAddress = req.host;

  //   mongoose.connect(DB_URL, { useNewUrlParser: true });
  //   const db = mongoose.connection;
  //   const stockName = req.query.stock;
  //   const stock = new Stock({
  //     stock: stockName.toUpperCase(),
  //     price: 135.28,
  //     likes: 1,
  //     price_updated: { type: Date, default: new Date() },
  //     ipAddresses: [ipAddress]
  //   });
  // });

};
