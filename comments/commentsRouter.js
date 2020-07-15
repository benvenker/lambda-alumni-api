const express = require('express');
const comments = require('./commentsDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

// Insert a comment
router.post('/', (req, res) => {
  return comments
    .insertComment(req.body)
    .then(comment => {
      comment === undefined
        ? res.status(404).json({ message: 'There was nothing to insert.' })
        : res.status(200).json(comment);
    })
    .catch(err =>
      res.status(500).json({ error: 'The comment failed to post.' })
    );
});

// Find a posts comments
router.get('/:postId', checkJwt, (req, res) => {
  // console.log(req.params.postId);
  const postId = req.params.postId;
  return comments
    .findCommentByPostId(postId)
    .then(comments => {
      postId === undefined
        ? res
            .status(404)
            .json({ message: 'The specified post has no commments.' })
        : res.status(200).json(comments);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    );
});

// Get a posts comment count
router.get('/:postId/count', (req, res) => {
  const postId = req.params.postId;
  return comments
    .findCommentsCountByPostId(postId)
    .then(commentsCount => {
      postId === undefined
        ? res.status(404).json({
            message: 'The specified comments count could not be retrieved',
          })
        : res.status(200).json(commentsCount);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'the comments information could not be retrieved' });
    });
});

module.exports = router;
