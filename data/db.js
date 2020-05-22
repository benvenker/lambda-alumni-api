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

const upVote = (vote) => {
  // take the id of the post and the userID
  const newVote = { ...vote, created_date: new Date() };
  return db("votes")
    .insert(newVote, "id")
    .catch((err) => console.log(err));
};

const findByUsername = async (userName) => {
  try {
    return await db("users")
      .where({ username: userName })
      .then((row) => row);
  } catch (err) {
    console.log(err);
  }
};

const addUser = (username) => {
  console.log({ username });

  const user = { username: username, created_date: new Date() };
  return db("users")
    .where({ username: username })
    .then((rows) => {
      if (rows.length === 0) {
        // no matching records fouund
        return db("users").insert({ ...user }, "id");
      } else {
        throw new Error("the user already exists :)");
      }
    })
    .catch((err) => console.log(err));
};

module.exports = {
  find,
  findById,
  insert,
  findComments,
  insertComment,
  findCommentByPostId,
  findByUsername,
  addUser,
  upVote,
};
