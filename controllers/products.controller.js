const express = require("express");
const Product = require("../models/product.model");

const router = express.Router();

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

function getAll(req, res) {
  Product.find()
    .then((products) => res.send(products))
    .catch((error) => res.status(400).json(error));
}

function getById(req, res) {
  Product.findById(req.params.id)
    .then((product) => res.send(product))
    .catch((error) => res.status(400).json(error));
}

function create(req, res) {   
  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.send(`Producto creado`);
    })
    .catch((error) => res.status(400).json(error));
}

function update(req, res) {
  Product.findById(req.params.id)
    .then((product) => {
      Object.assign(product, req.body);
      return product.save();
    })
    .then((productUpdated) => res.send(productUpdated))
    .catch((error) => res.status(400).json(error));
}

function remove(req, res) {
  console.log(req.params.id);
  res.send(`Producto eliminado con id: ${req.params.id}`);
}

module.exports = router;
