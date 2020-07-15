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

module.exports = {
  testKnexOutput,
};
