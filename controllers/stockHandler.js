const fetch = require("node-fetch");
const path = require("path");
const mongoose = require("mongoose");

const Stock = require("../models/Stock.js");

// const DB_URL = process.env.DB_URL;

function StockHandler() {
  this.getPrice = function(name) {
    // console.log(`stockHandler.getPrice('name' = ${name}) called!`);
    return 100.0;
  };

  this.convertRelativeLikes = function(stock1, stock2) {
    // console.log(`this.convertRelativeLikes - stock1: `, stock1, `stock2: `, stock2);
    return 0;
  };

  this.deleteAllStocks = function() {
    console.log(`Deleting all stocks in DB`);

    Stock.deleteMany();
  };

  this.validateStock = function(name) {
    console.log(`this.validateStock - name: `, name);

    const result = this.findStockinDB(name);

    result.then(obj => console.log(`obj:`, obj));

  };

  this.findStockinDB = function(name) {
    console.log(`this.findStockInDB - name: `, name);

    const dbQuery = Stock.findOne({ stock: "test" });
    const dbItem = dbQuery.then(item => item);

    return dbItem;

  };

  this.fetchStockData = function(name) {
    console.log(`this.fetchStockData - name: `, name);
  };

  // this.updateStockPrice = function(stock) {
  //   console.log(`this.updateStockPrice - stock: `, stock);
  // }

  // this.increaseStockLikes = function(stock) {
  //   console.log(`this.increaseStockLikes - stock: `, stock);
  // }

  // this.getStockPriceFromDB = function(stock) {
  //   console.log(`this.getStockPriceFromDB - stock: `, stock);
  // }

  // this.getStockPriceFromAPI = function(stock) {
  //   console.log(`this.getStockPriceFromAPI - stock: `, stock);
  // }

  // this.updateDate = function() {
  //   const currentDateTime = new Date();
  //   // console.log('Updating the current stock price date! | currentDateTime: ', currentDateTime);
  //   return currentDateTime;
  // }
}

module.exports = StockHandler;
