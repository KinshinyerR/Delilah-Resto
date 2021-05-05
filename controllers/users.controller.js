const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult, param, oneOf } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user.model");
const auth = require("../middleware/auth");
const verifyRole = require("../middleware/role");
const validate = require("../middleware/validate");

const router = express.Router();

/*******************************GET ALL USERS************************************/
router.get("/all", auth, verifyRole(["admin"]), getAll);

function getAll(req, res) {
  User.find()
    .then((users) => res.send(users))
    .catch((error) => res.status(400).json(error));
}

/*******************************GET BY ID USER***********************************/
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
  verifyRole(["admin"]),
  (req, res) => {
    User.findById(req.params.id)
      .then((user) => res.send(user))
      .catch((error) => res.status(400).json({ error }));
  }
);

/*******************************POST REGISTER USER***********************************/
router.post(
  "/register",
  validate([
    body("user").exists().isString().trim().withMessage("Usuario invalido"),
    body("name").exists().isString().trim().withMessage("Name invalido"),
    body("surname").exists().isString().trim().withMessage("Surname invalido"),
    body("password")
      .exists()
      .isLength({ min: 5 })
      .trim()
      .withMessage("Password invalido"),
    body("phone").exists().isNumeric().trim().withMessage("phone invalido"),
    body("address").exists().isString().trim().withMessage("address invalido"),
    body("role").optional().isString().trim().withMessage("role invalido"),
  ]),
  register
);

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

/*******************************POST LOGIN USER***********************************/
router.post(
  "/login",
  validate([
    oneOf([
      [
        body("user").exists().isString().trim().withMessage("Usuario invalido"),
        body("password").exists(),
      ],
      [
        body("email").exists().isEmail().trim().withMessage("Email invalido"),
        body("password").exists(),
      ],
    ]),
  ]),
  login
);

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

/*******************************PUT(UPDATE) BY ID USER********************************/
router.put("/update/:id", auth, verifyRole(["admin"]), update);

function update(req, res) {
  User.findById(req.params.id)
    .then((user) => {                  /********HACER ESTO**********/
      Object.assign(user, req.body);
      return user.save();
    })
    .then((userUpdated) => res.send(userUpdated))
    .catch((error) => res.status(400).json(error));
}

/*******************************DELETE BY ID USER***********************************/
router.delete("/delete/:id", auth, verifyRole(["admin"]), remove);

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
