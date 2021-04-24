const express = require("express");

const router = express.Router();

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

function getAll(req, res) {
  res.send("Todos los productos");
}
function getById(req, res) {
  console.log(req.params.id);
  res.send(`Producto: ${req.params.id}`);
}
function create(req, res) {
  res.send(`Producto creado`);
}
function update(req, res) {
  console.log(req.params.id);
  res.send(`Producto actualizado: ${req.params.id}`);
}
function remove(req, res) {
  console.log(req.params.id);
  res.send(`Producto eliminado con id: ${req.params.id}`);
}

module.exports = router;