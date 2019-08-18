/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

var chai = require("chai");
const assert = require('assert');
var StockHandler = require("../controllers/stockHandler.js");

var stockHandler = new StockHandler();

suite("Unit Tests", function() {
  // none required

  describe('#validateStock()', () => {
     it('should return a truthy value', function() {
         assert.ok(stockHandler.validateStock('test'));
     });
  });

});
