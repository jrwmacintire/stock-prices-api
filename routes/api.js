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

const DB_URL = process.env.DB_URL;

module.exports = function(app) {

  app.route("/api/stock-prices").get(function(req, res) {
    const stockQuery = req.query.stock,
          ipAddress = req.hostname,
          stockType = typeof req.query.stock;

    let stockData;

    if(stockType === 'string') {
      const stockName = stockQuery.toUpperCase();

      // validate 'stockName' with call to controller

      // 'stockName' => { validInDB: Bool, validInAPI: Bool, docFound: Stock model }
      const validateStock = stockHandler.validateStock(stockName);

      const stock = new Stock({
        stock: stockName,
        price: stockHandler.getPrice(stockName),
        likes: 0,
        price_updated: Date.now(),
        ipAddresses: [ipAddress]
      });

    } else if(stockType === 'array') {
      console.log('somethinggninggingi');
    }

    // const stockData = {
    //   stock: stockName,
    //   price: stock.getPrice(),
    //   likes: stock.getLikes()
    // };

    stockData = {
      stock: 'MSFT',
      price: 135.28,
      likes: 1
    };
    
    // Return 'stockData' obj.: 'stock', 'price', and 'likes'/'rel_likes'
    res.send(stockData);
    

    // Connect to MongoDB instance with Mongoose.
    // mongoose.connect(DB_URL, { useNewUrlParser: true });
    // const db = mongoose.connection;

    // db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    // db.once('open', function() {
    //   console.log(`Connected to DB!`);

    //   stockData = {
    //     stock: 'MSFT',
    //     price: 135.28,
    //     likes: 1
    //   };
      
    //   // Return 'stockData' obj.: 'stock', 'price', and 'likes'/'rel_likes'
    //   res.send(stockData);

    // });
  
  });

};
