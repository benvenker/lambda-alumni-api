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

server.get('/knex', (req, res) => {
  return comments.testKnexOutput().then(output => res.json(output));
});
