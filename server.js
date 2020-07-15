require('dotenv').config();
const express = require('express');
const cors = require('cors');
const checkJwt = require('./middleware/checkJwt');
const usersRouter = require('./users/usersRouter');
const postsRouter = require('./posts/postsRouter');
const commentsRouter = require('./comments/commentsRouter');
const votesRouter = require('./votes/votesRouter');

const server = express();
const port = process.env.PORT;
server.use(express.json());
server.use(cors());

server.use('/users', usersRouter);
server.use('/posts', postsRouter);
server.use('/comments', commentsRouter);
server.use('/votes', votesRouter);

module.exports = {
  server,
  port,
};
