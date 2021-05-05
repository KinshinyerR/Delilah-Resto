require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const productsCrontoller = require("./controllers/products.controller");
const ordersCrontoller = require("./controllers/orders.controller");
const usersCrontoller = require("./controllers/users.controller");

const app = express();
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/products", productsCrontoller);
app.use("/orders", ordersCrontoller);
app.use("/users", usersCrontoller);

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Base de datos conectada");
    app.listen(3000, () => {
      console.log("servidor iniciado en el puerto 3000");
    });
  })
  .catch((error) => console.error(error));
