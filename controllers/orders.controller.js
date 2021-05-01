const express = require("express");
const order = require("../models/order.model");

const router = express.Router();

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

function getAll(req, res) {
  order.find()
  .then((orders) => res.send(orders))
  .catch((error) => res.status(400).json(error));
  // res.send("Todos los Ordenes");
}
function getById(req, res) {
  console.log(req.params.id);
  res.send(`Ordenes: ${req.params.id}`);
}
function create(req, res) {
  res.send(`Ordenes creado`);
}
function update(req, res) {
  console.log(req.params.id);
  res.send(`Ordenes actualizado: ${req.params.id}`);
}
function remove(req, res) {
  console.log(req.params.id);
  res.send(`Ordenes eliminado con id: ${req.params.id}`);
}

module.exports = router;