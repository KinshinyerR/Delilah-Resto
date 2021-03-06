const express = require("express");
const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const verifyRole = require("../middleware/role");

const router = express.Router();

router.get("/all", auth, verifyRole(["admin"]), getAll);

router.get(
  "/getbyid/:id",
  validate([
    param("id")
      .custom((value) => {
        const respuesta = mongoose.isValidObjectId(value);
        if (!respuesta) {
          throw new Error("Id invalido");
        }
        return true;
      })
      .exists()
      .withMessage("Id invalido"),
  ]),
  auth,
  getById
);

router.post("/create", auth, create);

router.put(
  "/updateOrder/:id",
  validate([
    body("date").optional().isDate().trim().withMessage("date invalido"),
    body("paymentType")
      .optional()
      .isString()
      .trim()
      .withMessage("paymentType invalido"),
    body("paymentValue")
      .optional()
      .isNumeric()
      .trim()
      .withMessage("paymentValue invalido"),
    body("status").optional().isString().trim().withMessage("status invalido"),
  ]),
  auth,
  update
);
router.put(
  "/updateOrder/:orderId/updateProduct/:productId",
  auth,
  verifyRole(["admin"]),
  updateProduct
);
router.put("/addProduct/:orderId", auth, verifyRole(["admin"]), addProduct);

router.delete("/delete/:orderId", auth, verifyRole(["admin"]), remove);
router.delete(
  "/updateOrder/:orderId/deleteProduct/:productId",
  auth,
  verifyRole(["admin"]),
  removeProduct
);

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
    .then((order) => {
      console.log(req.user._id);
      console.log(order.userId);
      console.log(String(req.user._id) !== String(order.userId));

      if (
        req.user.role === "user" &&
        String(req.user._id) !== String(order.userId)
      ) {
        return res.status(401).send("orden no asociada al usuario");
      }
      res.send(order);
    })
    .catch((error) => res.status(400).json(error));
}

/*******************************CREATE ORDERS************************************/
async function create(req, res) {
  const order = new Order(req.body);
  const { products } = req.body;

  try {
    const userDB = await User.findById(req.body.userId);
    if (!userDB) {
      throw new Error("Usuario no encontrado");
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

/*******************************ADD PRODUCT TO ORDER*****************************/
async function addProduct(req, res) {
  const { orderId } = req.params;
  const { productId, quantity } = req.body;

  try {
    let newTotal = 0;

    const orderDB = await Order.findById(orderId);
    if (!orderDB) {
      throw new Error("Orden no encontrada");
    }

    const productDB = await Product.findById(productId);
    if (!productDB) {
      throw new Error(`Producto ID no encontrado ${productId}`);
    }

    orderDB.products.push({
      productId: productId,
      quantity: quantity,
      productPrice: productDB.price,
      productName: productDB.name,
    });

    newTotal = quantity * productDB.price + orderDB.paymentValue;
    orderDB.paymentValue = newTotal;

    await orderDB.save();
    res.json(orderDB);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

/*******************************UPDATE ORDERS************************************/
function update(req, res) {
  Order.findById(req.params.id)
    .then((order) => {
      Object.assign(order, req.body);
      return order.save();
    })
    .then((orderUpdated) => res.send(orderUpdated))
    .catch((error) => res.status(400).json(error));
}

/*******************************UPDATE ORDERS PRODUTS************************************/
async function updateProduct(req, res) {
  const { quantity } = req.body;
  const { orderId, productId } = req.params;

  try {
    let productTotal = 0;
    let newProductTotal = 0;
    let newTotal = 0;

    const orderDB = await Order.findById(orderId);
    if (!orderDB) {
      throw new Error("Orden no encontrada");
    }

    const productDB = await orderDB.products.find(
      (product) => product.productId == productId
    );
    if (!productDB) {
      throw new Error("Producto no encontrado");
    }

    productTotal = productDB.productPrice * productDB.quantity;

    productDB.quantity = quantity;

    newProductTotal = productDB.productPrice * productDB.quantity;

    newTotal = orderDB.paymentValue - productTotal + newProductTotal;

    orderDB.paymentValue = newTotal;

    await orderDB.save();
    res.json(orderDB);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

/*******************************DELETE ORDERS************************************/
async function remove(req, res) {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      return order.remove(orderId);
    })
    .then((orderDeleted) => {
      res.status(200);
      res.send(`${orderDeleted}Orden eliminada con exito`);
    })
    .catch((error) => res.status(400).json(error));
}

/*******************************DELETE PRODUCT TO ORDERS************************************/
async function removeProduct(req, res) {
  const { orderId, productId } = req.params;

  try {
    let newTotal = 0;
    const orderDB = await Order.findById(orderId);
    if (!orderDB) {
      throw new Error("Orden no encontrada");
    }

    const indexProductDB = await orderDB.products.findIndex(
      (product) => product.productId == productId
    );

    if (indexProductDB < 0) {
      throw new Error("Pruduct Id no encontrado");
    }

    newTotal =
      orderDB.paymentValue -
      orderDB.products[indexProductDB].productPrice *
        orderDB.products[indexProductDB].quantity;

    orderDB.paymentValue = newTotal;

    orderDB.products.splice(indexProductDB, 1);

    await orderDB.save();
    res.json(orderDB);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = router;
