const fetch = require("node-fetch");
const path = require("path");
const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

function StockHandler() {
  this.getPrice = function(name) {
    // console.log(`stockHandler.getPrice('name' = ${name}) called!`);
  };

  this.validateStock = function(name) {
    // console.log(`stockHandler.validateStock('name' = ${name}) called!`);

    const validInDB = this.validateStockWithDB(name);
    const validInAPI = this.validateStockWithAPI(name);

    return {
      validInDB: validInDB.valid || false,
      validInAPI: validInAPI.valid || false,
      doc: validInDB.doc || null,
      apiData: validInAPI.apiData || null
    };
  };

  // (name) => { valid: Bool, doc: Stock obj. }
  this.validateStockWithDB = function(name) {
    console.log(`this.validateStockWithDB - name: ${name}`);

    // Connect to MongoDB instance with Mongoose.
    mongoose.connect(DB_URL, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error!'));

    db.once('open', function() {
      console.log(`Connected to DB!`);
      return {
        valid: false,
        doc: null
      };
    });

    // const query;

    return {
      valid: false,
      doc: null
    };

  };

  // (name) => { valid: Bool, apiData: JSON data from API match }
  this.validateStockWithAPI = async function(name) {
    console.log(`this.validateStockWithAPI - name: ${name}`);

    // const apiJson = await fetch('http://localhost:3000/data/search_sample.json')
    //   .then(res => res.json())
    //   .then(json => json)
    //   .catch(err => { throw err });

    // check api data for solid match

    // const apiObj = {
    //   valid: null,
    //   apiData: apiJson || { "emptyData": "apiJson was empty" }
    // };

    // return apiObj;

    return {
      valid: false,
      apiData: null
    };

  };














  // this.saveStock = function(stock) {
  //   console.log(`this.saveStock - stock: `, stock);
  // }

  // this.updateStockPrice = function(stock) {
  //   console.log(`this.updateStockPrice - stock: `, stock);
  // }

  // this.increaseStockLikes = function(stock) {
  //   console.log(`this.increaseStockLikes - stock: `, stock);
  // }

  // this.convertRelativeLikes = function(stock1, stock2) {
  //   console.log(`this.convertRelativeLikes - stock1: `, stock1, `stock2: `, stock2);
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
