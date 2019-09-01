const fetch = require("node-fetch");
const path = require("path");
const mongoose = require("mongoose");

const Stock = require("../models/Stock.js");

const NODE_ENV = process.env.NODE_ENV;
const DB_URL = process.env.DB_URL;
const API_DAILY_PRICE_URL = process.env.API_DAILY_PRICE_URL;
const API_KEY = process.env.API_KEY;

// Temp JSON data to avoid API calls
const testDaily = require('../data/test_daily_price_sample.json');

function StockHandler() {

  this.createStock = async function(name) {
    if (name === undefined) throw Error(`No 'name' was provided!`);

    const newStockName = name.toUpperCase(),
      newPrice = await this.fetchStockPrice(name);

    if (typeof newPrice !== "number") {
      throw Error(`Failed to fetch price of new 'stock'!`);
    }

    const newStock = new Stock({
      stock: newStockName,
      price: newPrice,
      likes: 0,
      price_updated: Date.now()
    });

    return await newStock.save(function(err, doc) {
      if (err) throw err;
      // new stock was saved!
      console.log(`New 'stock' was created!`);
    });

  };

  this.updateStock = async function(stock) {
    
  }

  this.findStockInDB = async function(name) {
    try {
      const query = await Stock.findOne({ stock: name }, function(err, docs) {
        if (err) throw err;
        // debugger;
        return docs;
      });

      return query;
    } catch (err) {
      throw err;
    }
  };

  this.getStockLikes = function() {};

  this.fetchStockPrice = async function(name) {
    console.log(`this.fetchStockData - name: `, name);

    let newPrice;

    if(NODE_ENV === 'test') {
      const data = testDaily;

      console.log(`data: `, data);

      newPrice = 420;
    } else {
      const url = `${API_DAILY_PRICE_URL}${name}&apikey=${API_KEY}`;
      const apiJson = await fetch(url)
        .then(res => res.json())
        .then(json => json);

      newPrice = 0;
    }

    return newPrice;
  };

  this.cleanTestDocsFromDB = function() {
    // Find the 'TEST' and 'OTHER' docs and delete them before tests are run.
  }

}

module.exports = StockHandler;