require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./spec.yaml');
const cors = require('cors')


const productsCrontoller = require("./controllers/products.controller");
const ordersCrontoller = require("./controllers/orders.controller");
const usersCrontoller = require("./controllers/users.controller");

const app = express();
app.use(cors())
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`servidor iniciado en el puerto ${port}`);
    });
  })
  .catch((error) => console.error(error));
