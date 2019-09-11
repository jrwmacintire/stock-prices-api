const fetch = require("node-fetch");
const path = require("path");
const os = require("os");
const mongoose = require("mongoose");

const Stock = require("../models/Stock.js");

const NODE_ENV = process.env.NODE_ENV;
const DB_URL = process.env.DB_URL;
const API_DAILY_PRICE_URL = process.env.API_DAILY_PRICE_URL;
const API_KEY = process.env.API_KEY;

const ipAddress = os.networkInterfaces().ipAddress;

// Temp JSON data to avoid API calls
const testDaily = require("../data/test_daily_price_sample.json");

function StockHandler() {
  this.createStock = async function(name) {

    try {

      if (name === undefined) throw Error(`No 'name' was provided!`);

      const newStockName = name.toUpperCase(),
        newPrice = await this.fetchStockPrice(name);

      if (typeof newPrice !== "number") {
        throw Error(`Failed to fetch price of new 'stock'!`);
      }

      const newStock = new Stock({
        stock: newStockName,
        price: newPrice,
        likes: 0
      });

      await newStock.save(function(doc) {
        // new stock was saved!
        console.log(`New 'stock' was created!`);
      });

      return newStock;

    } catch(err) {
      // console.error(err);
      throw err;
    }
  };

  this.updateStock = async function(stock, stockLike) {

    try {

      const stockName = (stock.stock).toUpperCase();
      const newStockPrice = await this.fetchStockPrice(stockName);      
      await stock.updateOne({ price: newStockPrice });

    } catch (err) {
      throw err;
      // throw Error("Failed to update stock!");
    }
  };

  this.findStockInDB = async function(name) {

    try {
      
      const query = await Stock.findOne({ stock: name }, function(err, doc) {
        if (err) throw err;
        if(!doc) console.log(`DOC NOT FOUND IN DB!`);
        // debugger;
        return doc;
      });

      return query;

    } catch (err) {
      throw err;
    }

  };

  this.getStockLikes = function() {};

  this.fetchStockPrice = async function(name) {
    console.log(`this.fetchStockData - name: `, name);

    try {

      let newPrice;

      if (NODE_ENV === "test") {
        const data = testDaily;

        // console.log(`data: `, data);
        // console.log(`Time Series (Daily) Info from API:`, data['Time Series (Daily)']);

        const newPrice = Number(data['Time Series (Daily)']['2019-08-07']['1. open']);
        // console.log(`newPrice: `, newPrice);
        return newPrice;

      } else {
        const url = `${API_DAILY_PRICE_URL}${name}&apikey=${API_KEY}`;
        const apiJson = await fetch(url)
          .then(res => res.json())
          .then(json => json.toObject());

        newPrice = 0;
      }

    } catch(err) {
      throw err;
    }

  };

  this.removeStockFromDB = async function(name) {
    // Find the 'TEST' and 'OTHER' docs and delete them before tests are run.

    try {

      await Stock.deleteOne({ stock: name }, doc => console.log(`Deleted doc! `, doc) );

    } catch(err) {
      throw Error('Failed to remove stock from DB!');
    }

  };
}

module.exports = StockHandler;
