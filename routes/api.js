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
const fetch = require("node-fetch");

require("dotenv").config();

// Controller
const StockHandler = require("../controllers/stockHandler.js");
const stockHandler = new StockHandler();

const DB_URL = process.env.DB_URL;

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
        ipAddress = req.hostname,
        stockType = typeof req.query.stock;

      let stockNames = [],
          response;

      if (stockType === "string") {
        stockNames.push(queryStock.toUpperCase());

        // Find stock in DB.
        const stock = await stockHandler.findStockInDB(stockNames[0]);

        // If stock object exists, or is created, then build response.
        if (stock) {

          // Update stock with an appropriate 'like' and if the price
          // needs to be adjusted to be current (in progress).
          const updatedStock = stockHandler.updateStock(stock);

          response = {
            stockData: {
              stock: stockNames[0],
              price: stock.price,
              likes: stock.likes
            }
          };

          res.send(response);

        } else {

          // Create a new stock, or throw an Error for invalid input.
          try {
            const newStock = await stockHandler.createStock(stockNames[0]);
            res.send(response);
          } catch(err) {
            throw Error(`Invalid 'stock' input`);
          }

        }
      } else if (Array.isArray(queryStock)) {
        stockNames = [...queryStock].map(name => name.toUpperCase());

        // Find stocks in DB using handler and Mongoose.findOne().
        let stock1 = await stockHandler.findStockInDB(stockNames[0]);
        let stock2 = await stockHandler.findStockInDB(stockNames[1]);

        // Before creating any new DB update the
        // existing stocks returned and add any
        // new likes, IP addresses, and 'price_updated'
        // doc properties to reflect newest request.

        if (stock1 && stock2) {
          // Respond with array of stock objects
          response = { 
            stockData: [{
                stock: stockNames[0].toUpperCase(),
                price: stock1.price,
                likes: stock1.likes
              },
              {
                stock: stockNames[1].toUpperCase(),
                price: stock2.price,
                likes: stock2.likes
              }
            ]
          };

          res.send(response);

        } else {

          // If a stock input is missing in the DB,
          // search the API data and create new Mongoose/DB
          // docs for the new stock objects.
          if (!stock1) stock1 = await stockHandler.createStock(stockNames[0])
          if (!stock2) stock2 = await stockHandler.createStock(stockNames[1]);
          else throw Error("Please make sure both inputs are valid.");

        }
      } else {
        throw Error("Query from request is not a string or Array.");
      }
    });
  });
};
