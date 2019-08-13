const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema(
  {
    stock: String,
    price: Number,
    likes: Number,
    price_updated: { type: Date },
    ipAddresses: [String]
  }
);

stockSchema.methods.test = () => { console.log('testing the schema method') };

module.exports = mongoose.model('Stock', stockSchema);