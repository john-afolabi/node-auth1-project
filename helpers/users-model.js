const db = require("../data/db-config");

module.exports = {
  addUser,
  getUsers,
  findUser,
  getUserById
};

function getUsers() {
  return db("users");
}

function findUser(filter) {
  return db("users").where(filter);
}

function addUser(newUser) {
  return db("users")
    .insert(newUser, "id")
    .then(ids => {
      const [id] = ids;
      return getUserById(id);
    });
}

function getUserById(id) {
  return db("users")
    .where({ id })
    .first();
}
