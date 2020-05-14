const knex = require("knex");
const knexConfig = require("./dbconfig");
const db = knex(knexConfig.development);

function find() {
  return db("posts");
}

module.exports = {
  find,
};
