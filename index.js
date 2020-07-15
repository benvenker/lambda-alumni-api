require('dotenv').config();
const { server, port, checkJwt } = require('./server.js');
const posts = require('./data/db.js');
const comments = require('./data/db.js');
const users = require('./data/db.js');
const votes = require('./data/db.js');

server.listen(port, () => {
  console.log('Rnning on port 5000!');
  return { message: 'welcome to the API' };
});

server.get('/', (req, res) => {
  res.send('<h1>Welcome to the Lambda Alumni API');
});

// TODO: Migrate to a votesRouter.js file? Create votes model and router files?
server.post('/votes', (req, res) => {
  return votes.getVotes(req.body.post_id).then(v => res.json(v));
});

// TODO: Change to a GET, accept query params, and add to votesRouter.js
server.post('/check-vote', (req, res) => {
  return votes
    .checkUserVote(req.body)
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

server.get('/knex', (req, res) => {
  return comments.testKnexOutput().then(output => res.json(output));
});
