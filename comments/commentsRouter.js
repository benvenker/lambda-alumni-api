const express = require('express');
const comments = require('./commentsDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

module.exports = router;
