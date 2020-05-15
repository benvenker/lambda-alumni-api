const knex = require("knex");
const knexConfig = require("../dbconfig");
const db = knex(knexConfig.development);

const find = () => {
  return db("posts").orderBy("created_date", "desc");
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

const findComments = () => {
  return db("comments");
};

const insertComment = (comment) => {
  const commentWithDate = { ...comment, created_date: new Date() };
  return db("comments")
    .insert(commentWithDate, "id")
    .catch((err) => console.log(err));
};

const findCommentByPostId = (postId) => {
  return db("comments")
    .where({ post_id: Number(postId) })
    .orderBy("id", "desc")
    .catch((err) => console.log(err));
};

module.exports = {
  find,
  findById,
  insert,
  findComments,
  insertComment,
  findCommentByPostId,
};
