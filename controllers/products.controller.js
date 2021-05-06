const express = require("express");
const { body } = require("express-validator");

const Product = require("../models/product.model");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const verifyRole = require("../middleware/role");

const router = express.Router();

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

const validationsCreate = [
  body("name").exists().isString().trim().withMessage("Name invalido"),
  body("price").exists().isNumeric().trim().withMessage("price invalido"),
  body("image").optional().isString().trim().withMessage("image invalido"),
  body("description")
    .optional()
    .isString()
    .trim()
    .withMessage("description invalido"),
];

function create(req, res) {
  const product = new Product(req.body);
  product
    .save()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => res.status(400).json(error));
}

const validationsUpdate = [
  body("name").optional().isString().trim().withMessage("Name invalido"),
  body("price").optional().isNumeric().trim().withMessage("price invalido"),
  body("image").optional().isString().trim().withMessage("image invalido"),
  body("description")
    .optional()
    .isString()
    .trim()
    .withMessage("description invalido"),
];

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
  Product.findById(req.params.id)
    .then((product) => {
      return product.remove(req.params.id);
    })
    .then((productDeleted) => {
      res.status(200);
      res.json(productDeleted);
    })
    .catch((error) => res.status(400).json(error));
}

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post(
  "/create",
  auth,
  verifyRole(["admin"]),
  validate(validationsCreate),
  create
);
router.put(
  "/update/:id",
  auth,
  verifyRole(["admin"]),
  validate(validationsUpdate),
  update
);
router.delete("/delete/:id", auth, verifyRole(["admin"]), remove);

module.exports = router;
