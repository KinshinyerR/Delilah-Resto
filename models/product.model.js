const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imagen: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('product', productSchema);