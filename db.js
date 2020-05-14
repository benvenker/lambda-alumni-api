const knex = require("knex");
const knexConfig = require("./dbconfig");
const db = knex(knexConfig.development);

const find = () => {
  return db("posts");
};

const findById = (id) => {
  return db("posts").where({ id: Number(id) });
};

module.exports = {
  find,
  findById,
};
