const express = require("express");
const User = require("../models/user.model");

const router = express.Router();

router.get("/all", getAll);
router.get("/getbyid/:id", getById);
router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

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

function register(req, res) {
  const { user, email } = req.body;
  User.findOne({
    $or: [
      {
        user: user,
      },
      {
        email: email,
      },
    ],
  })
    .then((registeredUser) => {
      if (registeredUser) {
        res.send(`Error: El usuario ya se encuentra registrado`);
      } else {
        const user = new User(req.body);
        user.save().then(() => {
          res.send(`Usuario registado con exito`);
        });
      }
    })
    .catch((error) => res.status(400).json(error));
}

function login(req, res) {
  const { user, email, password } = req.body;
  User.findOne({
    $and: [
      {
        $or: [
          {
            user: user,
          },
          {
            email: email,
          },
        ],
      },
      {
        password: password,
      },
    ],
  })
    .then((user) => {
      if (user) {
        res.send(`usuario logeado : ${user}`);
      } else {
        res.send(`Usuario no encontrado`);
      }
    })
    .catch((error) => res.status(400).json(error));
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
