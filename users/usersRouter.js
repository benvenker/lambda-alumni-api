const express = require('express');
const users = require('./usersDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

router.get('/username', (req, res) => {
  return users.findByUsername(req.query.username).then(user => res.json(user));
  // return res.json(req);
});

router.post('/', (req, res) => {
  if (!req.body.username || req.body.username === undefined) {
    return res.status(404).json({ error: 'Username is required.' });
  }
  if (req.body.username !== '') {
    return users.addUser(req.body.username).then(user => {
      res.status(200).json(user);
    });
  } else if (req.body.username === '') {
    return null;
  }
  return req.body;
});

module.exports = router;
