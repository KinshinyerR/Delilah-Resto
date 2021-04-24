const express = require("express");

const router = express.Router();

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

function getAll(req, res) {
  res.send("Todos los usuario");
}

function getById(req, res) {
  console.log(req.params.id);
  res.send(`usuario: ${req.params.id}`);
}

function register(req, res) {
  res.send(`usuario creado`);
}

function login(req, res) {
    const {user, password} = req.body;
    res.send(`usuario logeado : ${user}`)
}

function update(req, res) {
  console.log(req.params.id);
  res.send(`usuario actualizado: ${req.params.id}`);
}

function remove(req, res) {
  console.log(req.params.id);
  res.send(`usuario eliminado con id: ${req.params.id}`);
}

module.exports = router;