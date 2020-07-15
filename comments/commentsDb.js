const db = require('../data/dbConifg');
const moment = require('moment');

module.exports = {
  findComments,
  insertComment,
  findCommentByPostId,
  findCommentsCountByPostId,
};

function findComments() {
  return db('comments');
}

function insertComment(comment) {
  const commentWithDate = { ...comment, created_date: new Date() };
  return db('comments')
    .insert(commentWithDate, 'id')
    .catch(err => console.log(err));
}

function findCommentByPostId(postId) {
  return db('comments')
    .join('users', 'users.id', '=', 'comments.user_id')
    .select(
      'users.username',
      'comments.body',
      'comments.created_date',
      'comments.user_id'
    )
    .where({ post_id: Number(postId) })
    .orderBy('comments.created_date', 'desc')
    .then(rows => {
      return rows.map(row => {
        return {
          body: row.body,
          created_date: moment(row.created_date).format("MMMM Do 'YY, h:mm a"),
          user_id: row.user_id,
          username: row.username,
        };
      });
    })
    .catch(err => console.log(err));
}

function findCommentsCountByPostId(postId) {
  const id = postId; // don't think is necessary but pg is barking
  return db('comments')
    .count('comments')
    .where({ post_id: id })
    .catch(err => console.log(err));
}
