const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema(
  {
    stock: String,
    price: Number,
    likes: Number,
    price_updated: { type: Date, default: Date.now() },
    ipAddresses: [String]
  }
);

// stockSchema.methods.test = () => { console.log('testing the schema method') };

stockSchema.methods.getPrice = () => { console.log(`Getting price from Stock model!`); };

stockSchema.methods.getLikes = () => { console.log(`Getting likes from Stock model!`); };

module.exports = mongoose.model('Stock', stockSchema);