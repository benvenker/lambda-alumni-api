const db = require('../data/dbConifg');

module.exports = {
  upVote,
  getVotes,
  checkUserVote,
};

const upVote = vote => {
  // take the id of the post and the userID
  const newVote = { ...vote, created_date: new Date() };
  return db('votes')
    .insert(newVote, 'id')
    .catch(err => console.log(err));
};

const getVotes = postId => {
  return db('votes')
    .count('post_id')
    .where({ post_id: postId })
    .then(row => row)
    .catch(err => err);
};

const checkUserVote = voteInfo => {
  console.log({ voteInfo });
  return db('votes')
    .where({ post_id: voteInfo.post_id, username: voteInfo.username })
    .then(rows => {
      if (rows.length === 0) {
        return { message: 'no votes found' };
      } else if (rows.length > 0) {
        return rows;
      }
    })
    .catch(err => err);
};
