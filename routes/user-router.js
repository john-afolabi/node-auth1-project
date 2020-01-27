const express = require("express");
const { addUser, findUser, getUsers } = require("../helpers/users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();
const uuid = require("uuid");

const activeSessions = [];

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
        const sessionId = uuid();
        activeSessions.push(sessionId);
        res.cookie("sessionId", sessionId, { maxAge: 900000 });
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    });
});

router.get("/users", protected, (req, res) => {
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

function protected(req, res, next) {
  if (activeSessions.includes(req.cookies.sessionId)) {
    next();
  } else {
    res.status(401).json({
      message: `Your cookie is either not there, or it contains no valid sessionId`
    });
  }
}

module.exports = router;
