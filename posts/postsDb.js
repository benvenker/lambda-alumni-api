const db = require('../data/dbConifg');
const moment = require('moment');

module.exports = {
  find,
  findById,
  insert,
  deletePost,
  edit,
  getMostPopular,
  searchText,
};

function find(itemsPerPage, page) {
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
        order by p.created_date desc
        limit ${itemsPerPage} offset ${(page - 1) * itemsPerPage};
        `
    )
    .then(response => {
      return response.rows.map(row => {
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
    .catch(err => console.log(err));
}

function findById(id) {
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
    .then(response => response.rows)
    .catch(err => console.log(err));
}

function insert(post) {
  return (
    db('posts')
      .insert(post, 'id')
      // .then((ids) => ({ id: ids[0] }))
      .catch(err => console.log(err))
  );
}

function deletePost(post) {
  const id = post.id;
  return db('posts')
    .where({ id: id })
    .del()
    .catch(err => console.log(err));
}

function edit(post) {
  return db('posts').where('id', '=', post.id).update({
    url: post.url,
    title: post.title,
    body: post.body,
  });
}

function getMostPopular(itemsPerPage, page) {
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
        limit ${itemsPerPage} offset ${page * itemsPerPage};

  `
    )
    .then(res => res.rows)
    .catch(err => err);
}

function searchText(searchObj) {
  var string = searchObj.terms;
  console.log(`${string.replace(/[""]/g, '')}`);
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
    .then(res => res.rows)
    .catch(err => err);
}
