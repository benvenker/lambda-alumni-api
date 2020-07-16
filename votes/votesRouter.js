const express = require('express');
const votes = require('./votesDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

router.get('/id/:postId', (req, res) => {
  if (!req.params.id) {
    return res
      .status(404)
      .json({ error: 'Vote not found. Are you sure you included an ID?' });
  }
  return votes
    .getVotes(req.params.id)
    .then(v => res.stats(200).json({ message: v }))
    .catch(err => res.status(500).json({ error: err }));
});

// Check to see if a vote exists
router.get('/check-vote', (req, res) => {
  const { username, post_id } = req.query;
  const user = { username: username, post_id: post_id };
  return votes
    .checkUserVote(user)
    .then(vote => {
      console.log(vote);
      vote === undefined
        ? res.status(404).json({ message: 'No vote found' })
        : res.status(200).json(vote);
    })
    .catch(err =>
      res.status(500).json({ message: 'Failed to get vote, server error.' })
    );
});

// Upvote a post
router.post('/upvote', (req, res) => {
  return votes
    .upVote(req.body)
    .then(vote => res.json(vote))
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
