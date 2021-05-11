const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "user",
      "admin"
    ],
    default: "user",
  },
});

module.exports = mongoose.model("user", userSchema);
