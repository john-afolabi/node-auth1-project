const express = require("express");
const { addUser, findUser, getUsers } = require("../helpers/users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const passwordhash = bcrypt.hashSync(password, 10);
  const user = {
    username,
    password: passwordhash
  };
  addUser(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  findUser({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    });
});

module.exports = router;
