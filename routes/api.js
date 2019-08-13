/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect,
      MongoClient = require('mongodb'),
      mongoose = require('mongoose'),
      os = require('os'),
      networkInterfaces = os.networkInterfaces();

// Model
const Stock = require('../models/Stock.js');

// Controller
const StockHandler = require('../controllers/stockHandler.js');
const stockHandler = new StockHandler();

const validateStock = require('../lib/validateStock.js');

const DB_URL = process.env.DB_URL;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      // console.log(`req.query: `, req.query);
      // res.send(req.query);

      const ipAddress = networkInterfaces.lo[0].address;  
      console.log(`IP address: ${ipAddress}`);
    
      const stockName = req.query.stock || req.query.stock[0];
  
      // console.log(`Stock :`, stock);      
  
      mongoose.connect(DB_URL, { useNewUrlParser: true });
  
      const db = mongoose.connection;
  
      // On database connection error
      db.on('error', console.error.bind(console, 'Connection error:'));
  
      // Received 'open' event from database.
      db.on('open', () => {
        console.log('Inside the open database connection.');
        // res.send(stock);
        // console.log(`stockHandler.updateDate: ${stockHandler.updateDate()}`);
        const stock = new Stock({
          stock: stockName.toUpperCase(),
          price: "135.28",
          likes: 1,
          price_updated: { type: Date, default: new Date },
          ipAddresses: [ipAddress]
        });
        
        stock.save((err, stock) => {
          if(err) throw err;
          res.send(stock);
        });
        
      });
  
      db.on('close', () => {
        console.log('Disconnected from the DB!');
      });
    
    });
    
    // const validStock = validateStock(stockName).then(res => { return res });

    //   console.log(`is stock valid?: ${validStock}`);
  
    // });
    
};
