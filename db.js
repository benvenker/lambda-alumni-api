const knex = require("knex");
const knexConfig = require("./dbconfig");
const db = knex(knexConfig.development);

const find = () => {
  return db("posts");
};

const findById = (id) => {
  return db("posts").where({ id: Number(id) });
};

const insert = (post) => {
  return (
    db("posts")
      .insert(post, "id")
      // .then((ids) => ({ id: ids[0] }))
      .catch((err) => console.log(err))
  );
};

module.exports = {
  find,
  findById,
  insert,
};
