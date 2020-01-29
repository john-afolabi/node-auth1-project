const express = require("express");
const { addUser, findUser, getUsers } = require("../helpers/users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { restricted } = require("../middleware/restricted-middleware");

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
        req.session.loggedInUser = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res
    .status(200)
    .json({ message: `You have logged out successfully. Goodbye!` });
});

router.get("/users", restricted, (req, res) => {
  getUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: `Could not retrieve registered users at this moment`
      });
    });
});

router.get("/restricted/users", (req, res) => {
  getUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: `Could not retrieve registered users at this moment`
      });
    });
});

module.exports = router;
