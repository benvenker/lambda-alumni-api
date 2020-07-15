const express = require('express');
const posts = require('./postsDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

module.exports = router;
