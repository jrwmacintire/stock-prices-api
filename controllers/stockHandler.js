function StockHandler() {
  
  this.test = function () {
    console.log('testing stockHandler controller');
  }
  
  this.validateStockInDB = function(name) {
    console.log(`this.validateStockInDB - name: ${name}`);
  }
  
  this.validateStockWithAPI = function(name) {
    console.log(`this.validateStockWithAPI - name: ${name}`);
  }
  
  this.saveStock = function(stock) {
    console.log(`this.saveStock - stock: `, stock);
  }
  
  this.updateStockPrice = function(stock) {
    console.log(`this.updateStockPrice - stock: `, stock);
  }
  
  this.increaseStockLikes = function(stock) {
    console.log(`this.increaseStockLikes - stock: `, stock);
  }
  
  this.convertRelativeLikes = function(stock1, stock2) {
    console.log(`this.convertRelativeLikes - stock1: `, stock1, `stock2: `, stock2);
  }
  
  this.getStockPriceFromDB = function(stock) {
    console.log(`this.getStockPriceFromDB - stock: `, stock);
  }
  
  this.getStockPriceFromAPI = function(stock) {
    console.log(`this.getStockPriceFromAPI - stock: `, stock);
  }
  
  this.updateDate = function() {
    const currentDateTime = new Date();
    // console.log('Updating the current stock price date! | currentDateTime: ', currentDateTime);
    return currentDateTime;
  }
  
}

module.exports = StockHandler;