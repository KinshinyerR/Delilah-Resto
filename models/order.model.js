const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: { type: Date, required: true },
  paymentType: { type: String, required: true },
  paymentValue: { type: Number, required: true },
  status: { type: String, required: true },
  user: {type: Object, require: true},
  products: {type: Object, require: true}
});

module.exports = mongoose.model("order", orderSchema);
