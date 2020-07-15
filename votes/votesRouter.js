const express = require('express');
const votes = require('./votesDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

server.get('/:id', (req, res) => {
  return votes.getVotes(req.params.id).then(v => res.json(v));
});

// Check to see if a vote exists
server.get('/check-vote', (req, res) => {
  const { username, post_id } = req.query;
  const user = { useranme: username, post_id: post_id };
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

module.exports = router;
