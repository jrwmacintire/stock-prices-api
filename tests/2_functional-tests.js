/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('\nFunctional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'test'})
        .end(function(err, res){
          // console.log(`response from GET 'api/stock-prices': `, res.body);
          assert.equal(res.body.stock, 'TEST');
          assert.equal(res.body.price, 100.00);
          assert.equal(res.body.likes, 0);
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'test', like: true})
        .end(function(err, res){
          assert.equal(res.body.stock, 'TEST');
          assert.equal(res.body.price, 100.00);
          assert.equal(res.body.likes, 1);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'test', like: true})
        .end(function(err, res){
          assert.equal(res.body.stock, 'TEST');
          assert.equal(res.body.price, 100.00);
          assert.equal(res.body.likes, 1)
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['test','other'], like: true })
        .end(function(err, res){
          assert.equal(res.body.stock[0].stock, 'TEST');
          assert.equal(res.body.stock[1].stock, 'OTHER');
          assert.isArray(res.body.stock);
          assert.equal(res.body.stock[0].price, 100.00);
          assert.equal(res.body.stock[1].price, 1000.00);
          assert.equal(res.body.stock[0].likes, 1);
          assert.equal(res.body.stock[1].likes, 0);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['test','other'], like: true})
        .end(function(err, res){
          assert.equal(res.body.stock[0], 'TEST');
          assert.equal(res.body.stock[1], 'OTHER');
          assert.isArray(res.body.price);
          assert.equal(res.body.price[0], 100.00);
          assert.equal(res.body.price[1], 1000.00);
          assert.equal(res.body.likes[0], 1);
          assert.equal(res.body.likes[1], 0);
          done();
        });
      });
      
    });

});
