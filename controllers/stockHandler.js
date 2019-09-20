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
const otherDaily = require("../data/other_daily_price_sample.json");

function StockHandler() {

  this.createStock = async function(name, like, ipAddress) {
    try {
      if (name === undefined) throw Error(`No 'name' was provided!`);

      const newStockName = name.toUpperCase(),
        newPrice = await this.fetchStockPrice(name),
        newLikes = like === true ? 1 : 0;

      if (typeof newPrice !== "number") {
        throw Error(`Failed to fetch price of new 'stock'!`);
      }

      const dataNoIpAddress = {
        stock: newStockName,
        price: newPrice,
        likes: newLikes
      };

      const dataWithIpAddress = {
        stock: newStockName,
        price: newPrice,
        likes: newLikes,
        ipAddresses: [ipAddress]
      };

      if(like) {
        data = dataWithIpAddress;
      } else {
        data = dataNoIpAddress;
      }

      const newStock = new Stock(data);

      await newStock.save(function(doc) {
        // new stock was saved!
        console.log(`New 'stock' was created!`);
      });

      return newStock;

    } catch (err) {
      throw err;
    }
  };

  this.updateStock = async function(name, like, ipAddress) {

    // const name = stock.stock,
    //       likes = stock.likes,
    //       ipAddresses = [...stock.ipAddresses];

    try {

      const query = { stock: name };
      const stock = await Stock.findOne(query);

      const newPrice = await this.fetchStockPrice(name),
            likes = stock.likes,
            ipAddresses = [...stock.ipAddresses],
            today = new Date();

      const usedIpAddress = ipAddresses.indexOf(ipAddress);

      if(usedIpAddress === -1 && like) {
        const newIpAddresses = [...stock.ipAddresses, ipAddress];
        stock.likes = likes + 1;
        stock.ipAddresses = newIpAddresses;
      }

      stock.price = newPrice;
      stock.price_updated = today;
      stock.save();

      return await stock;

    } catch (err) { throw err }

  };

  this.findStockInDB = async function(name, like) {
    try {
      const query = await Stock.findOne({ stock: name }, async function(doc) {
        if (!doc) {
          // console.log(`DOC NOT FOUND IN DB!`);
          // throw Error('stock not found');
        }

        return doc;
      });

      if (query === null) {
        // console.log(`'stock' not found! Create a new 'stock' now?`);
        const newStock = await this.createStock(name, like);
        return newStock;
      } else {
        return query;
      }
    } catch (err) {
      throw err;
    }
  };

  this.getStockLikes = function() {};

  this.fetchStockPrice = async function(name) {
    // console.log(`this.fetchStockData - name: `, name);

    try {
      let newPrice;

      if (NODE_ENV === "test") {
        const dataTest = testDaily,
              dataOther = otherDaily;

        // console.log(`data: `, data);
        // console.log(`Time Series (Daily) Info from API:`, data['Time Series (Daily)']);

        if(name === 'TEST') {
          newPrice = Number(
            dataTest["Time Series (Daily)"]["2019-08-07"]["1. open"]
          );
          // console.log(`newPrice: `, newPrice);
          return newPrice;
        } else if(name === 'OTHER') {
          newPrice = Number(
            dataOther["Time Series (Daily)"]["2019-08-07"]["1. open"]
          );
          // console.log(`newPrice: `, newPrice);
          return newPrice;
          
        } else {
          throw Error('Error using preloaded data.')
        }

      } else {
        const url = `${API_DAILY_PRICE_URL}${name}&apikey=${API_KEY}`;
        const apiJson = await fetch(url)
          .then(res => res.json());

        newPrice = Number(apiJson["Time Series (Daily)"]["2019-08-07"]["1. open"]);
        return newPrice;
      }
    } catch (err) {
      throw err;
    }
  };

  this.removeStockFromDB = async function(name) {
    // Find the 'TEST' and 'OTHER' docs and delete them before tests are run.

    try {
      await Stock.deleteOne({ stock: name }, doc =>
        console.log(`Deleted doc! `, doc)
      );
    } catch (err) {
      throw Error("Failed to remove stock from DB!");
    }
  };

  this.isPriceOutdated = function(updateDate) {
    // console.log(`'stock's date: ${lastUpdated}`);
    const date = new Date();
    const last = updateDate.toISOString().substring(0,10),
          today = date.toISOString().substring(0, 10);

    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const lastMatches = last.match(dateRegex);
    const todayMatches = today.match(dateRegex);
    const testMatches = "2019-05-10".match(dateRegex);

    /*
    TODO: Compare each index (after 0) of 'todayMatches'
    if a 'today' value is newer than a 'lastUpdated' value
    then return that the price is outdated and needs updating.
    */

    let valid = false;

    todayMatches.forEach((match, index) => {
      if (index === 0) return;
      const curr = Number(match);
      let last;
      if(NODE_ENV === 'test') last = Number(testMatches[index]);
      else if(NODE_ENV !== 'test') last = Number(lastMatches[index]);
      if (curr > last) valid = true;
    });

    return valid;
  };

  this.getRelativeLikes = function(likes1, likes2) {
    if(likes1 >= likes2) {
      return [likes1 - likes2, likes2 - likes1];
    } else {
      return [likes2 - likes1, likes1 - likes2];
    }
  }
}

module.exports = StockHandler;
