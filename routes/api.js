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

require("dotenv").config();

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

    if (stockType === "string") {
      const stockName = stockQuery.toUpperCase();
      const validationResult = stockHandler.validateStock(stockName);

      // const stock = new Stock({
      //   stock: stockName,
      //   price: stockHandler.getPrice(stockName),
      //   likes: 0,
      //   price_updated: Date.now(),
      //   ipAddresses: [ipAddress]
      // });

      stockData = {
        stock: stockName,
        price: stockHandler.getPrice(),
        likes: stockHandler.getLikes()
      }

      res.send(stockData);

    } else if (stockType === "object") {
      const stockName1 = stockQuery[0],
            stockName2 = stockQuery[1];

      const validationResult1 = stockHandler.validateStock(stockName);
      const validationResult2 = stockHandler.validateStock(stockName);

      // console.log('');
      // const stock1 = new Stock({
      //   stock: stockName1,
      //   price: stockHandler.getPrice(stockName1),
      //   likes: 0,
      //   price_updated: Date.now(),
      //   ipAddresses: [ipAddress]
      // });

      // const stock2 = new Stock({
      //   stock: stockName1,
      //   price: stockHandler.getPrice(stockName1),
      //   likes: 0,
      //   price_updated: Date.now(),
      //   ipAddresses: [ipAddress]
      // });

      const stockData = {
        stock: stock1,
        price: stockHandler.getPrice(),
        rel_likes: stockHandler.convertRelativeLikes()
      };
      
      res.send([stockData, stockData]);

    } else {
      throw Error(`Query contains a faulty value.`);
    }
    // Return 'stockData' obj.: 'stock', 'price', and 'likes'/'rel_likes'
    // res.send(stockData);
  });
};
