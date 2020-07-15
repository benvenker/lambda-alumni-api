const db = require('../data/dbConifg');

module.exports = {
  findByUsername,
  addUser,
};

function findByUsername(userName) {
  return db('users')
    .where({ username: userName })
    .then(rows => rows[0])
    .catch(err => console.log(err));
}

function addUser(username) {
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
}
