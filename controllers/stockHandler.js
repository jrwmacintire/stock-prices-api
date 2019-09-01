const fetch = require("node-fetch");
const path = require("path");
const mongoose = require("mongoose");

const Stock = require("../models/Stock.js");

const DB_URL = process.env.DB_URL;
const API_DAILY_PRICE_URL = process.env.API_DAILY_PRICE_URL;
const API_KEY = process.env.API_KEY;

function StockHandler() {
  this.createStock = async function(name) {
    if (name === undefined) throw Error(`No 'stockInfo' was provided!`);

    const price = await this.fetchStockPrice(name);

    const newStockName = name.toUpperCase(),
          newPrice = this.fetchStockPrice(name),
          newLikes = this.getStockLikes(name);

    const newStock = new Stock({
      stock: newStockName,
      price: newPrice,
      likes: newLikes
    });

    await newStock.save(function(err, doc) {
      if(err) throw err;
      // new stock was saved!
    });

    return newStock;
  };

  this.findStockInDB = async function(name) {
    
    try {
      
      const queryName = name.toUpperCase();
      const query = await Stock.findOne({ 'stock': queryName }, function(err, docs) {
        if(err) throw err;
        // debugger;
        return docs;
      });

      return query;

    } catch (err) {
      throw err;
    }

  };

  this.fetchStockPrice = async function(name) {
    console.log(`this.fetchStockData - name: `, name);

    const url = `${API_DAILY_PRICE_URL}${name.toUpperCase()}&apikey=${API_KEY}`;
    const apiData = await fetch(url).then(res => res.json()).then(json => json);

    return apiData;

  };
}

module.exports = StockHandler;
