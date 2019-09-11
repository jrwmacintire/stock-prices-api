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
        stockType = typeof req.query.stock;

      let stockNames = [],
          response;

      if (stockType === "string") {
        stockNames.push(queryStock.toUpperCase());

          // Update stock with an appropriate 'like' and if the price
          // needs to be adjusted to be current (in progress).

          try {

            // Find stock in DB.
            const stock = await stockHandler.findStockInDB(stockNames[0]);

            if(stock) {

              await stockHandler.updateStock(stock, queryLike);

              response = {
                stockData: {
                  stock: stock.stock,
                  price: stock.price,
                  likes: stock.likes
                }
              };

              res.send(response);

            } else {

              const newStock = await stockHandler.createStock(stockNames[0], queryLike);

              response = {
                stock: newStock.stock,
                price: newStock.price,
                likes: newStock.likes
              }

              res.send(response);

            }

          } catch(err) {
            throw err;
            // throw Error('Failed to update existing stock!');
          }

      } else if (Array.isArray(queryStock)) {
        stockNames = [...queryStock].map(name => name.toUpperCase());

        // Find stocks in DB using handler and Mongoose.findOne().
        const stock1 = await stockHandler.findStockInDB(stockNames[0]);
        const stock2 = await stockHandler.findStockInDB(stockNames[1]);

        // Before creating any new DB update the
        // existing stocks returned and add any
        // new likes, IP addresses, and 'price_updated'
        // doc properties to reflect newest request.

        if (stock1 && stock2) {
          // Respond with array of stock objects

          // Update both stocks

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

          try {
            
            // If a stock input is missing in the DB,
            // search the API data and create new Mongoose/DB
            // docs for the new stock objects.
            if (!stock1) newStock1 = await stockHandler.createStock(stockNames[0])
            if (!stock2) newStock2 = await stockHandler.createStock(stockNames[1]);

            response = { 
              stockData: [{
                  stock: newStock1.stock,
                  price: newStock1.price,
                  likes: newStock1.likes
                },
                {
                  stock: newStock2.stock,
                  price: newStock2.price,
                  likes: newStock2.likes
                }
              ]
            };

            res.send(response);

          } catch(err) {
            throw Error("Please make sure both inputs are valid.", err);
          }

          /* TODO: Send response with appropriate formatting for each stock
          
          */


        }
      } else {
        throw Error("Query from request is not a string or Array.");
      }
    });
  });
};
