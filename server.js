const express = require("express");
const mongoose = require("mongoose");
const productsCrontoller = require("./controllers/products.controller");
const ordersCrontoller = require("./controllers/orders.controller");
const usersCrontoller = require("./controllers/users.controller");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/products", productsCrontoller);
app.use("/orders", ordersCrontoller);
app.use("/users", usersCrontoller);

mongoose
  .connect(
    "mongodb+srv://dbadmin:Q1w2e3r4t5@cluster0.wtsge.mongodb.net/DelilahResto?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Base de datos conectada");
    app.listen(3000, () => {
      console.log("servidor iniciado en el puerto 3000");
    });
  })
  .catch((error) => console.error(error));
