const express = require("express");
const productsCrontoller = require('./controllers/products.controller');
const ordersCrontoller = require('./controllers/orders.controller');
const usersCrontoller = require('./controllers/users.controller');

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/products', productsCrontoller);
app.use('/orders', ordersCrontoller);
app.use('/users', usersCrontoller);

app.listen(3000, () => {
  console.log("servidor iniciado en el puerto 3000");
});
