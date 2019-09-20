/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

const Stock = require("../models/Stock.js");

chai.use(chaiHttp);

suite("\nFunctional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    this.beforeAll(function(done) {
      console.log(`Try to delete test items from DB now.`);
      const deleteTEST = Stock.findOneAndDelete({ stock: "TEST" });
      const deleteOTHER = Stock.findOneAndDelete({ stock: "OTHER" });
      // console.log(`query in 'beforeAll': `, query);
      deleteTEST.then(_ => console.log(`TEST successfully deleted!`));
      deleteOTHER.then(_ => console.log(`OTHER successfully deleted!`));
      done();
    });

    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "test" })
        .end(function(err, res) {
          // console.log(`response from GET 'api/stock-prices': `, res.body);
          assert.equal(res.body.stockData.stock, "TEST");
          assert.equal(res.body.stockData.price, 100.0);
          assert.equal(res.body.stockData.likes, 0);
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "test", like: true })
        .end(function(err, res) {
          assert.equal(res.body.stockData.stock, "TEST");
          assert.equal(res.body.stockData.price, 100.0);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "test", like: true })
        .end(function(err, res) {
          assert.equal(res.body.stockData.stock, "TEST");
          assert.equal(res.body.stockData.price, 100.0);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["test", "other"] })
        .end(function(err, res) {
          assert.equal(res.body.stockData[0].stock, "TEST");
          assert.equal(res.body.stockData[1].stock, "OTHER");
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData[0].price, 100.0);
          assert.equal(res.body.stockData[1].price, 1000.0);
          assert.equal(res.body.stockData[0].likes, 1);
          assert.equal(res.body.stockData[1].likes, 0);
          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["test", "other"], like: true })
        .end(function(err, res) {
          assert.equal(res.body.stockData[0].stock, "TEST");
          assert.equal(res.body.stockData[1].stock, "OTHER");
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData[0].price, 100.0);
          assert.equal(res.body.stockData[1].price, 1000.0);
          assert.equal(res.body.stockData[0].likes, 1);
          assert.equal(res.body.stockData[1].likes, 1);
          done();
        });
    });
  });
});
