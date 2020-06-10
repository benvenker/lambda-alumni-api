const knex = require("knex");
const knexConfig = require("../dbconfig");
const db = knex(knexConfig.development);
const moment = require("moment");

const find = () => {
  return db
    .raw(
      `select
        p.title,
        p.url,
        p.username,
        p.id,
        p.created_date,
        p.user_id,
        (select count(v.id) as votes from votes v where v.post_id = p.id) as votes,
        (select count(c.id) as comments from comments c where c.post_id = p.id) as comments
        from posts p
        order by p.created_date desc;
        `
    )
    .then((response) => {
      return response.rows.map((row) => {
        return {
          id: row.id,
          user_id: row.user_id,
          title: row.title,
          username: row.username,
          created_date: moment(row.created_date).format("MMMM Do 'YY, h:mm a"),
          url: row.url,
          votes: row.votes,
          comments: row.comments,
        };
      });
    })
    .catch((err) => console.log(err));
};

const findById = (id) => {
  return db
    .raw(
      `select
        p.title,
        p.url,
        p.username,
        p.id,
        p.created_date,
        p.user_id,
        p.body,
        (select count(v.id) as votes from votes v where v.post_id = p.id) as votes,
        (select count(c.id) as comments from comments c where c.post_id = p.id) as comments
        from posts p
        where p.id = ${id};
        `
    )
    .then((response) => response.rows)
    .catch((err) => console.log(err));
};

const insert = (post) => {
  return (
    db("posts")
      .insert(post, "id")
      // .then((ids) => ({ id: ids[0] }))
      .catch((err) => console.log(err))
  );
};

const deletePost = (post) => {
  const id = post.id;
  return db("posts")
    .where({ id: id })
    .del()
    .catch((err) => console.log(err));
};

const edit = (post) => {
  return db("posts").where("id", "=", post.id).update({
    url: post.url,
    title: post.title,
    body: post.body,
  });
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
    .join("users", "users.id", "=", "comments.user_id")
    .select(
      "users.username",
      "comments.body",
      "comments.created_date",
      "comments.user_id"
    )
    .where({ post_id: Number(postId) })
    .orderBy("comments.created_date", "desc")
    .then((rows) => {
      return rows.map((row) => {
        return {
          body: row.body,
          created_date: moment(row.created_date).format("MMMM Do 'YY, h:mm a"),
          user_id: row.user_id,
          username: row.username,
        };
      });
    })
    .catch((err) => console.log(err));
};

const testKnexOutput = () => {
  const voteCount = db.raw(
    `(select count(v.id) as votes from votes v where v.post_id = p.id`
  );

  const commentCount = db.raw(
    `select count(c.id) as comments from comments c where c.post_id = p.id`
  );

  return db
    .select(
      "title",
      "url",
      "username",
      "id",
      "created_date",
      "user_id"
      // voteCount,
      // commentCount
    )
    .from("posts")
    .then((rows) => rows);
};

testKnexOutput();

const findCommentsCountByPostId = (postId) => {
  const id = postId; // don't think is necessary but pg is barking
  return db("comments")
    .count("comments")
    .where({ post_id: id })
    .catch((err) => console.log(err));
};

const upVote = (vote) => {
  // take the id of the post and the userID
  const newVote = { ...vote, created_date: new Date() };
  return db("votes")
    .insert(newVote, "id")
    .catch((err) => console.log(err));
};

const findByUsername = (userName) => {
  return db("users")
    .where({ username: userName })
    .then((rows) => rows[0])
    .catch((err) => console.log(err));
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

const getVotes = (postId) => {
  return db("votes")
    .count("post_id")
    .where({ post_id: postId })
    .then((row) => row)
    .catch((err) => err);
};

const checkUserVote = (voteInfo) => {
  console.log({ voteInfo });
  return db("votes")
    .where({ post_id: voteInfo.post_id, username: voteInfo.username })
    .then((rows) => {
      if (rows.length === 0) {
        return { message: "no votes found" };
      } else if (rows.length > 0) {
        return rows;
      }
    })
    .catch((err) => err);
};

const getMostPopular = () => {
  return db
    .raw(
      `
     select
        p.title,
        p.url,
        p.username,
        p.id,
        p.created_date,
        p.user_id,
        (select count(v.id) as votes from votes v where v.post_id = p.id) as votes,
        (select count(c.id) as comments from comments c where c.post_id = p.id) as comments
        from posts p
        order by votes desc
  `
    )
    .then((res) => res.rows)
    .catch((err) => err);
};

const searchText = (searchObj) => {
  var string = searchObj.terms;
  console.log(`${string.replace(/[""]/g, "")}`);
  return db
    .raw(
      `
    select
        p.title,
        p.url,
        p.username,
        p.id,
        p.created_date,
        p.user_id,
        (select count(v.id) as votes from votes v where v.post_id = p.id) as votes,
        (select count(c.id) as comments from comments c where c.post_id = p.id) as comments
        from posts p
    where post_tokens @@ to_tsquery('${string}')
    order by p.created_date desc;
  `
    )
    .then((res) => res.rows)
    .catch((err) => err);
};

module.exports = {
  edit,
  checkUserVote,
  find,
  findById,
  insert,
  deletePost,
  findComments,
  insertComment,
  findCommentByPostId,
  findByUsername,
  getMostPopular,
  addUser,
  upVote,
  getVotes,
  findCommentsCountByPostId,
  searchText,
  testKnexOutput,
};
