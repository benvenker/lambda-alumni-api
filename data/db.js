const testKnexOutput = () => {
  const voteCount = db.raw(
    `(select count(v.id) as votes from votes v where v.post_id = p.id`
  );

  const commentCount = db.raw(
    `select count(c.id) as comments from comments c where c.post_id = p.id`
  );

  return db
    .select(
      'title',
      'url',
      'username',
      'id',
      'created_date',
      'user_id'
      // voteCount,
      // commentCount
    )
    .from('posts')
    .then(rows => rows);
};

testKnexOutput();

// TODO: Migrate to votesDb.js
const upVote = vote => {
  // take the id of the post and the userID
  const newVote = { ...vote, created_date: new Date() };
  return db('votes')
    .insert(newVote, 'id')
    .catch(err => console.log(err));
};

// TODO: Migrate to usersDb.js
const findByUsername = userName => {
  return db('users')
    .where({ username: userName })
    .then(rows => rows[0])
    .catch(err => console.log(err));
};

// TODO: Migrate to usersDb.js
const addUser = username => {
  console.log({ username });

  const user = { username: username, created_date: new Date() };
  return db('users')
    .where({ username: username })
    .then(rows => {
      if (rows.length === 0) {
        // no matching records fouund
        return db('users').insert({ ...user }, 'id');
      } else {
        throw new Error('the user already exists :)');
      }
    })
    .catch(err => console.log(err));
};

// TODO: migrate to votesDb.js
const getVotes = postId => {
  return db('votes')
    .count('post_id')
    .where({ post_id: postId })
    .then(row => row)
    .catch(err => err);
};

// TODO: migrate to votesDb.js
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
