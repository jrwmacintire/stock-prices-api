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
const fetch = require("node-fetch");

require("dotenv").config();

// Controller
const StockHandler = require("../controllers/stockHandler.js");
const stockHandler = new StockHandler();

const DB_URL = process.env.DB_URL;
const NODE_ENV = process.env.NODE_ENV;

module.exports = function(app) {
  app.route("/api/stock-prices").get(async function(req, res) {
    mongoose.connect(DB_URL, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on(
      "error",
      console.error.bind(console, "MongoDB/Mongoose connection error")
    );

    db.once("open", async function() {
      console.log("Connected to DB!");

      const queryStock = req.query.stock,
        queryLike = req.query.like,
        stockType = typeof req.query.stock,
        ipAddress = req.hostname,
        stockLike = queryLike === "true" ? true : false;

      let stockNames = [],
        response;

      if (stockType === "string") {
        stockNames.push(queryStock.toUpperCase());

        // Update stock with an appropriate 'like' and if the price
        // needs to be adjusted to be current (in progress).

        try {
          const stockName = stockNames[0];
          // Find stock in DB.
          // if(stockLike === true) console.log(`'stock' was liked!`);
          let stock = await stockHandler.findStockInDB(
            stockName,
            stockLike
          );
          const ipAddresses = [...stock.ipAddresses];

          const outOfDatePrice = stockHandler.isPriceOutdated(
            stock.price_updated
          );

          if (outOfDatePrice && !stock.isNew) {
            stock = await stockHandler.updateStock(
              stockName,
              stockLike,
              ipAddress
            );
          }

          response = {
            stockData: {
              stock: stock.stock,
              price: String(stock.price),
              likes: stock.likes
            }
          };

        } catch (err) {
          
          // throw err;
          response = 'Error finding stock info! Please try again!';

        } finally {
          // Return requested 'stockData' object as 'response'
          console.log(`response: `, response);
          res.json(response);
        }
      } else if (Array.isArray(queryStock)) {
        stockNames = [...queryStock].map(name => name.toUpperCase());

        const stockName1 = stockNames[0],
              stockName2 = stockNames[1];

        let response;

        try {

          // Find stocks in DB using handler and Mongoose.findOne().
          let stock1 = await stockHandler.findStockInDB(
            stockName1,
            stockLike,
            ipAddress
          );
          let stock2 = await stockHandler.findStockInDB(
            stockName2,
            stockLike,
            ipAddress
          );

          const stock1IPAddresses = [...stock1.ipAddresses],
                stock2IPAddresses = [...stock2.ipAddresses],
                stock1OutOfDate = stockHandler.isPriceOutdated(
                  stock1.price_updated
                ),
                stock2OutOfDate = stockHandler.isPriceOutdated(
                  stock2.price_updated
                );

          // Update out of date stocks here.
          let updatedStock1, updatedStock2;

          if(stock1OutOfDate && !stock1.isNew) stock1 = await stockHandler.updateStock(stockName1, stockLike, ipAddress);
          if(stock2OutOfDate && !stock2.isNew) stock2 = await stockHandler.updateStock(stockName2, stockLike, ipAddress);

          const relativeLikes = stockHandler.getRelativeLikes(stock1.likes, stock2.likes);

          const stock1Data = {
                stock: stock1.stock,
                price: stock1.price,
                rel_likes: relativeLikes[0]
              },
              stock2Data = {
                stock: stock2.stock,
                price: stock2.price,
                rel_likes: relativeLikes[1]
              };

          response = {
            stockData: [
              stock1Data,
              stock2Data
            ]
          };

        } catch (err) {

          throw err

        } finally {

          console.log(`response: `, response);
          res.json(response);

        }

        // Before creating any new DB update the
        // existing stocks returned and add any
        // new likes, IP addresses, and 'price_updated'
        // doc properties to reflect newest request.
      } else {
        throw Error("Query from request is not a string or Array.");
      }
    });
  });
};
