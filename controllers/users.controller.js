const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const auth = require("../middleware/auth");
const verifyRole = require("../middleware/role");

const router = express.Router();

router.get("/all", auth, verifyRole(['admin']), getAll);
router.get("/getbyid/:id", getById);
router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", auth, update);
router.delete("/delete/:id", auth, remove);

function getAll(req, res) {
  User.find()
    .then((users) => res.send(users))
    .catch((error) => res.status(400).json(error));
}

function getById(req, res) {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((error) => res.status(400).json(error));
}

async function register(req, res) {
  const { user, email } = req.body;
  try {
    const userDB = await User.findOne({
      $or: [{ user: user }, { email: email }],
    });
    if (userDB) {
      throw new Error(`El usuario ya se encuentra registrado`);
    }
    const newUser = new User(req.body);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();
    res.send(`Usuario registado con exito`);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

function login(req, res) {
  const { user, email, password } = req.body;
  User.findOne({
    $or: [{ user: user }, { email: email }],
  })
    .then(async (user) => {
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Usuario o Contraseña incorrecta");
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.send(token);
    })
    .catch((error) => res.status(400).json(error.message));
}

function update(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      Object.assign(user, req.body);
      return user.save();
    })
    .then((userUpdated) => res.send(userUpdated))
    .catch((error) => res.status(400).json(error));
}

function remove(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      return user.remove(req.params.id);
    })
    .then((userDeleted) => {
      res.status(200);
      res.send(`${userDeleted} Usuario eliminado con exito`);
    })
    .catch((error) => res.status(400).json(error));
}

module.exports = router;
