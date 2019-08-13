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

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft'})
        .end(function(err, res){
          console.log(`response from GET 'api/stock-prices': `, res.body)
          assert.equal(res.body.stock, 'MSFT');
          assert.equal(res.body.price, '135.28');
          assert.equal(res.body.likes, 1);
          assert.isArray(res.body.ipAddresses);
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft', like: true})
        .end(function(err, res){
          assert.equal(res.body.stock, 'MSFT');
          assert.equal(res.body.price, '135.28');
          assert.equal(res.body.likes, 1);
          assert.isArray(res.body.ipAddresses);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft', like: true})
        .end(function(err, res){
          assert.equal(res.body.stock, 'MSFT');
          assert.equal(res.body.price, '135.28');
          assert.equal(res.body.likes, 1)
          assert.isArray(res.body.ipAddresses);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['msft','goog']})
        .end(function(err, res){
          assert.equal(res.body.stock, 'MSFT');
          assert.equal(res.body.stock, 'GOOG');
          assert.isArray(res.body.price);
          assert.equal(res.body.price[0], '135.28');
          assert.equal(res.body.price[1], '1173.99');
          assert.equal(res.body.likes[0], 1);
          assert.equal(res.body.likes[1], 0);
          assert.isArray(res.body.ipAddresses);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['msft','goog'], like: true})
        .end(function(err, res){
          assert.equal(res.body.stock, 'MSFT');
          assert.equal(res.body.stock, 'GOOG');
          assert.isArray(res.body.price);
          assert.equal(res.body.price[0], '135.28');
          assert.equal(res.body.price[1], '1173.99');
          assert.equal(res.body.likes[0], 1);
          assert.equal(res.body.likes[1], 1);
          assert.isArray(res.body.ipAddresses);
          
          done();
        });
      });
      
    });

});
