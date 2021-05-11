const express = require("express");
const { body } = require("express-validator");

const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const verifyRole = require("../middleware/role");

const router = express.Router();

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post("/create", create);
router.put("/update/:id", update);
// router.put('/updateProduct/:id', updateProduct);
router.delete("/delete/:id", remove);

/*******************************GET ALL ORDERS************************************/
function getAll(req, res) {
  Order.find()
    .populate("userId")
    .then((orders) => res.send(orders))
    .catch((error) => res.status(400).json(error));
}

/*******************************GET BY ID ORDERS************************************/
function getById(req, res) {
  Order.findById(req.params.id)
    .then((product) => res.send(product))
    .catch((error) => res.status(400).json(error));
}

/*******************************CREATE ORDERS************************************/
async function create(req, res) {
  const order = new Order(req.body);
  console.log(req.body);
  const { products } = req.body;

  try {
    const userDB = await User.findById(req.body.userId);
    if (!userDB) {
      res.status(400).send(`Usuario no encontrado`);
    }

    let total = 0;

    for (let i = 0; i < products.length; i++) {
      const productDB = await Product.findById(products[i].productId);
      if (!productDB) {
        throw new Error(`Producto ID no encontrado ${products[i].productId}`);
      }
      products[i].productPrice = productDB.price;
      products[i].productName = productDB.name;
      total += products[i].productPrice * products[i].quantity;
    }

    order.products = products;
    order.paymentValue = total;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

/*******************************UPDATE ORDERS************************************/
function update(req, res) {
  Order.findById(req.params.id)
    .then((order) => {
      console.log(order.products);
      Object.assign(order, req.body);
      return order.save();
    })
    .then((orderUpdated) => res.send(orderUpdated))
    .catch((error) => res.status(400).json(error));
}

/*******************************DELETE ORDERS************************************/
function remove(req, res) {
  console.log(req.params.id);
  res.send(`Ordenes eliminado con id: ${req.params.id}`);
}

module.exports = router;
