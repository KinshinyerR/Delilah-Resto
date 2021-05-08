const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: { type: Date, required: true },
  paymentType: { type: String, required: true },
  paymentValue: Number,
  status: {
    type: String,
    enum: ["Nuevo", "Confirmado", "Preparando", "Enviado", "Entregado", "Cancelado"],
    default: "Nuevo",
  },
  userId: { type: Schema.ObjectId, ref: "user", required: true },
  products: [
    {
      productId: { type: Schema.ObjectId, ref: "product" },
      productPrice: { type: Number },
      productName: {type: String},
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("order", orderSchema);
